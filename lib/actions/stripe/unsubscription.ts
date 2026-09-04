'use server'

import { stripeClient } from '@/utils/stripe/server'
import { createClientRole } from '@/utils/supabase/server'
import type Stripe from 'stripe'
import type { userProfile } from '@/types/userProfile'
import type { Message } from '@/types/message'

// Stripeクライアントを作成
const stripe = stripeClient()

/**
 * サブスク解約処理
 *
 * @param userID
 */
export const Unsubscription = async (
    userID: userProfile['user_id']
): Promise<Message> => {
    const supabase = await createClientRole()
    let subscription: Stripe.Subscription | null = null

    const { data: selectData, error: selectError } = await supabase
        .from('subscription')
        .select()
        .eq('user_id', userID)
        .single()

    if (selectError) {
        console.error('Error fetching subscription:', selectError)
        return {
            messageType: 'error',
            message: 'サブスクリプションの解約に失敗しました',
        }
    }

    // サブスクを解約
    try {
        subscription = await stripe.subscriptions.update(
            selectData.stripe_subscription_id,
            { cancel_at_period_end: true }
        )
    } catch (error) {
        console.error('Error unsubscribing:', error)
        return {
            messageType: 'error',
            message: 'サブスクリプションの解約に失敗しました',
        }
    }

    const { error: updataError } = await supabase
        .from('subscription')
        .update({ cancel_at_period_end: subscription.cancel_at_period_end })
        .eq('user_id', userID)

    if (updataError) {
        console.error('Error updating subscription:', updataError)
        return {
            messageType: 'error',
            message: 'サブスクリプションの解約に失敗しました',
        }
    }

    return {
        messageType: 'success',
        message: 'サブスクリプションを解約しました',
    }
}

/**
 * サブスク解約成立時の処理
 *
 * @param subscriptionID
 */
export const UnsubscriptionWebhook = async (subscriptionID: string) => {
    const supabase = await createClientRole()

    const { data: subData, error: subError } = await supabase
        .from('subscription')
        .delete()
        .eq('stripe_subscription_id', subscriptionID)
        .select()

    if (subError) {
        console.error('Error deleting subscription:', subError)
        throw new Error('Error deleting subscription')
    }

    if (!subData || subData.length === 0) {
        console.warn(
            `Subscription not found (already deleted?): ${subscriptionID}`
        )
        return
    }
}
