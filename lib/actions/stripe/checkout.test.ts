import { describe, it, expect, vi } from 'vitest'
import { redirect } from 'next/navigation'
import { checkout } from '@/lib/actions/stripe/checkout'

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
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

describe('checkout', () => {
    it('sessionを作成できた場合、そのURLへredirectする', async () => {
        mockSessionsCreate.mockResolvedValue({
            url: 'https://checkout.stripe.com/session_123',
        })

        await checkout('price_123', 'cus_123', 'user_1')

        expect(mockSessionsCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                customer: 'cus_123',
                subscription_data: { metadata: { user_id: 'user_1' } },
            })
        )
        expect(redirect).toHaveBeenCalledWith(
            'https://checkout.stripe.com/session_123'
        )
    })

    it('session.urlが取得できない場合、エラーメッセージを返す', async () => {
        mockSessionsCreate.mockResolvedValue({ url: null })

        const result = await checkout('price_123', 'cus_123', 'user_1')

        expect(result).toEqual({
            messageType: 'error',
            message:
                '決済を開始できませんでした。時間をおいて再度お試しください。',
        })
        expect(redirect).not.toHaveBeenCalled()
    })

    it('Stripe呼び出しが失敗した場合、エラーメッセージを返す', async () => {
        mockSessionsCreate.mockRejectedValue(new Error('stripe down'))

        const result = await checkout('price_123', 'cus_123', 'user_1')

        expect(result).toEqual({
            messageType: 'error',
            message:
                '決済を開始できませんでした。時間をおいて再度お試しください。',
        })
        expect(redirect).not.toHaveBeenCalled()
    })
})
