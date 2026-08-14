'use client'

import { useForgetPasswordForm } from '@/lib/validation/hooks'
import { FormMessage } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import type { Message } from '@/types/message'
import type { forgotPasswordFormValues } from '@/lib/validation/schema'

export default function ForgotPasswordForm() {
    const { form, onSubmit } = useForgetPasswordForm()
    const [message, setMessage] = useState<Message | null>(null)

    const handleSubmit = async (data: forgotPasswordFormValues) => {
        const result = await onSubmit(data)
        setMessage(result)
    }

    return (
        <div className="pt-pcvw-[150]">
            <form
                className="bg-background-surface rounded-xl-pc mx-auto p-24-pc w-pcvw-[500]"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <h1 className="text-heading-h3-pc">パスワードをリセット</h1>

                {message && (
                    <div className="mt-16-pc">
                        <FormMessage message={message} />
                    </div>
                )}

                <div className="mt-32-pc">
                    <div>
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input
                            {...form.register('email')}
                            placeholder="example@email.com"
                            variant={
                                form.formState.errors.email
                                    ? 'error'
                                    : 'default'
                            }
                            className="mt-8-pc"
                        />
                        {form.formState.errors.email && (
                            <p className="text-status-error text-body-small-pc mt-4-pc">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>
                    <SubmitButton
                        pendingText="送信中..."
                        className="w-full mt-48-pc"
                    >
                        続ける
                    </SubmitButton>

                    <div className="flex flex-col items-center gap-12-pc mt-32-pc">
                        <Link
                            href="/sign-in"
                            className="text-body-small-pc text-text-secondary underline"
                        >
                            ログインはこちら
                        </Link>
                        <Link
                            href="/sign-up"
                            className="text-body-small-pc text-text-secondary underline"
                        >
                            新規登録はこちら
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
