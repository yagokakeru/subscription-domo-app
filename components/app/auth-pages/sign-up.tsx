'use client'

import { useAtomValue } from 'jotai'
import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { InputPassword } from '@/components/ui/input-password'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
// import { SmtpMessage } from '@/app/(auth-pages)/smtp-message'
import { priceIdAtom } from '@/lib/atoms/handOver'
import { useSignupFrom } from '@/lib/validation/hooks'

export function SignUpForm({ message }: { message: Message }) {
    const priceID = useAtomValue(priceIdAtom)
    const { form, onSubmit } = useSignupFrom()

    if ('message' in message) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <FormMessage message={message} />
            </div>
        )
    }

    return (
        <>
            <div className="pt-pcvw-[150]">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-background-surface rounded-xl-pc mx-auto p-24-pc w-pcvw-[500]"
                >
                    <h1 className="text-heading-h3-pc">新規登録</h1>
                    <div className="mt-32-pc">
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
                                className="mt-8-pc"
                            />
                            {form.formState.errors.email && (
                                <p className="text-status-error text-body-small-pc mt-4-pc">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="mt-24-pc">
                            <Label htmlFor="password">パスワード</Label>
                            <InputPassword
                                {...form.register('password')}
                                autoComplete={'current-password'}
                                variant={
                                    form.formState.errors.password
                                        ? 'error'
                                        : 'default'
                                }
                                className="mt-8-pc"
                            />
                            {form.formState.errors.password ? (
                                <p className="text-status-error text-body-small-pc mt-4-pc">
                                    {form.formState.errors.password.message}
                                </p>
                            ) : (
                                <div className="text-text-secondary text-body-small-pc mt-4-pc">
                                    ※半角英数字（大文字・小文字）を含む8文字以上で入力してください。
                                </div>
                            )}
                        </div>

                        <SubmitButton
                            pendingText="新規登録中..."
                            className="w-full mt-48-pc"
                        >
                            新規登録
                        </SubmitButton>

                        <div className="flex flex-col items-center gap-12-pc mt-32-pc">
                            <Link
                                href="/sign-in"
                                className="text-body-small-pc text-text-secondary underline"
                            >
                                ログインはこちら
                            </Link>
                        </div>

                        <FormMessage message={message} />
                    </div>
                </form>
            </div>
            {/* <SmtpMessage /> */}
        </>
    )
}
