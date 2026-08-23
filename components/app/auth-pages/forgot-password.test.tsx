// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { forgotPasswordAction } from '@/app/actions'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ForgotPasswordForm from '@/components/app/auth-pages/forgot-password'

vi.mock('@/app/actions', () => ({
    forgotPasswordAction: vi.fn(),
}))

describe('ForgotPasswordForm', () => {
    it('不正なメールアドレスで送信するとエラーメッセージが表示される', async () => {
        const user = userEvent.setup()
        render(<ForgotPasswordForm />)
        const input = screen.getByLabelText('メールアドレス')
        await user.type(input, 'invalid')
        await user.click(screen.getByRole('button', { name: '続ける' }))
        expect(
            await screen.findByText('正しいメールアドレスを入力してください')
        ).toBeInTheDocument()
        expect(forgotPasswordAction).not.toHaveBeenCalled()
    })

    it('正しいメールアドレスを入力して送信するとforgotPasswordActionアクションが呼ばれて、成功メッセージが表示される', async () => {
        vi.mocked(forgotPasswordAction).mockResolvedValue({
            messageType: 'success',
            message:
                'パスワードのリセットリンクを送信しました。メールをご確認ください。',
        })

        const user = userEvent.setup()
        render(<ForgotPasswordForm />)
        const input = screen.getByLabelText('メールアドレス')
        await user.type(input, 'valid@example.com')
        await user.click(screen.getByRole('button', { name: '続ける' }))
        expect(forgotPasswordAction).toHaveBeenCalledWith({
            email: 'valid@example.com',
        })
        expect(
            await screen.findByText(
                'パスワードのリセットリンクを送信しました。メールをご確認ください。'
            )
        ).toBeInTheDocument()
    })

    it('正しいメールアドレスを入力して送信するとforgotPasswordActionアクションが呼ばれて、supabaseからエラーが返ってきてエラーメッセージを表示する', async () => {
        vi.mocked(forgotPasswordAction).mockResolvedValue({
            messageType: 'error',
            message:
                'パスワードのリセットリンクの送信に失敗しました。しばらくしてからもう一度お試しください。',
        })

        const user = userEvent.setup()
        render(<ForgotPasswordForm />)
        const input = screen.getByLabelText('メールアドレス')
        await user.type(input, 'valid@example.com')
        await user.click(screen.getByRole('button', { name: '続ける' }))
        expect(forgotPasswordAction).toHaveBeenCalledWith({
            email: 'valid@example.com',
        })
        expect(
            await screen.findByText(
                'パスワードのリセットリンクの送信に失敗しました。しばらくしてからもう一度お試しください。'
            )
        ).toBeInTheDocument()
    })
})
