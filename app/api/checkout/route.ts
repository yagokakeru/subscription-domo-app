/**
 * 決算ページのURLを返す
 *
 * priceIDから決算ページのURLを返す
 *
 * @param {string} priceID - price_ から始まるID
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Stripeクライアントを作成
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)


export async function POST(req: NextRequest, res: NextResponse) {
    // 商品IDを取得
    const { priceID } = await req.json()

    // 決算を作成
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceID,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: 'http://localhost:3000/sucsses/?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/pricing/',
    })

    return NextResponse.json({ checkout_url: session.url }, { status: 200 })
}