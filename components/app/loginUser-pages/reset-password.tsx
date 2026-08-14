'use client'

import { FormMessage } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { InputPassword } from '@/components/ui/input-password'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { usePasswordResetForm } from '@/lib/validation/hooks'
import type { Message } from '@/types/message'
import type { passwordResetFormValues } from '@/lib/validation/schema'

export default function ResetPasswordForm() {
    const { form, onSubmit } = usePasswordResetForm()
    const [message, setMessage] = useState<Message | null>(null)

    const handleSubmit = async (data: passwordResetFormValues) => {
        const result = await onSubmit(data)
        setMessage(result)
    }

    return (
        <>
            <div className="pt-pcvw-[150]">
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="bg-background-surface rounded-xl-pc mx-auto p-24-pc w-pcvw-[500]"
                >
                    <h1 className="text-heading-h3-pc">パスワードをリセット</h1>

                    {message && (
                        <div className="mt-16-pc">
                            <FormMessage message={message} />
                        </div>
                    )}

                    <div className="mt-32-pc">
                        <div>
                            <Label htmlFor="newPassword">パスワード</Label>
                            <InputPassword
                                {...form.register('newPassword')}
                                variant={
                                    form.formState.errors.newPassword
                                        ? 'error'
                                        : 'default'
                                }
                                placeholder="パスワードを入力してください"
                                className="mt-8-pc"
                            />
                            {form.formState.errors.newPassword && (
                                <p className="text-status-error text-body-small-pc mt-4-pc">
                                    {form.formState.errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-24-pc">
                            <Label htmlFor="newPasswordConfirm">
                                パスワードを確認してください
                            </Label>
                            <InputPassword
                                {...form.register('newPasswordConfirm')}
                                placeholder="パスワードを確認してください"
                                variant={
                                    form.formState.errors.newPasswordConfirm
                                        ? 'error'
                                        : 'default'
                                }
                                className="mt-8-pc"
                            />
                            {form.formState.errors.newPasswordConfirm && (
                                <p className="text-status-error text-body-small-pc mt-4-pc">
                                    {
                                        form.formState.errors.newPasswordConfirm
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <SubmitButton
                            pendingText="リセット中..."
                            className="w-full mt-48-pc"
                        >
                            続ける
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </>
    )
}
