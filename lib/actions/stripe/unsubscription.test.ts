import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    Unsubscription,
    UnsubscriptionWebhook,
} from '@/lib/actions/stripe/unsubscription'
import { createClientRole } from '@/utils/supabase/server'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'

const { mockSubscriptionsUpdate } = vi.hoisted(() => ({
    mockSubscriptionsUpdate: vi.fn(),
}))

vi.mock('@/utils/stripe/server', () => ({
    stripeClient: vi.fn(() => ({
        subscriptions: {
            update: mockSubscriptionsUpdate,
        },
    })),
}))

vi.mock('@/utils/supabase/server', () => ({
    createClientRole: vi.fn(),
}))

// ログインユーザーはセッションから取るので、getUserPlanをモックして差し替える
vi.mock('@/lib/functions/profile/getUserPlan', () => ({
    getUserPlan: vi.fn(),
}))

const UNSUBSCRIPTION_ERROR = {
    messageType: 'error',
    message: 'サブスクリプションの解約に失敗しました',
}

const mockLoginUserPlan = (
    stripeSubscriptionId: string | null = 'sub_123456'
) => {
    vi.mocked(getUserPlan).mockResolvedValue({
        user_id: 'user-uuid-1',
        stripe_subscription_id: stripeSubscriptionId,
    } as unknown as Awaited<ReturnType<typeof getUserPlan>>)
}

const mockUnsubscriptionSupabase = ({
    updateResult = { error: null },
}: {
    updateResult?: { error: { message: string } | null }
} = {}) => {
    const eq = vi.fn().mockResolvedValue(updateResult)
    const update = vi.fn().mockReturnValue({ eq })
    const from = vi.fn((table: string) => {
        if (table !== 'subscription') {
            throw new Error(`想定外のテーブル: ${table}`)
        }
        return { update }
    })

    vi.mocked(createClientRole).mockResolvedValue({
        from,
    } as unknown as Awaited<ReturnType<typeof createClientRole>>)

    return { from, update, eq }
}

describe('Unsubscription', () => {
    beforeEach(() => {
        // mockClearは呼び出し履歴しか消さないため、前のテストのmockRejectedValueが
        // 残らないようmockResetで実装ごとリセットする
        mockSubscriptionsUpdate.mockReset()
    })

    it('解約に成功した場合、Stripeを期間終了時解約にしてDBを更新し、成功メッセージを返す', async () => {
        mockLoginUserPlan()
        const { update, eq } = mockUnsubscriptionSupabase()
        mockSubscriptionsUpdate.mockResolvedValue({
            cancel_at_period_end: true,
        })

        const result = await Unsubscription()

        expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('sub_123456', {
            cancel_at_period_end: true,
        })
        expect(update).toHaveBeenCalledWith({ cancel_at_period_end: true })
        expect(eq).toHaveBeenCalledWith('user_id', 'user-uuid-1')
        expect(result).toEqual({
            messageType: 'success',
            message: 'サブスクリプションを解約しました',
        })
    })

    it('ログインユーザーのプランが取得できない場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        vi.mocked(getUserPlan).mockResolvedValue(null)
        mockUnsubscriptionSupabase()

        const result = await Unsubscription()

        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(result).toEqual(UNSUBSCRIPTION_ERROR)
    })

    it('stripe_subscription_idが無い(フリープラン)場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        mockLoginUserPlan(null)
        mockUnsubscriptionSupabase()

        const result = await Unsubscription()

        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(result).toEqual(UNSUBSCRIPTION_ERROR)
    })

    it('Stripeの解約処理に失敗した場合、DBを更新せずエラーメッセージを返す', async () => {
        mockLoginUserPlan()
        const { update } = mockUnsubscriptionSupabase()
        mockSubscriptionsUpdate.mockRejectedValue(new Error('stripe down'))

        const result = await Unsubscription()

        expect(update).not.toHaveBeenCalled()
        expect(result).toEqual(UNSUBSCRIPTION_ERROR)
    })

    it('DB更新に失敗した場合、Stripeを解約前の状態に戻してエラーメッセージを返す', async () => {
        mockLoginUserPlan()
        mockUnsubscriptionSupabase({
            updateResult: { error: { message: '更新に失敗しました' } },
        })
        mockSubscriptionsUpdate.mockResolvedValue({
            cancel_at_period_end: true,
        })

        const result = await Unsubscription()

        // 1回目: 解約 / 2回目: ロールバック
        expect(mockSubscriptionsUpdate).toHaveBeenNthCalledWith(
            2,
            'sub_123456',
            {
                cancel_at_period_end: false,
            }
        )
        expect(result).toEqual(UNSUBSCRIPTION_ERROR)
    })

    it('ロールバックも失敗した場合、CRITICALログを出してエラーメッセージを返す', async () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        mockLoginUserPlan()
        mockUnsubscriptionSupabase({
            updateResult: { error: { message: '更新に失敗しました' } },
        })
        mockSubscriptionsUpdate
            .mockResolvedValueOnce({ cancel_at_period_end: true })
            .mockRejectedValueOnce(new Error('stripe down'))

        const result = await Unsubscription()

        expect(consoleError).toHaveBeenCalledWith(
            expect.stringContaining('CRITICAL'),
            expect.any(Error)
        )
        expect(result).toEqual(UNSUBSCRIPTION_ERROR)

        consoleError.mockRestore()
    })
})

const mockUnsubscriptionWebhookSupabase = ({
    planResult = { data: { id: 1 }, error: null },
    updateResult = { error: null },
}: {
    planResult?: {
        data: { id: number } | null
        error: { message: string } | null
    }
    updateResult?: { error: { message: string } | null }
} = {}) => {
    const eq = vi.fn().mockResolvedValue(updateResult)
    const update = vi.fn().mockReturnValue({ eq })
    const from = vi.fn((table: string) => {
        if (table === 'plan') {
            return {
                select: vi.fn().mockReturnValue({
                    is: vi.fn().mockReturnValue({
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

    vi.mocked(createClientRole).mockResolvedValue({
        from,
    } as unknown as Awaited<ReturnType<typeof createClientRole>>)

    return { from, update, eq }
}

const mockUnsubscriptionWebhookData = 'sub_1234'

describe('UnsubscriptionWebhook', () => {
    it('解約成立時、該当行をフリープランに戻す', async () => {
        const { update, eq } = mockUnsubscriptionWebhookSupabase()

        await expect(
            UnsubscriptionWebhook(mockUnsubscriptionWebhookData)
        ).resolves.not.toThrow()

        expect(update).toHaveBeenCalledWith({
            stripe_subscription_id: null,
            price_id: null,
            status: 'active',
            current_period_end: null,
            cancel_at_period_end: false,
            plan_id: 1,
        })
        expect(eq).toHaveBeenCalledWith(
            'stripe_subscription_id',
            mockUnsubscriptionWebhookData
        )
    })

    it('フリープランの取得に失敗した場合、subscriptionを更新せずthrowする', async () => {
        const { update } = mockUnsubscriptionWebhookSupabase({
            planResult: { data: null, error: { message: 'not found' } },
        })

        await expect(
            UnsubscriptionWebhook(mockUnsubscriptionWebhookData)
        ).rejects.toThrow('Error fetching free plan')
        expect(update).not.toHaveBeenCalled()
    })

    it('subscriptionの更新に失敗した場合、throwする', async () => {
        mockUnsubscriptionWebhookSupabase({
            updateResult: { error: { message: 'update failed' } },
        })

        await expect(
            UnsubscriptionWebhook(mockUnsubscriptionWebhookData)
        ).rejects.toThrow('Error updating subscription')
    })
})
