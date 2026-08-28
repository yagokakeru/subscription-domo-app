'use server'

import type { Message } from '@/types/message'
import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { createClient as createClientAdmin } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

import { getUserInfo } from '@/lib/functions/profile/getUserInfo'
import { getCheckoutUrl } from '@/lib/getCheckoutUrl'

import {
    signupFormValues,
    loginFormValues,
    forgotPasswordFormValues,
    passwordResetFormValues,
    passwordResetSchema,
} from '@/lib/validation/schema'

export const signUpAction = async (
    formData: signupFormValues
): Promise<Message> => {
    const priceID = formData.priceid
    const email = formData.email
    const password = formData.password
    const supabase = await createClient()
    const supabaseAdmin = createClientAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
    // Stripeクライアントを作成
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    // ユーザー作成をロールバックする関数
    const rollbackSignUp = async (userId: string, stripe_uuid?: string) => {
        try {
            await supabase.auth.signOut() // supabase.auth.signUpで発行されたsessionを削除するためにサインアウト
            await supabaseAdmin.auth.admin.deleteUser(userId) // supabase authユーザー情報削除
            if (stripe_uuid) {
                await stripe.customers.del(stripe_uuid) // stripe顧客情報削除
            }
        } catch (rollbackError) {
            console.error('ロールバック失敗:', rollbackError)
        }
    }

    // emailかpasswordの入力がなければサインアップページにリダイレクト
    if (!email || !password) {
        return {
            messageType: 'error',
            message: 'メールアドレスとパスワードを入力してください。',
        }
    }

    // ユーザーを作成
    const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
    })

    if (signUpError) {
        console.error(signUpError)
        return {
            messageType: 'error',
            message:
                signUpError.code == 'user_already_exists'
                    ? 'ユーザーはすでに存在しています。'
                    : 'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
        }
    }

    // Stripeの顧客情報を作成
    if (data.user) {
        let customer
        try {
            customer = await stripe.customers.create({
                email: data.user.email,
            })
        } catch (stripeError) {
            console.error(stripeError)
            // ユーザー作成をロールバック
            await rollbackSignUp(data.user.id)
            return {
                messageType: 'error',
                message:
                    'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
            }
        }

        // SupabeseとStripeのユーザIDをDBに挿入
        const { error: profileError } = await supabase.from('profile').insert({
            stripe_uuid: customer.id,
            supabase_uuid: data.user.id,
            email: data.user.email,
        })
        if (profileError) {
            await rollbackSignUp(data.user.id, customer.id) // ユーザー作成をロールバック
            console.error(profileError)
            return {
                messageType: 'error',
                message:
                    'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
            }
        }

        const { error: subError } = await supabase
            .from('subscription')
            .insert({
                plan_id: 5, // よくないけどfreeプランのIDを手入力
                user_id: data.user.id,
                stripe_customer_id: customer.id,
                stripe_subscription_id: null,
                price_id: null,
                status: 'active',
                current_period_end: null,
                cancel_at_period_end: false,
            })
            .select()

        if (subError) {
            await supabase
                .from('profile')
                .delete()
                .eq('supabase_uuid', data.user.id) // supabase profile情報削除
            await rollbackSignUp(data.user.id, customer.id) // ユーザー作成をロールバック

            console.error(subError)
            return {
                messageType: 'error',
                message:
                    'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
            }
        }
    }

    // priceIDがあったらプランを購入する新規ユーザー
    if (priceID) {
        // ログインユーザー情報を取得
        const userData = await getUserInfo()

        if (userData) {
            const customerID = userData.stripe_uuid
            const sessionURL = await getCheckoutUrl(priceID, customerID)

            if (sessionURL) {
                return redirect(sessionURL)
            }
        } else {
            return {
                messageType: 'error',
                message:
                    'ユーザー情報を取得できませんでした。しばらくしてからもう一度お試しください。',
            }
        }
    }

    return redirect('/protected')
}

export const signInAction = async (
    formData: loginFormValues
): Promise<Message> => {
    const email = formData.email
    const password = formData.password

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error(error)
        return {
            messageType: 'error',
            message:
                'ログインできませんでした。メールアドレスとパスワードを確認してください。',
        }
    }

    return redirect('/protected')
}

export const forgotPasswordAction = async (
    formData: forgotPasswordFormValues
): Promise<Message> => {
    const email = formData.email
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    if (!email) {
        return {
            messageType: 'error',
            message: 'メールアドレスを入力してください。',
        }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    })

    if (error) {
        console.error(error)
        return {
            messageType: 'error',
            message:
                'パスワードのリセットリンクの送信に失敗しました。しばらくしてからもう一度お試しください。',
        }
    }

    return {
        messageType: 'success',
        message:
            'パスワードのリセットリンクを送信しました。メールをご確認ください。',
    }
}

export const resetPasswordAction = async (
    formData: passwordResetFormValues
): Promise<Message> => {
    const supabase = await createClient()

    const parsed = passwordResetSchema.safeParse(formData)

    if (!parsed.success) {
        return {
            messageType: 'error',
            message: parsed.error.issues[0].message,
        }
    }

    const { error } = await supabase.auth.updateUser({
        password: parsed.data.newPassword,
    })

    if (error) {
        return {
            messageType: 'error',
            message: 'パスワードの更新に失敗しました。',
        }
    }

    return {
        messageType: 'success',
        message: 'パスワードの更新に成功しました。',
    }
}

export const signOutAction = async () => {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/sign-in')
}

export const deleteAccountAction = async (formData: FormData) => {
    const userID = formData.get('user_id')?.toString()
    const supabase = await createClient()
    const supabaseAdmin = createClientAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
    // Stripeクライアントを作成
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    if (userID) {
        const { data, error } = await supabase
            .from('profile')
            .select('stripe_uuid')
            .eq('supabase_uuid', userID)

        if (data) {
            try {
                await stripe.customers.del(data[0].stripe_uuid) // stripe顧客情報削除
                await supabaseAdmin.auth.admin.deleteUser(userID) // supabase authユーザー情報削除
                await supabase
                    .from('profile')
                    .delete()
                    .eq('supabase_uuid', userID) // supabase profile情報削除
                await supabase
                    .from('subscription')
                    .delete()
                    .eq('user_id', userID) // supabase サブスク情報削除
            } catch (error) {
                return encodedRedirect(
                    'error',
                    '/protected',
                    `ユーザー削除処理でエラー: ${error}`
                )
            }
        }

        if (error) {
            console.error('error', error)
            return redirect('/protected')
        }

        await supabase.auth.signOut()
        return redirect('/')
    } else {
        return encodedRedirect('error', '/protected', 'Delete account failed')
    }
}
