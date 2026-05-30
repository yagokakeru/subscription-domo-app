'use server'

import Stripe from 'stripe'
import { createClient, createClientRole } from '@/utils/supabase/server'
import type { userProfile } from '@/types/userProfile'
import type { planInfo } from '@/types/planInfo'

// Stripeクライアントを作成
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)

/**
 * サブスク契約時にDBにサブスク情報を保存するアクション
 */
export const Subscription = async (
    event: Stripe.CustomerSubscriptionCreatedEvent
) => {
    const supabase = await createClientRole()

    const { data: planData, error: planError } = await supabase
        .from('plan')
        .select('id')
        .eq('stripe_price_id', event.data.object.plan.id)
        .single()

    const { data: sub, error } = await supabase
        .from('subscription')
        .update({
            // signupした時点でレコード作成するのでupdate
            plan_id: planData?.id,
            user_id: event.data.object.metadata.user_id,
            stripe_customer_id: event.data.object.customer,
            stripe_subscription_id: event.data.object.id,
            price_id: event.data.object.plan.id,
            status: 'active',
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
        .select()
}

/**
 * サブスクを解約状態からアクティブに戻すアクション
 *
 * @param subscriptionID
 */
export const ReactivateSubscription = async (
    userID: userProfile['user_id']
) => {
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
            { cancel_at_period_end: false }
        )

        const { error: updataError } = await supabase
            .from('subscription')
            .update({ cancel_at_period_end: subscription.cancel_at_period_end })
            .eq('user_id', userID)
    }
}

/**
 * サブスクのアップグレードアクション
 */
export const UpgradeSubscription = async (
    subscriptionId: string,
    price_id: string
) => {
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
}

/**
 * サブスク契約時にDBにサブスク情報を保存するアクション
 */
export const UpgradeSubscriptionWithWebhook = async (
    event: Stripe.CustomerSubscriptionUpdatedEvent
) => {
    const supabase = await createClientRole()

    const { data: planData, error: planError } = await supabase
        .from('plan')
        .select('id')
        .eq('stripe_price_id', event.data.object.plan.id)
        .single()

    const { data: sub, error } = await supabase
        .from('subscription')
        .update({
            plan_id: planData?.id,
            user_id: event.data.object.metadata.user_id,
            stripe_customer_id: event.data.object.customer,
            stripe_subscription_id: event.data.object.id,
            price_id: event.data.object.plan.id,
            status: 'active',
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
        .eq('user_id', event.data.object.metadata.user_id)
        .select()
}
