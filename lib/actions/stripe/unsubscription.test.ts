import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    Unsubscription,
    UnsubscriptionWebhook,
} from '@/lib/actions/stripe/unsubscription'
import { createClientRole } from '@/utils/supabase/server'

const { mockUnsubscription } = vi.hoisted(() => ({
    mockUnsubscription: vi.fn(),
}))

vi.mock('@/utils/stripe/server', () => ({
    stripeClient: vi.fn(() => ({
        subscriptions: {
            update: mockUnsubscription,
        },
    })),
}))

vi.mock('@/utils/supabase/server', () => ({
    createClientRole: vi.fn(),
}))

const mockFrom = ({
    selectResult = {
        data: { stripe_subscription_id: 'sub_123456' },
        error: null,
    },
    updateResult = { error: null },
}: {
    selectResult?: {
        data: { stripe_subscription_id: string } | null
        error: { message: string } | null
    }
    updateResult?: { error: { message: string } | null }
} = {}) => {
    const from = vi.fn((table: string) => {
        if (table !== 'subscription') {
            throw new Error(`想定外のテーブル: ${table}`)
        }

        const select = vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue(selectResult),
            }),
        })

        const update = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue(updateResult),
        })

        return {
            select,
            update,
        }
    })

    return from
}

const mockUnsubscriptionData = '141e52cd-3c27-4866-b0cb-765784e6e841'

describe('Unsubscription', () => {
    beforeEach(() => {
        mockUnsubscription.mockReset()
    })

    it('サブスクリプションの解約成功時、成功メッセージが返る', async () => {
        const from = mockFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        mockUnsubscription.mockResolvedValue({ cancel_at_period_end: true })

        const result = await Unsubscription(mockUnsubscriptionData)

        expect(from).toHaveBeenCalledWith('subscription')
        expect(result).toEqual({
            messageType: 'success',
            message: 'サブスクリプションを解約しました',
        })
    })

    it('subscription情報取得に失敗した場合、エラーメッセージが返る', async () => {
        const from = mockFrom({
            selectResult: {
                data: null,
                error: { message: '取得に失敗しました' },
            },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        const result = await Unsubscription(mockUnsubscriptionData)

        expect(mockUnsubscription).not.toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message: 'サブスクリプションの解約に失敗しました',
        })
    })

    it('subscription情報更新に失敗した場合、エラーメッセージが返る', async () => {
        const from = mockFrom({
            updateResult: { error: { message: '更新に失敗しました' } },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        mockUnsubscription.mockResolvedValue({ cancel_at_period_end: true })

        const result = await Unsubscription(mockUnsubscriptionData)

        expect(from).toHaveBeenCalledWith('subscription')
        expect(result).toEqual({
            messageType: 'error',
            message: 'サブスクリプションの解約に失敗しました',
        })
    })

    it('Stripeの解約処理に失敗した場合、エラーメッセージが返る', async () => {
        const from = mockFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        mockUnsubscription.mockRejectedValue(new Error('stripe down'))

        const result = await Unsubscription(mockUnsubscriptionData)

        expect(result).toEqual({
            messageType: 'error',
            message: 'サブスクリプションの解約に失敗しました',
        })
    })
})

const mockUnsubscriptionFrom = ({
    deleteResult = { data: [{ id: 'user_id' }], error: null },
}: {
    deleteResult?: {
        data: { id: string }[] | null
        error: { message: string } | null
    }
} = {}) => {
    const from = vi.fn((table: string) => {
        if (table !== 'subscription') {
            throw new Error('Invalid table')
        }

        const deleteFn = vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue(deleteResult),
            }),
        })

        return { delete: deleteFn }
    })

    return from
}

const mockUnsubscriptionWebhookData = 'sub_1234'

describe('UnsubscriptionWebhook', () => {
    it('サブスク解約後の後処理に成功する', async () => {
        const consoleWarn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {})
        const from = mockUnsubscriptionFrom()
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(
            UnsubscriptionWebhook(mockUnsubscriptionWebhookData)
        ).resolves.not.toThrow()
        expect(from).toHaveBeenCalledWith('subscription')
        expect(consoleWarn).not.toHaveBeenCalled()

        consoleWarn.mockRestore()
    })

    it('サブスク情報削除に失敗した場合エラーを投げる', async () => {
        const from = mockUnsubscriptionFrom({
            deleteResult: { data: null, error: { message: 'delete failed' } },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(
            UnsubscriptionWebhook(mockUnsubscriptionWebhookData)
        ).rejects.toThrow('Error deleting subscription')
    })

    it('サブスク情報がすでに削除されていた場合、console.warnが呼ばれる', async () => {
        const consoleWarn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {})

        const from = mockUnsubscriptionFrom({
            deleteResult: { data: [], error: null },
        })
        vi.mocked(createClientRole).mockResolvedValue({
            from,
        } as unknown as Awaited<ReturnType<typeof createClientRole>>)

        await expect(
            UnsubscriptionWebhook(mockUnsubscriptionWebhookData)
        ).resolves.not.toThrow()
        expect(consoleWarn).toHaveBeenCalledWith(
            expect.stringContaining(mockUnsubscriptionWebhookData)
        )

        consoleWarn.mockRestore()
    })
})
