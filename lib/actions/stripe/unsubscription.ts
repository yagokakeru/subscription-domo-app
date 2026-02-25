'use server'

import Stripe from 'stripe'
import { createClient, createClientRole } from '@/utils/supabase/server'
import type { userProfile } from '@/types/userProfile'

// Stripeクライアントを作成
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)

/**
 * サブスク解約処理
 *
 * @param userID
 */
export const Unsubscription = async (userID: userProfile['user_id']) => {
    const supabase = await createClientRole()

    const { data: selectData, error: selectError } = await supabase
        .from('subscription')
        .select()
        .eq('user_id', userID)
        .single()

    if (selectData) {
        // サブスクを解約
        const subscription = await stripe.subscriptions.update(
            selectData.stripe_subscription_id,
            { cancel_at_period_end: true }
        )

        const { error: updataError } = await supabase
            .from('subscription')
            .update({ cancel_at_period_end: subscription.cancel_at_period_end })
            .eq('user_id', userID)
    }
}

/**
 * サブスク解約成立時の処理
 *
 * @param subscriptionID
 */
export const UnsubscriptionWebhook = async (subscriptionID: string) => {
    const supabase = await createClientRole()

    const { data, error } = await supabase
        .from('subscription')
        .delete()
        .eq('stripe_subscription_id', subscriptionID)
        .select()
        .single()
}
