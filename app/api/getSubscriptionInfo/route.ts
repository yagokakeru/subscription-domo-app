/**
 * サブスクリプリプションを情報を取得
 *
 * 料金表に必要な情報の配列を作り返す
 *
 */

import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// 型をインポート
import { SubscriptionInfo } from '@/types/subscriptionInfo'

// Stripeクライアントを作成
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)

export async function POST() {
    // 全ての価格情報を取得
    const prices = await stripe.prices.list({
        limit: 100,
    })
    // 製品IDから価格情報を取得し必要な情報を格納
    const subscriptionInfo: SubscriptionInfo[] = await Promise.all(
        prices.data.map(async (price) => {
            const product = await stripe.products.retrieve(
                price.product as string
            )

            return {
                price_id: price.id,
                prod_id: price.product,
                name: product.name,
                interval: price.recurring!.interval,
                price: price.unit_amount ? price.unit_amount : 0,
            }
        })
    )

    // 配列のpriceが昇順になるようにソート
    subscriptionInfo.sort((a, b) => {
        return a.price - b.price
    })

    return NextResponse.json(
        { subscriptionInfo: subscriptionInfo },
        { status: 200 }
    )
}
