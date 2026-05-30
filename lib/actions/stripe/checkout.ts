'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'

import type { Result } from '@/types/result'
import type { userProfile } from '@/types/userProfile'

// Stripeクライアントを作成
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)

export const checkout = async (
    priceID: string,
    customerID: string,
    userID: userProfile['user_id']
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
        subscription_data: {
            metadata: {
                user_id: userID,
            },
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/protected/?session_id={CHECKOUT_SESSION_ID}`,
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
