import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    Subscription,
    ReactivateSubscription,
    UpgradeSubscription,
    UpgradeSubscriptionWithWebhook,
} from '@/lib/actions/stripe/subscription'
import { createClientRole } from '@/utils/supabase/server'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'
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

// ログインユーザーはセッションから取るので、getUserPlanをモックして差し替える
vi.mock('@/lib/functions/profile/getUserPlan', () => ({
    getUserPlan: vi.fn(),
}))

const mockSubscriptionObject = {
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
}

const mockEvent = {
    data: { object: mockSubscriptionObject },
} as unknown as Stripe.CustomerSubscriptionCreatedEvent

const mockUpdatedEvent = {
    data: { object: mockSubscriptionObject },
} as unknown as Stripe.CustomerSubscriptionUpdatedEvent

const mockLoginUserPlan = (
    stripeSubscriptionId: string | null = 'sub_test123'
) => {
    vi.mocked(getUserPlan).mockResolvedValue({
        user_id: 'user-uuid-1',
        stripe_subscription_id: stripeSubscriptionId,
    } as unknown as Awaited<ReturnType<typeof getUserPlan>>)
}

/**
 * plan / subscription テーブルのモックを作る
 * - plan: select().eq()...single() の .eq は何回つないでも良いようにする
 * - subscription: update().eq() はそのままawaitする呼び方と、
 *   update().eq().select() で終える呼び方の両方に対応する
 */
const mockSupabase = ({
    planResult = { data: { id: 1 }, error: null },
    updateResult = { data: [{}], error: null },
}: {
    planResult?: {
        data: { id: number } | null
        error: { message: string } | null
    }
    updateResult?: { data?: object | null; error: { message: string } | null }
} = {}) => {
    const planQuery: {
        eq: ReturnType<typeof vi.fn>
        single: ReturnType<typeof vi.fn>
    } = {
        eq: vi.fn(() => planQuery),
        single: vi.fn().mockResolvedValue(planResult),
    }

    // updateに渡された中身を検証したいので、モック関数の参照を外に出しておく
    const updateEq = vi.fn(() =>
        Object.assign(Promise.resolve(updateResult), {
            select: vi.fn().mockResolvedValue(updateResult),
        })
    )
    const update = vi.fn().mockReturnValue({ eq: updateEq })

    const from = vi.fn((table: string) => {
        if (table === 'plan') {
            return { select: vi.fn().mockReturnValue(planQuery) }
        }
        if (table === 'subscription') {
            return { update }
        }
        throw new Error(`想定外のテーブル: ${table}`)
    })

    vi.mocked(createClientRole).mockResolvedValue({
        from,
    } as unknown as Awaited<ReturnType<typeof createClientRole>>)

    return { from, update, updateEq, planQuery }
}

