// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { signUpAction } from '@/app/actions'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignUpForm } from '@/components/app/auth-pages/sign-up'

vi.mock('@/app/actions', () => ({
    signUpAction: vi.fn(),
}))

describe('SignUpForm', () => {
    it('不正なメールアドレスで送信するとエラーメッセージが表示され、signUpActionは呼ばれない', async () => {
        const user = userEvent.setup()
        render(<SignUpForm />)
        await user.type(screen.getByLabelText('メールアドレス'), 'invalid')
        await user.type(screen.getByLabelText('パスワード'), 'Password1')
        await user.click(screen.getByRole('button', { name: '新規登録' }))
        expect(
            await screen.findByText('正しいメールアドレスを入力してください')
        ).toBeInTheDocument()
        expect(signUpAction).not.toHaveBeenCalled()
    })

    it('不正なパスワードで送信するとエラーメッセージが表示され、signUpActionは呼ばれない', async () => {
        const user = userEvent.setup()
        render(<SignUpForm />)
        await user.type(
            screen.getByLabelText('メールアドレス'),
            'valid@example.com'
        )
        await user.type(screen.getByLabelText('パスワード'), 'short')
        await user.click(screen.getByRole('button', { name: '新規登録' }))
        expect(
            await screen.findByText('パスワードは8文字以上で入力してください')
        ).toBeInTheDocument()
        expect(signUpAction).not.toHaveBeenCalled()
    })

    it('正しいメールアドレスとパスワードを入力して送信するとsignUpActionが正しい引数で呼ばれる', async () => {
        vi.mocked(signUpAction).mockImplementation(() => new Promise(() => {})) // 本物のredirectと同様、解決しないPromiseにしておく

        const user = userEvent.setup()
        render(<SignUpForm />)
        await user.type(
            screen.getByLabelText('メールアドレス'),
            'valid@example.com'
        )
        await user.type(screen.getByLabelText('パスワード'), 'Password1')
        await user.click(screen.getByRole('button', { name: '新規登録' }))

        expect(signUpAction).toHaveBeenCalledWith({
            email: 'valid@example.com',
            password: 'Password1',
            priceid: '',
        })
    })

    it('正しいメールアドレスとパスワードを入力して送信するとsignUpActionが呼ばれて、supabaseからエラーが返ってきてエラーメッセージを表示する', async () => {
        vi.mocked(signUpAction).mockResolvedValue({
            messageType: 'error',
            message:
                'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
        })

        const user = userEvent.setup()
        render(<SignUpForm />)
        const emailInput = screen.getByLabelText('メールアドレス')
        const passwordInput = screen.getByLabelText('パスワード')
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'Password1')
        await user.click(screen.getByRole('button', { name: '新規登録' }))
        expect(signUpAction).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'Password1',
            priceid: '',
        })
        expect(
            await screen.findByText(
                'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。'
            )
        ).toBeInTheDocument()
    })
})
