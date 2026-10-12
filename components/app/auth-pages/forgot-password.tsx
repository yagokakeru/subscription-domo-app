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
        <div className="pt-pcvw-[150] max-md:pt-32-sp max-md:px-16-sp">
            <form
                className="bg-background-surface rounded-xl-pc max-md:rounded-xl-sp mx-auto p-24-pc max-md:p-spvw-[20] w-pcvw-[500] max-md:w-full"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <h1 className="text-heading-h3-pc max-md:text-heading-h3-sp">
                    パスワードをリセット
                </h1>

                {message && (
                    <div className="mt-16-pc max-md:mt-16-sp">
                        <FormMessage message={message} />
                    </div>
                )}

                <div className="mt-32-pc max-md:mt-32-sp">
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
                            className="mt-8-pc max-md:mt-8-sp"
                            id="email"
                        />
                        {form.formState.errors.email && (
                            <p className="text-status-error text-body-small-pc max-md:text-body-small-sp mt-4-pc max-md:mt-4-sp">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>
                    <SubmitButton
                        pendingText="送信中..."
                        className="w-full mt-48-pc max-md:mt-48-sp"
                    >
                        続ける
                    </SubmitButton>

                    <div className="flex flex-col items-center gap-12-pc max-md:gap-12-sp mt-32-pc max-md:mt-32-sp">
                        <Link
                            href="/sign-in"
                            className="text-body-small-pc max-md:text-body-small-sp text-text-secondary underline"
                        >
                            ログインはこちら
                        </Link>
                        <Link
                            href="/sign-up"
                            className="text-body-small-pc max-md:text-body-small-sp text-text-secondary underline"
                        >
                            新規登録はこちら
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