describe('Subscription', () => {
    beforeEach(() => {
        // Webhookはイベントのスナップショットではなく最新のサブスクを取り直す
        mockSubscriptionsRetrieve.mockReset()
        mockSubscriptionsRetrieve.mockResolvedValue(mockSubscriptionObject)
    })

    it('正常時、最新のサブスクを取り直し、planを紐付けてSubscriptionをuser_idでupdateする', async () => {
        const { from, update, updateEq } = mockSupabase()

        await Subscription(mockEvent)

        expect(mockSubscriptionsRetrieve).toHaveBeenCalledWith('sub_test123')
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
        expect(updateEq).toHaveBeenCalledWith('user_id', 'user-uuid-1')
    })

    it('plan取得でエラーの場合、throwする', async () => {
        mockSupabase({
            planResult: { data: null, error: { message: 'not found' } },
        })

        await expect(Subscription(mockEvent)).rejects.toThrow(
            'Error fetching plan data'
        )
    })

    it('subscription更新でエラーの場合、throwする', async () => {
        mockSupabase({
            updateResult: { data: null, error: { message: 'db error' } },
        })

        await expect(Subscription(mockEvent)).rejects.toThrow(
            'Error updating subscription'
        )
    })

    it('metadata.user_idが無い場合、DBに触らず正常終了する', async () => {
        // console.errorを差し替えて、テスト出力を汚さずに呼び出しを検証する
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        const { from } = mockSupabase()

        const eventWithoutUserId = {
            data: {
                object: { ...mockSubscriptionObject, metadata: {} },
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

const REACTIVATE_ERROR = {
    messageType: 'error',
    message: 'サブスクリプションの再開に失敗しました',
}

describe('ReactivateSubscription', () => {
    beforeEach(() => {
        // mockClearは呼び出し履歴しか消さないため、前のテストのmockRejectedValueが
        // 残らないようmockResetで実装ごとリセットする
        mockSubscriptionsUpdate.mockReset()
    })

    it('正常時、Stripeの解約予定を取り消しDBを更新する', async () => {
        mockLoginUserPlan()
        const { update, updateEq } = mockSupabase({
            updateResult: { error: null },
        })
        mockSubscriptionsUpdate.mockResolvedValue({
            cancel_at_period_end: false,
        })

        const result = await ReactivateSubscription()

        expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('sub_test123', {
            cancel_at_period_end: false,
        })
        expect(update).toHaveBeenCalledWith({ cancel_at_period_end: false })
        expect(updateEq).toHaveBeenCalledWith('user_id', 'user-uuid-1')
        expect(result).toEqual({
            messageType: 'success',
            message: 'サブスクリプションの再開に成功しました',
        })
    })

    it('ログインユーザーのプランが取得できない場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        vi.mocked(getUserPlan).mockResolvedValue(null)
        mockSupabase()

        const result = await ReactivateSubscription()

        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(result).toEqual(REACTIVATE_ERROR)
    })

    it('stripe_subscription_idが無い(フリープラン)場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        mockLoginUserPlan(null)
        mockSupabase()

        const result = await ReactivateSubscription()

        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(result).toEqual(REACTIVATE_ERROR)
    })

    it('Stripe呼び出しが失敗した場合、DBを更新せずエラーメッセージを返す', async () => {
        mockLoginUserPlan()
        const { update } = mockSupabase()
        mockSubscriptionsUpdate.mockRejectedValue(new Error('stripe down'))

        const result = await ReactivateSubscription()

        expect(update).not.toHaveBeenCalled()
        expect(result).toEqual(REACTIVATE_ERROR)
    })

    it('DB更新でエラーの場合、Stripeを解約予定の状態に戻してエラーメッセージを返す', async () => {
        mockLoginUserPlan()
        mockSupabase({ updateResult: { error: { message: 'db error' } } })
        mockSubscriptionsUpdate.mockResolvedValue({
            cancel_at_period_end: false,
        })

        const result = await ReactivateSubscription()

        // 1回目: 再開 / 2回目: ロールバック
        expect(mockSubscriptionsUpdate).toHaveBeenNthCalledWith(
            2,
            'sub_test123',
            {
                cancel_at_period_end: true,
            }
        )
        expect(result).toEqual(REACTIVATE_ERROR)
    })

    it('ロールバックも失敗した場合、CRITICALログを出してエラーメッセージを返す', async () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        mockLoginUserPlan()
        mockSupabase({ updateResult: { error: { message: 'db error' } } })
        mockSubscriptionsUpdate
            .mockResolvedValueOnce({ cancel_at_period_end: false })
            .mockRejectedValueOnce(new Error('stripe down'))

        const result = await ReactivateSubscription()

        expect(consoleError).toHaveBeenCalledWith(
            expect.stringContaining('CRITICAL'),
            expect.any(Error)
        )
        expect(result).toEqual(REACTIVATE_ERROR)

        consoleError.mockRestore()
    })
})

const UPGRADE_ERROR = {
    messageType: 'error',
    message: 'サブスクリプションのアップグレードに失敗しました',
}

describe('UpgradeSubscription', () => {
    beforeEach(() => {
        mockSubscriptionsRetrieve.mockReset()
        mockSubscriptionsUpdate.mockReset()
        mockSubscriptionsRetrieve.mockResolvedValue({
            items: { data: [{ id: 'si_test123' }] },
        })
        mockSubscriptionsUpdate.mockResolvedValue({
            status: 'active',
            current_period_end: 1700000000,
            cancel_at_period_end: false,
        })
    })

    it('有効なプランか確認したうえで、新しいpriceに変更し解約予定も取り消す', async () => {
        mockLoginUserPlan()
        const { planQuery, update, updateEq } = mockSupabase({
            updateResult: { error: null },
        })

        const result = await UpgradeSubscription('price_new123')

        expect(planQuery.eq).toHaveBeenCalledWith(
            'stripe_price_id',
            'price_new123'
        )
        expect(planQuery.eq).toHaveBeenCalledWith('is_active', true)
        expect(mockSubscriptionsRetrieve).toHaveBeenCalledWith('sub_test123')
        expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('sub_test123', {
            items: [{ id: 'si_test123', price: 'price_new123' }],
            proration_behavior: 'create_prorations',
            cancel_at_period_end: false,
        })
        expect(update).toHaveBeenCalledWith(
            expect.objectContaining({
                plan_id: 1,
                price_id: 'price_new123',
                status: 'active',
                cancel_at_period_end: false,
            })
        )
        expect(updateEq).toHaveBeenCalledWith(
            'stripe_subscription_id',
            'sub_test123'
        )
        expect(result).toEqual({
            messageType: 'success',
            message: 'サブスクリプションのアップグレードに成功しました',
        })
    })

    it('ログインユーザーのプランが取得できない場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        vi.mocked(getUserPlan).mockResolvedValue(null)
        mockSupabase()

        const result = await UpgradeSubscription('price_new123')

        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(result).toEqual(UPGRADE_ERROR)
    })

    it('stripe_subscription_idが無い(フリープラン)場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        mockLoginUserPlan(null)
        mockSupabase()

        const result = await UpgradeSubscription('price_new123')

        expect(mockSubscriptionsRetrieve).not.toHaveBeenCalled()
        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(result).toEqual(UPGRADE_ERROR)
    })

    it('有効なプランが見つからないprice_idの場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        mockLoginUserPlan()
        mockSupabase({
            planResult: { data: null, error: { message: 'not found' } },
        })

        const result = await UpgradeSubscription('price_invalid')

        // 不正なpriceで課金が走らないよう、Stripeより前で止まる
        expect(mockSubscriptionsRetrieve).not.toHaveBeenCalled()
        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(result).toEqual(UPGRADE_ERROR)
    })

    it('Stripe呼び出しが失敗した場合、DBを更新せずエラーメッセージを返す', async () => {
        mockLoginUserPlan()
        const { update } = mockSupabase()
        mockSubscriptionsRetrieve.mockRejectedValue(new Error('stripe down'))

        const result = await UpgradeSubscription('price_new123')

        expect(mockSubscriptionsUpdate).not.toHaveBeenCalled()
        expect(update).not.toHaveBeenCalled()
        expect(result).toEqual(UPGRADE_ERROR)
    })

    it('DB更新でエラーの場合、エラーメッセージを返す', async () => {
        mockLoginUserPlan()
        mockSupabase({ updateResult: { error: { message: 'db error' } } })

        const result = await UpgradeSubscription('price_new123')

        expect(result).toEqual(UPGRADE_ERROR)
    })
})

