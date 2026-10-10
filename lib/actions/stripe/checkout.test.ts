import { describe, it, expect, vi, beforeEach } from 'vitest'
import { redirect } from 'next/navigation'
import { checkout } from '@/lib/actions/stripe/checkout'
import { createClient } from '@/utils/supabase/server'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}))

vi.mock('@/utils/supabase/server', () => ({
    createClient: vi.fn(),
}))

// customer ID / user ID はセッションから取るので、getUserPlanをモックして差し替える
vi.mock('@/lib/functions/profile/getUserPlan', () => ({
    getUserPlan: vi.fn(),
}))

const { mockSessionsCreate } = vi.hoisted(() => ({
    mockSessionsCreate: vi.fn(),
}))
vi.mock('stripe', () => ({
    default: vi.fn().mockImplementation(function () {
        return {
            checkout: {
                sessions: {
                    create: mockSessionsCreate,
                },
            },
        }
    }),
}))

const CHECKOUT_ERROR = {
    messageType: 'error',
    message: '決済を開始できませんでした。時間をおいて再度お試しください。',
}

const PLAN_ERROR = {
    messageType: 'error',
    message: 'プラン情報の取得に失敗しました。時間をおいて再度お試しください。',
}

const mockLoginUserPlan = (stripeSubscriptionId: string | null = null) => {
    vi.mocked(getUserPlan).mockResolvedValue({
        user_id: 'user_1',
        stripe_customer_id: 'cus_123',
        stripe_subscription_id: stripeSubscriptionId,
    } as unknown as Awaited<ReturnType<typeof getUserPlan>>)
}

/**
 * plan テーブルのモック
 * select().eq().is().single() のように条件を何個つないでも良いようにする
 */
const mockPlanQuery = (
    planResult: {
        data: { id: number } | null
        error: { message: string } | null
    } = { data: { id: 2 }, error: null }
) => {
    const planQuery: {
        eq: ReturnType<typeof vi.fn>
        is: ReturnType<typeof vi.fn>
        single: ReturnType<typeof vi.fn>
    } = {
        eq: vi.fn(() => planQuery),
        is: vi.fn(() => planQuery),
        single: vi.fn().mockResolvedValue(planResult),
    }
    const from = vi.fn(() => ({
        select: vi.fn().mockReturnValue(planQuery),
    }))
    vi.mocked(createClient).mockResolvedValue({
        from,
    } as unknown as Awaited<ReturnType<typeof createClient>>)
    return { from, planQuery }
}

describe('checkout', () => {
    beforeEach(() => {
        // clearAllMocksでは実装が残るため、前のテストのmockRejectedValueなどを毎回上書きする
        mockSessionsCreate.mockReset()
        mockSessionsCreate.mockResolvedValue({
            url: 'https://checkout.stripe.com/session_123',
        })
    })

    it('有効なプランの場合、セッションのcustomer/user_idと選んだpriceでCheckoutを作成し、そのURLへredirectする', async () => {
        mockLoginUserPlan()
        const { planQuery } = mockPlanQuery()

        await checkout('price_123')

        expect(planQuery.eq).toHaveBeenCalledWith(
            'stripe_price_id',
            'price_123'
        )
        expect(planQuery.is).toHaveBeenCalledWith('is_active', true)
        expect(mockSessionsCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                line_items: [{ price: 'price_123', quantity: 1 }],
                customer: 'cus_123',
                mode: 'subscription',
                subscription_data: { metadata: { user_id: 'user_1' } },
            })
        )
        expect(redirect).toHaveBeenCalledWith(
            'https://checkout.stripe.com/session_123'
        )
    })

    it('ログインユーザーのプランが取得できない場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        vi.mocked(getUserPlan).mockResolvedValue(null)
        mockPlanQuery()

        const result = await checkout('price_123')

        expect(mockSessionsCreate).not.toHaveBeenCalled()
        expect(result).toEqual(CHECKOUT_ERROR)
    })

    it('すでに有料サブスクを契約中の場合、二重契約にならないようStripeを呼ばずエラーメッセージを返す', async () => {
        mockLoginUserPlan('sub_existing')
        const { from } = mockPlanQuery()

        const result = await checkout('price_123')

        expect(from).not.toHaveBeenCalled()
        expect(mockSessionsCreate).not.toHaveBeenCalled()
        expect(result).toEqual(CHECKOUT_ERROR)
    })

    it('有効なプランが見つからないpriceの場合、Stripeを呼ばずエラーメッセージを返す', async () => {
        mockLoginUserPlan()
        mockPlanQuery({ data: null, error: { message: 'not found' } })

        const result = await checkout('price_invalid')

        // 不正・販売終了のpriceで課金が始まらないよう、Stripeより前で止まる
        expect(mockSessionsCreate).not.toHaveBeenCalled()
        expect(result).toEqual(PLAN_ERROR)
    })

    it('session.urlが取得できない場合、エラーメッセージを返す', async () => {
        mockLoginUserPlan()
        mockPlanQuery()
        mockSessionsCreate.mockResolvedValue({ url: null })

        const result = await checkout('price_123')

        expect(result).toEqual(CHECKOUT_ERROR)
        expect(redirect).not.toHaveBeenCalled()
    })

    it('Stripe呼び出しが失敗した場合、エラーメッセージを返す', async () => {
        mockLoginUserPlan()
        mockPlanQuery()
        mockSessionsCreate.mockRejectedValue(new Error('stripe down'))

        const result = await checkout('price_123')

        expect(result).toEqual(CHECKOUT_ERROR)
        expect(redirect).not.toHaveBeenCalled()
    })
})
