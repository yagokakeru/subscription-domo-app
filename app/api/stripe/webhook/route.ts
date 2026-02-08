/**
 * Stripe Webhookのエンドポイント
 */
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Stripeクライアントを作成
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)

export async function POST(req: NextResponse) {
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
            process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!
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
            break
        case 'customer.subscription.updated':
            console.log(event.type, 'サブスクプラン変更🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️🙇‍♂️')
            break
        case 'customer.subscription.deleted':
            console.log(event.type, 'サブスク解約😞😞😞😞😞😞😞😞')
            break
        case 'invoice.payment_succeeded':
            console.log(event.type, '支払い成功💰💰💰💰💰💰💰💰')
            break
        case 'invoice.payment_failed':
            console.log(event.type, '支払い失敗😤😤😤😤😤😤😤😤')
            break
        default:
            console.log(
                `🚨🚨🚨🚨🚨🚨\n${event.type}\n処理対象外のイベントだ\n🚨🚨🚨🚨🚨🚨\nこれだよ`
            )
            console.log(event)
    }

    return new Response('ok', { status: 200 })
}
