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
            items: {
                data: [
                    {
                        price: { id: 'price_test123' },
                    },
                ],
            },
            metadata: { user_id: 'user-uuid-1' },
            status: 'active',
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
            items: {
                data: [
                    {
                        price: { id: 'price_test123' },
                    },
                ],
            },
            metadata: { user_id: 'user-uuid-1' },
            status: 'active',
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
} = {}) => {
    // updateに渡された中身を検証したいので、モック関数の参照を外に出しておく
    const update = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue(updateResult),
        }),
    })

    const from = vi.fn((table: string) => {
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
            return { update }
        }
        throw new Error(`想定外のテーブル: ${table}`)
    })

    return { from, update }
}

describe('Subscription', () => {
    it('正常時、planを紐付けてSubscriptionをuser_idでupdateする', async () => {
        const { from, update } = mockFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await Subscription(mockEvent)

        expect(from).toHaveBeenCalledWith('subscription')
        // current_period_endは実行環境のタイムゾーンで文字列が変わるため検証対象から外す
        expect(update).toHaveBeenCalledWith(
            expect.objectContaining({
                plan_id: 1,
                user_id: 'user-uuid-1',
                stripe_customer_id: 'cus_test123',
                stripe_subscription_id: 'sub_test123',
                price_id: 'price_test123',
                status: 'active',
                cancel_at_period_end: false,
            })
        )
    })

    it('plan取得でエラーの場合、throwする', async () => {
        const { from } = mockFrom({
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
        const { from } = mockFrom({
            updateResult: { data: null, error: { message: 'db error' } },
        })

        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(Subscription(mockEvent)).rejects.toThrow(
            'Error updating subscription'
        )
    })

    it('metadata.user_idが無い場合、DBに触らず正常終了する', async () => {
        // console.errorを差し替えて、テスト出力を汚さずに呼び出しを検証する
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        const { from } = mockFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        const eventWithoutUserId = {
            data: {
                object: { ...mockEvent.data.object, metadata: {} },
            },
        } as unknown as Stripe.CustomerSubscriptionCreatedEvent

        // throwしない（＝Stripeに200を返しリトライさせない）
        await expect(Subscription(eventWithoutUserId)).resolves.not.toThrow()
        // DBアクセス自体が発生していない
        expect(from).not.toHaveBeenCalled()
        // 人間が気づけるログが出ている
        expect(consoleError).toHaveBeenCalled()

        consoleError.mockRestore()
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
        // mockClearは呼び出し履歴しか消さないため、前のテストのmockRejectedValueが
        // 残らないようmockResetで実装ごとリセットする
        mockSubscriptionsUpdate.mockReset()
    })

    it('正常時、Stripeを再アクティブ化しDBを更新する', async () => {
        const from = mockReactivateFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)
        mockSubscriptionsUpdate.mockResolvedValue({
            cancel_at_period_end: false,
        })

        const result = await ReactivateSubscription('user-uuid-1')

        expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('sub_test123', {
            cancel_at_period_end: false,
        })
        expect(from).toHaveBeenCalledWith('subscription')
        expect(result).toEqual({
            messageType: 'success',
            message: 'サブスクリプションの再開に成功しました',
        })
    })

    it('該当するsubscriptionが見つからない場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        const from = mockReactivateFrom({
            selectResult: { data: null, error: { message: 'not found' } },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        const result = await ReactivateSubscription('user-uuid-1')

        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message: 'サブスクリプションの再開に失敗しました',
        })
    })

    it('DB更新でエラーの場合、エラーメッセージを返す', async () => {
        const from = mockReactivateFrom({
            updateResult: { error: { message: 'db error' } },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)
        mockSubscriptionsUpdate.mockResolvedValue({
            cancel_at_period_end: false,
        })

        const result = await ReactivateSubscription('user-uuid-1')

        expect(result).toEqual({
            messageType: 'error',
            message: 'サブスクリプションの再開に失敗しました',
        })
    })

    it('Stripe呼び出しが失敗した場合、エラーメッセージを返す', async () => {
        const from = mockReactivateFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)
        mockSubscriptionsUpdate.mockRejectedValue(new Error('stripe down'))

        const result = await ReactivateSubscription('user-uuid-1')

        expect(result).toEqual({
            messageType: 'error',
            message: 'サブスクリプションの再開に失敗しました',
        })
    })
})

describe('UpgradeSubscription', () => {
    beforeEach(() => {
        mockSubscriptionsRetrieve.mockReset()
        mockSubscriptionsUpdate.mockReset()
    })

    it('現在のsubscription itemを取得し、新しいpriceでupdateする', async () => {
        mockSubscriptionsRetrieve.mockResolvedValue({
            items: { data: [{ id: 'si_test123' }] },
        })
        mockSubscriptionsUpdate.mockResolvedValue({})

        const result = await UpgradeSubscription('sub_test123', 'price_new123')

        expect(mockSubscriptionsRetrieve).toHaveBeenCalledWith('sub_test123')
        expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('sub_test123', {
            items: [{ id: 'si_test123', price: 'price_new123' }],
            proration_behavior: 'create_prorations',
        })
        expect(result).toEqual({
            messageType: 'success',
            message: 'サブスクリプションのアップグレードに成功しました',
        })
    })

    it('Stripe呼び出しが失敗した場合、エラーメッセージを返す', async () => {
        mockSubscriptionsRetrieve.mockRejectedValue(new Error('stripe down'))

        const result = await UpgradeSubscription('sub_test123', 'price_new123')

        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message: 'サブスクリプションのアップグレードに失敗しました',
        })
    })
})

describe('UpgradeSubscriptionWithWebhook', () => {
    it('正常時、planを紐付けてSubscriptionをuser_idでupdateする', async () => {
        const { from, update } = mockFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await UpgradeSubscriptionWithWebhook(mockUpdatedEvent)

        expect(from).toHaveBeenCalledWith('subscription')
        expect(update).toHaveBeenCalledWith(
            expect.objectContaining({
                plan_id: 1,
                user_id: 'user-uuid-1',
                price_id: 'price_test123',
                status: 'active',
            })
        )
    })

    it('plan取得でエラーの場合、throwする', async () => {
        const { from } = mockFrom({
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
        const { from } = mockFrom({
            updateResult: { data: null, error: { message: 'db error' } },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(
            UpgradeSubscriptionWithWebhook(mockUpdatedEvent)
        ).rejects.toThrow('Error updating subscription')
    })

    it('metadata.user_idが無い場合、DBに触らず正常終了する', async () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        const { from } = mockFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        const eventWithoutUserId = {
            data: {
                object: { ...mockUpdatedEvent.data.object, metadata: {} },
            },
        } as unknown as Stripe.CustomerSubscriptionUpdatedEvent

        await expect(
            UpgradeSubscriptionWithWebhook(eventWithoutUserId)
        ).resolves.not.toThrow()
        expect(from).not.toHaveBeenCalled()
        expect(consoleError).toHaveBeenCalled()

        consoleError.mockRestore()
    })
})
