import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    Subscription,
    ReactivateSubscription,
    UpgradeSubscription,
    UpgradeSubscriptionWithWebhook,
} from '@/lib/actions/stripe/subscription'
import { createClientRole } from '@/utils/supabase/server'
import type Stripe from 'stripe'

const { mockSubscriptionsUpdate, mockSubscriptionsRetrieve } = vi.hoisted(
    () => ({
        mockSubscriptionsUpdate: vi.fn(),
        mockSubscriptionsRetrieve: vi.fn(),
    })
)
vi.mock('@/utils/stripe/server', () => ({
    stripeClient: vi.fn(() => ({
        subscriptions: {
            update: mockSubscriptionsUpdate,
            retrieve: mockSubscriptionsRetrieve,
        },
    })),
}))

vi.mock('@/utils/supabase/server', () => ({
    createClientRole: vi.fn(),
}))

const mockEvent = {
    data: {
        object: {
            id: 'sub_test123',
            customer: 'cus_test123',
            plan: { id: 'price_test123' },
            metadata: { user_id: 'user-uuid-1' },
            current_period_end: 1700000000,
            cancel_at_period_end: false,
        },
    },
} as unknown as Stripe.CustomerSubscriptionCreatedEvent

const mockUpdatedEvent = {
    data: {
        object: {
            id: 'sub_test123',
            customer: 'cus_test123',
            plan: { id: 'price_test123' },
            metadata: { user_id: 'user-uuid-1' },
            current_period_end: 1700000000,
            cancel_at_period_end: false,
        },
    },
} as unknown as Stripe.CustomerSubscriptionUpdatedEvent

const mockFrom = ({
    planResult = { data: { id: 1 }, error: null },
    updateResult = { data: [{}], error: null },
}: {
    planResult?: {
        data: { id: number } | null
        error: { message: string } | null
    }
    updateResult?: { data: object | null; error: { message: string } | null }
} = {}) =>
    vi.fn((table: string) => {
        if (table === 'plan') {
            return {
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue(planResult),
                    }),
                }),
            }
        }
        if (table === 'subscription') {
            return {
                update: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        select: vi.fn().mockResolvedValue(updateResult),
                    }),
                }),
            }
        }
        throw new Error(`想定外のテーブル: ${table}`)
    })

describe('Subscription', () => {
    it('正常時、planを紐付けてSubscriptionをuser_idでupdateする', async () => {
        const from = mockFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await Subscription(mockEvent)

        expect(from).toHaveBeenCalledWith('subscription')
    })

    it('plan取得でエラーの場合、throwする', async () => {
        const from = mockFrom({
            planResult: { data: null, error: { message: 'not found' } },
        })

        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(Subscription(mockEvent)).rejects.toThrow(
            'Error fetching plan data'
        )
    })

    it('subscription更新でエラーの場合、throwする', async () => {
        const from = mockFrom({
            updateResult: { data: null, error: { message: 'db error' } },
        })

        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(Subscription(mockEvent)).rejects.toThrow(
            'Error updating subscription'
        )
    })
})

const mockReactivateFrom = ({
    selectResult = {
        data: { stripe_subscription_id: 'sub_test123' },
        error: null,
    },
    updateResult = { error: null },
}: {
    selectResult?: {
        data: { stripe_subscription_id: string } | null
        error: { message: string } | null
    }
    updateResult?: { error: { message: string } | null }
} = {}) =>
    vi.fn((table: string) => {
        if (table === 'subscription') {
            return {
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue(selectResult),
                    }),
                }),
                update: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue(updateResult),
                }),
            }
        }
        throw new Error(`想定外のテーブル: ${table}`)
    })

describe('ReactivateSubscription', () => {
    beforeEach(() => {
        mockSubscriptionsUpdate.mockClear()
    })

    it('正常時、Stripeを再アクティブ化しDBを更新する', async () => {
        const from = mockReactivateFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)
        mockSubscriptionsUpdate.mockResolvedValue({
            cancel_at_period_end: false,
        })

        await ReactivateSubscription('user-uuid-1')

        expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('sub_test123', {
            cancel_at_period_end: false,
        })
        expect(from).toHaveBeenCalledWith('subscription')
    })

    it('該当するsubscriptionが見つからない場合、何もしない', async () => {
        const from = mockReactivateFrom({
            selectResult: { data: null, error: { message: 'not found' } },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(
            ReactivateSubscription('user-uuid-1')
        ).resolves.not.toThrow()
        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
    })

    it('DB更新でエラーの場合、throwする', async () => {
        const from = mockReactivateFrom({
            updateResult: { error: { message: 'db error' } },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)
        mockSubscriptionsUpdate.mockResolvedValue({
            cancel_at_period_end: false,
        })

        await expect(ReactivateSubscription('user-uuid-1')).rejects.toThrow(
            'Error updating subscription'
        )
    })
})

describe('UpgradeSubscription', () => {
    beforeEach(() => {
        mockSubscriptionsRetrieve.mockClear()
        mockSubscriptionsUpdate.mockClear()
    })

    it('現在のsubscription itemを取得し、新しいpriceでupdateする', async () => {
        mockSubscriptionsRetrieve.mockResolvedValue({
            items: { data: [{ id: 'si_test123' }] },
        })
        mockSubscriptionsUpdate.mockResolvedValue({})

        await UpgradeSubscription('sub_test123', 'price_new123')

        expect(mockSubscriptionsRetrieve).toHaveBeenCalledWith('sub_test123')
        expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('sub_test123', {
            items: [{ id: 'si_test123', price: 'price_new123' }],
            proration_behavior: 'create_prorations',
        })
    })
})

describe('UpgradeSubscriptionWithWebhook', () => {
    it('正常時、planを紐付けてSubscriptionをuser_idでupdateする', async () => {
        const from = mockFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await UpgradeSubscriptionWithWebhook(mockUpdatedEvent)

        expect(from).toHaveBeenCalledWith('subscription')
    })

    it('plan取得でエラーの場合、throwする', async () => {
        const from = mockFrom({
            planResult: { data: null, error: { message: 'not found' } },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(
            UpgradeSubscriptionWithWebhook(mockUpdatedEvent)
        ).rejects.toThrow('Error fetching plan data')
    })

    it('subscription更新でエラーの場合、throwする', async () => {
        const from = mockFrom({
            updateResult: { data: null, error: { message: 'db error' } },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(
            UpgradeSubscriptionWithWebhook(mockUpdatedEvent)
        ).rejects.toThrow('Error updating subscription')
    })
})
