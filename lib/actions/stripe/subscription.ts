'use server'

import Stripe from 'stripe'
import { stripeClient } from '@/utils/stripe/server'
import { createClientRole } from '@/utils/supabase/server'
import type { userProfile } from '@/types/userProfile'
import type { Message } from '@/types/message'
import { tr } from 'zod/v4/locales'

// Stripeクライアントを作成
const stripe = stripeClient()

/**
 * サブスク契約時にDBにサブスク情報を保存するアクション
 */
export const Subscription = async (
    event: Stripe.CustomerSubscriptionCreatedEvent
) => {
    const userId = event.data.object.metadata.user_id

    if (!userId) {
        // 再送されても直らない恒久的な失敗なので、throwせずログだけ残して正常終了する
        console.error(
            '[stripe webhook] metadata.user_id がありません:',
            `subscription=${event.data.object.id}`,
            `customer=${event.data.object.customer}`
        )
        return
    }

    // Supabaseクライアントを作成
    const supabase = await createClientRole()

    const { data: planData, error: planError } = await supabase
        .from('plan')
        .select('id')
        .eq('stripe_price_id', event.data.object.items.data[0].price.id)
        .single()

    if (planError) {
        console.error('Error fetching plan data:', planError)
        throw new Error('Error fetching plan data')
    }

    const { data: subData, error: subError } = await supabase
        .from('subscription')
        .update({
            // signupした時点でレコード作成するのでupdate
            plan_id: planData?.id,
            user_id: userId,
            stripe_customer_id: event.data.object.customer,
            stripe_subscription_id: event.data.object.id,
            price_id: event.data.object.items.data[0].price.id,
            status: event.data.object.status,
            current_period_end: new Date(
                event.data.object.current_period_end * 1000
            ).toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            cancel_at_period_end: event.data.object.cancel_at_period_end,
        })
        .eq('user_id', userId)
        .select()

    if (subError) {
        console.error('Error updating subscription:', subError)
        throw new Error('Error updating subscription')
    }
}

/**
 * サブスクを解約状態からアクティブに戻すアクション
 *
 * @param subscriptionID
 */
export const ReactivateSubscription = async (
    userID: userProfile['user_id']
): Promise<Message> => {
    const supabase = await createClientRole()

    const { data: selectData, error: selectError } = await supabase
        .from('subscription')
        .select()
        .eq('user_id', userID)
        .single()

    if (selectError) {
        console.error('Error fetching subscription:', selectError)
        return {
            messageType: 'error',
            message: 'サブスクリプションの再開に失敗しました',
        }
    }

    try {
        // サブスクを解約
        const subscription = await stripe.subscriptions.update(
            selectData.stripe_subscription_id,
            { cancel_at_period_end: false }
        )

        const { error: updateError } = await supabase
            .from('subscription')
            .update({ cancel_at_period_end: subscription.cancel_at_period_end })
            .eq('user_id', userID)

        if (updateError) {
            console.error('Error updating subscription:', updateError)
            return {
                messageType: 'error',
                message: 'サブスクリプションの再開に失敗しました',
            }
        }
    } catch (error) {
        console.error('Error reactivating subscription:', error)
        return {
            messageType: 'error',
            message: 'サブスクリプションの再開に失敗しました',
        }
    }

    return {
        messageType: 'success',
        message: 'サブスクリプションの再開に成功しました',
    }
}

/**
 * サブスクのアップグレードアクション
 */
export const UpgradeSubscription = async (
    subscriptionId: string,
    price_id: string
): Promise<Message> => {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        const itemId = subscription.items.data[0].id

        await stripe.subscriptions.update(subscriptionId, {
            items: [
                {
                    id: itemId,
                    price: price_id,
                },
            ],
            proration_behavior: 'create_prorations',
        })
    } catch (error) {
        console.error('Error upgrading subscription:', error)
        return {
            messageType: 'error',
            message: 'サブスクリプションのアップグレードに失敗しました',
        }
    }

    return {
        messageType: 'success',
        message: 'サブスクリプションのアップグレードに成功しました',
    }
}

/**
 * サブスク契約時にDBにサブスク情報を保存するアクション
 */
export const UpgradeSubscriptionWithWebhook = async (
    event: Stripe.CustomerSubscriptionUpdatedEvent
) => {
    const userId = event.data.object.metadata.user_id

    if (!userId) {
        // 再送されても直らない恒久的な失敗なので、throwせずログだけ残して正常終了する
        console.error(
            '[stripe webhook] metadata.user_id がありません:',
            `subscription=${event.data.object.id}`,
            `customer=${event.data.object.customer}`
        )
        return
    }

    const supabase = await createClientRole()

    const { data: planData, error: planError } = await supabase
        .from('plan')
        .select('id')
        .eq('stripe_price_id', event.data.object.items.data[0].price.id)
        .single()

    if (planError) {
        console.error('Error fetching plan data:', planError)
        throw new Error('Error fetching plan data')
    }

    const { data: subData, error: subError } = await supabase
        .from('subscription')
        .update({
            plan_id: planData?.id,
            user_id: userId,
            stripe_customer_id: event.data.object.customer,
            stripe_subscription_id: event.data.object.id,
            price_id: event.data.object.items.data[0].price.id,
            status: event.data.object.status,
            current_period_end: new Date(
                event.data.object.current_period_end * 1000
            ).toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            cancel_at_period_end: event.data.object.cancel_at_period_end,
        })
        .eq('user_id', userId)
        .select()

    if (subError) {
        console.error('Error updating subscription:', subError)
        throw new Error('Error updating subscription')
    }
}
