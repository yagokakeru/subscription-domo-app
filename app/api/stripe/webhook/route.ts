/**
 * Stripe Webhookのエンドポイント
 */
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripeClient } from '@/utils/stripe/server'
import Stripe from 'stripe'

import {
    Subscription,
    UpgradeSubscriptionWithWebhook,
} from '@/lib/actions/stripe/subscription'
import { UnsubscriptionWebhook } from '@/lib/actions/stripe/unsubscription'

// Stripeクライアントを作成
const stripe = stripeClient()

export async function POST(req: NextResponse) {
    try {
        const body = await req.text()
        const headersList = await headers()
        const sig = headersList.get('stripe-signature')

        if (!sig) {
            return new Response('No signature', { status: 400 })
        }

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(
                body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            )
        } catch (err) {
            console.error('Webhook signature verification failed.', err)
            return new Response('Webhook Error', { status: 400 })
        }

        // イベント処理
        // イベントの種類と役割：https://docs.stripe.com/api/events/types
        switch (event.type) {
            case 'checkout.session.completed':
                console.log(event.type, '決済完了🎉🎉🎉🎉🎉🎉🎉🎉')
                break
            case 'customer.subscription.created':
                console.log(event.type, 'サブスク契約🤑🤑🤑🤑🤑🤑🤑🤑')
                await Subscription(event)
                break
            case 'customer.subscription.updated':
                console.log(event.type, 'サブスクプラン変更🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️')
                await UpgradeSubscriptionWithWebhook(event)
                break
            case 'customer.subscription.deleted':
                console.log(event.type, 'サブスク解約😞😞😞😞😞😞😞😞')
                await UnsubscriptionWebhook(event.data.object.id)
                break
            case 'invoice.payment_succeeded':
                console.log(event.type, '支払い成功💰💰💰💰💰💰💰💰')
                break
            case 'invoice.payment_failed':
                console.log(event.type, '支払い失敗😤😤😤😤😤😤😤😤')
                break
            default:
            // console.log(
            //     `🚨🚨🚨🚨🚨🚨\n${event.type}\n処理対象外のイベントだ\n🚨🚨🚨🚨🚨🚨\nこれだよ`
            // )
            // console.log(event)
        }
    } catch (error) {
        console.error('Error handling webhook event:', error)
        return new Response('Webhook Handler Error', { status: 500 })
    }

    return new Response('ok', { status: 200 })
}
