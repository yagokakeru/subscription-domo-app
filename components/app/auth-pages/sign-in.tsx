'use client'

import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { InputPassword } from '@/components/ui/input-password'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useLoginFrom } from '@/lib/validation/hooks'

export function LoginForm({ message }: { message: Message }) {
    const { form, onSubmit } = useLoginFrom()

    return (
        <div className="pt-pcvw-[150]">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-background-surface rounded-xl-pc mx-auto p-24-pc w-pcvw-[500]"
            >
                <h1 className="text-heading-h3-pc">ログイン</h1>
                {/* <p className="text-sm text-foreground">
                    {"Don't have an account?"}{' '}
                    <Link
                        className="text-foreground font-medium underline"
                        href="/sign-up"
                    >
                        Sign up
                    </Link>
                </p> */}
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

                    <div className="mt-24-pc">
                        <Label htmlFor="password">パスワード</Label>
                        <InputPassword
                            {...form.register('password')}
                            type="password"
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
                        pendingText="ログイン中..."
                        className="w-full mt-48-pc"
                    >
                        ログイン
                    </SubmitButton>

                    <div className="flex flex-col items-center gap-12-pc mt-32-pc">
                        <Link
                            href="/forgot-password"
                            className="text-body-small-pc text-text-secondary underline"
                        >
                            パスワードをお忘れですか？
                        </Link>
                        <Link
                            href="/sign-up"
                            className="text-body-small-pc text-text-secondary underline"
                        >
                            新規登録はこちら
                        </Link>
                    </div>

                    <FormMessage message={message} />
                </div>
            </form>
        </div>
    )
}
