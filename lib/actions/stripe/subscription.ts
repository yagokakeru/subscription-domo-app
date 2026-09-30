'use server'

import Stripe from 'stripe'
import { stripeClient } from '@/utils/stripe/server'
import { createClientRole } from '@/utils/supabase/server'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'
import type { userProfile } from '@/types/userProfile'
import type { Message } from '@/types/message'

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

    // イベントのスナップショットではなく、今の状態を取り直す
    const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id
    )

    // Supabaseクライアントを作成
    const supabase = await createClientRole()

    const { data: planData, error: planError } = await supabase
        .from('plan')
        .select('id')
        .eq('stripe_price_id', subscription.items.data[0].price.id)
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
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_end: new Date(
                subscription.current_period_end * 1000
            ).toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            cancel_at_period_end: subscription.cancel_at_period_end,
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
export const ReactivateSubscription = async (): Promise<Message> => {
    const supabase = await createClientRole()

    const currentPlan = await getUserPlan()
    if (!currentPlan) {
        return {
            messageType: 'error',
            message: 'サブスクリプションの再開に失敗しました',
        }
    }
    const userID = currentPlan.user_id
    const subscriptionID = currentPlan.stripe_subscription_id

    if (!subscriptionID) {
        return {
            messageType: 'error',
            message: 'サブスクリプションの再開に失敗しました',
        }
    }

    try {
        // サブスクを再開
        const subscription = await stripe.subscriptions.update(subscriptionID, {
            cancel_at_period_end: false,
        })

        const { error: updateError } = await supabase
            .from('subscription')
            .update({ cancel_at_period_end: subscription.cancel_at_period_end })
            .eq('user_id', userID)

        if (updateError) {
            console.error('Error updating subscription:', updateError)

            // ロールバックとしてサブスクを再度解約状態に戻す
            try {
                await stripe.subscriptions.update(subscriptionID, {
                    cancel_at_period_end: true,
                })
            } catch (rollbackError) {
                console.error(
                    'CRITICAL: rollback failed, Stripe/DB state inconsistent:',
                    rollbackError
                )
            }

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
    price_id: string
): Promise<Message> => {
    let updatedSubscription: Stripe.Subscription

    const supabase = await createClientRole()

    const currentPlan = await getUserPlan()
    if (!currentPlan) {
        return {
            messageType: 'error',
            message: 'サブスクリプションのアップグレードに失敗しました',
        }
    }
    const subscriptionId = currentPlan.stripe_subscription_id

    if (!subscriptionId) {
        return {
            messageType: 'error',
            message: 'サブスクリプションのアップグレードに失敗しました',
        }
    }

    const { data: planData, error: planError } = await supabase
        .from('plan')
        .select('id')
        .eq('stripe_price_id', price_id)
        .eq('is_active', true)
        .single()

    if (planError) {
        console.error('Error fetching plan data:', planError)
        return {
            messageType: 'error',
            message: 'サブスクリプションのアップグレードに失敗しました',
        }
    }

    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        const itemId = subscription.items.data[0].id

        updatedSubscription = await stripe.subscriptions.update(
            subscriptionId,
            {
                items: [
                    {
                        id: itemId,
                        price: price_id,
                    },
                ],
                proration_behavior: 'create_prorations',
                cancel_at_period_end: false, // 解約予定中なら取り消す
            }
        )
    } catch (error) {
        console.error('Error upgrading subscription:', error)
        return {
            messageType: 'error',
            message: 'サブスクリプションのアップグレードに失敗しました',
        }
    }

    const { error: subError } = await supabase
        .from('subscription')
        .update({
            plan_id: planData.id,
            price_id: price_id,
            status: updatedSubscription.status,
            current_period_end: new Date(
                updatedSubscription.current_period_end * 1000
            ).toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            cancel_at_period_end: updatedSubscription.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', subscriptionId)

    if (subError) {
        console.error('Error updating subscription:', subError)
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

    // イベントのスナップショットではなく、今の状態を取り直す
    const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id
    )

    const supabase = await createClientRole()

    const { data: planData, error: planError } = await supabase
        .from('plan')
        .select('id')
        .eq('stripe_price_id', subscription.items.data[0].price.id)
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
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_end: new Date(
                subscription.current_period_end * 1000
            ).toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            cancel_at_period_end: subscription.cancel_at_period_end,
        })
        .eq('user_id', userId)
        .select()

    if (subError) {
        console.error('Error updating subscription:', subError)
        throw new Error('Error updating subscription')
    }
}
