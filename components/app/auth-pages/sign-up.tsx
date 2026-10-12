'use client'

import { useAtomValue } from 'jotai'
import { FormMessage } from '@/components/form-message'
import type { Message } from '@/types/message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { InputPassword } from '@/components/ui/input-password'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { priceIdAtom } from '@/lib/atoms/handOver'
import { useSignupForm } from '@/lib/validation/hooks'
import { useState } from 'react'
import { signupFormValues } from '@/lib/validation/schema'

export function SignUpForm() {
    const priceID = useAtomValue(priceIdAtom)
    const [message, setMessage] = useState<Message | null>(null)
    const { form, onSubmit } = useSignupForm()

    const handleSubmit = async (data: signupFormValues) => {
        const result = await onSubmit(data)
        setMessage(result)
    }

    return (
        <>
            <div className="pt-pcvw-[150] max-md:pt-32-sp max-md:px-16-sp">
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="bg-background-surface rounded-xl-pc max-md:rounded-xl-sp mx-auto p-24-pc max-md:p-spvw-[20] w-pcvw-[500] max-md:w-full"
                >
                    <h1 className="text-heading-h3-pc max-md:text-heading-h3-sp">
                        新規登録
                    </h1>

                    {message && (
                        <div className="mt-16-pc max-md:mt-16-sp">
                            <FormMessage message={message} />
                        </div>
                    )}

                    <div className="mt-32-pc max-md:mt-32-sp">
                        <Input
                            {...form.register('priceid')}
                            type="hidden"
                            value={priceID}
                        />
                        <div>
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                                {...form.register('email')}
                                placeholder="example@email.com"
                                autoComplete={'email'}
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
                        <div className="mt-24-pc max-md:mt-24-sp">
                            <Label htmlFor="password">パスワード</Label>
                            <InputPassword
                                {...form.register('password')}
                                autoComplete={'current-password'}
                                variant={
                                    form.formState.errors.password
                                        ? 'error'
                                        : 'default'
                                }
                                className="mt-8-pc max-md:mt-8-sp"
                                id="password"
                            />
                            {form.formState.errors.password ? (
                                <p className="text-status-error text-body-small-pc max-md:text-body-small-sp mt-4-pc max-md:mt-4-sp">
                                    {form.formState.errors.password.message}
                                </p>
                            ) : (
                                <div className="text-text-secondary text-body-small-pc max-md:text-body-small-sp mt-4-pc max-md:mt-4-sp">
                                    ※半角英数字（大文字・小文字）を含む8文字以上で入力してください。
                                </div>
                            )}
                        </div>

                        <SubmitButton
                            pendingText="新規登録中..."
                            className="w-full mt-48-pc max-md:mt-48-sp"
                        >
                            新規登録
                        </SubmitButton>

                        <div className="flex flex-col items-center gap-12-pc max-md:gap-12-sp mt-32-pc max-md:mt-32-sp">
                            <Link
                                href="/sign-in"
                                className="text-body-small-pc max-md:text-body-small-sp text-text-secondary underline"
                            >
                                ログインはこちら
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
