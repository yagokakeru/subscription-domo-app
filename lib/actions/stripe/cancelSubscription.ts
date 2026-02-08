'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'

import type { Result } from '@/types/result'

// Stripeクライアントを作成
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)

export const cancelSubscription = async (
    priceID: string,
    customerID: string
): Promise<Result<string>> => {
    // 決算を作成
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceID,
                quantity: 1,
            },
        ],
        customer: customerID,
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sucsses/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/plan`,
    })

    if (session.url) {
        redirect(session.url)
    } else {
        return {
            ok: false,
            message:
                '決済を開始できませんでした。時間をおいて再度お試しください。',
        }
    }
}
