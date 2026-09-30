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

        try {
            await stripe.subscriptions.update(
                selectData.stripe_subscription_id,
                { cancel_at_period_end: false }
            )
        } catch (rollbackError) {
            console.error(
                'CRITICAL: rollback failed, Stripe/DB state inconsistent:',
                rollbackError
            )
        }

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

    const { data: freePlan, error: planError } = await supabase
        .from('plan')
        .select('id')
        .is('stripe_price_id', null)
        .single()

    if (planError) {
        console.error('Error fetching free plan:', planError)
        throw new Error('Error fetching free plan')
    }

    const { error: updataError } = await supabase
        .from('subscription')
        .update({
            stripe_subscription_id: null,
            price_id: null,
            status: 'active',
            current_period_end: null,
            cancel_at_period_end: false,
            plan_id: freePlan.id,
        })
        .eq('stripe_subscription_id', subscriptionID)

    if (updataError) {
        console.error('Error updating subscription:', updataError)
        throw new Error('Error updating subscription')
    }
}
