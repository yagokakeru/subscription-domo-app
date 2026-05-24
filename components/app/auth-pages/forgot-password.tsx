'use client'

import { forgotPasswordAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
// import { SmtpMessage } from '@/app/(auth-pages)/smtp-message'

export default function ForgotPasswordForm({ message }: { message: Message }) {
    return (
        <>
            <div className="pt-pcvw-[150]">
                <form className="bg-background-surface rounded-xl-pc mx-auto p-24-pc w-pcvw-[500]">
                    <h1 className="text-heading-h3-pc">パスワードをリセット</h1>

                    <FormMessage message={message} className="mt-24-pc" />

                    <div className="mt-32-pc">
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input
                            name="email"
                            placeholder="you@example.com"
                            required
                            className="mt-8-pc"
                        />
                        <SubmitButton
                            formAction={forgotPasswordAction}
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
                {/* <SmtpMessage /> */}
            </div>
        </>
    )
}
