'use server'

import { redirect } from 'next/navigation'
import { stripeClient } from '@/utils/stripe/server'

import type { Message } from '@/types/message'
import type { userProfile } from '@/types/userProfile'

// Stripeクライアントを作成
const stripe = stripeClient()

export const checkout = async (
    priceID: string,
    customerID: string,
    userID: userProfile['user_id']
): Promise<Message> => {
    let session
    // 決算を作成
    try {
        session = await stripe.checkout.sessions.create({
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
    } catch (error) {
        console.error('Checkout error:', error)
        return {
            messageType: 'error',
            message:
                '決済を開始できませんでした。時間をおいて再度お試しください。',
        }
    }

    if (session.url) {
        redirect(session.url)
    }

    return {
        messageType: 'error',
        message: '決済を開始できませんでした。時間をおいて再度お試しください。',
    }
}