describe('UpgradeSubscriptionWithWebhook', () => {
    beforeEach(() => {
        mockSubscriptionsRetrieve.mockReset()
        mockSubscriptionsRetrieve.mockResolvedValue(mockSubscriptionObject)
    })

    it('正常時、最新のサブスクを取り直し、planを紐付けてSubscriptionをuser_idでupdateする', async () => {
        const { from, update } = mockSupabase()

        await UpgradeSubscriptionWithWebhook(mockUpdatedEvent)

        expect(mockSubscriptionsRetrieve).toHaveBeenCalledWith('sub_test123')
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
        mockSupabase({
            planResult: { data: null, error: { message: 'not found' } },
        })

        await expect(
            UpgradeSubscriptionWithWebhook(mockUpdatedEvent)
        ).rejects.toThrow('Error fetching plan data')
    })

    it('subscription更新でエラーの場合、throwする', async () => {
        mockSupabase({
            updateResult: { data: null, error: { message: 'db error' } },
        })

        await expect(
            UpgradeSubscriptionWithWebhook(mockUpdatedEvent)
        ).rejects.toThrow('Error updating subscription')
    })

    it('metadata.user_idが無い場合、DBに触らず正常終了する', async () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        const { from } = mockSupabase()

        const eventWithoutUserId = {
            data: {
                object: { ...mockSubscriptionObject, metadata: {} },
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
