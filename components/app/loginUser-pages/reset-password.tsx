'use client'

import { resetPasswordAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { InputPassword } from '@/components/ui/input-password'
import { Label } from '@/components/ui/label'

export default function ResetPasswordForm({ message }: { message: Message }) {
    return (
        <>
            <div className="pt-pcvw-[150]">
                <form className="bg-background-surface rounded-xl-pc mx-auto p-24-pc w-pcvw-[500]">
                    <h1 className="text-heading-h3-pc">パスワードをリセット</h1>
                    <FormMessage message={message} className="mt-24-pc" />
                    <div className="mt-32-pc">
                        <Label htmlFor="password">パスワード</Label>
                        <InputPassword
                            type="password"
                            name="password"
                            placeholder="パスワードを入力してください"
                            required
                            className="mt-8-pc"
                        />
                    </div>
                    <div className="mt-24-pc">
                        <Label htmlFor="confirmPassword">
                            パスワードを確認してください
                        </Label>
                        <InputPassword
                            type="password"
                            name="confirmPassword"
                            placeholder="パスワードを確認してください"
                            required
                            className="mt-8-pc"
                        />
                    </div>
                    <SubmitButton
                        formAction={resetPasswordAction}
                        pendingText="リセット中..."
                        className="w-full mt-48-pc"
                    >
                        続ける
                    </SubmitButton>
                </form>
            </div>
        </>
    )
}
