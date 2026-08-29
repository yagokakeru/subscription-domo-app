import { stripeClient } from '@/utils/stripe/server'

// Stripeクライアントを作成
const stripe = stripeClient()
const url = process.env.NEXT_PUBLIC_APP_URL as string

export async function getCheckoutUrl(priceID: string, customerID: string) {
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
        success_url: `${url}/success/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/pricing/`,
    })

    return session.url
}
