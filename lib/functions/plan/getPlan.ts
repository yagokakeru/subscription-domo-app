/**
 * 商品情報を返す関数
 */
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

import type { Result } from '@/types/result'
import type { planInfo } from '@/types/planInfo'

export async function getPlan(): Promise<Result<planInfo[]>> {
    const supabase = await createClient()
    const stripe = await new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!)

    // 1.supabeseからプラン取得
    const { data: plans, error } = await supabase
        .from('plan')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

    if (error || !plans) {
        // エラー処理する
        console.error('DBからプラン取得失敗', error)
        return { ok: false, message: 'プラン取得に失敗しました。' }
    }

    // 2.stripeから商品情報を取得
    // stripe_price_idを配列にまとめる
    const planIDs = plans.map<string>((plan) => plan.stripe_price_id)
    // stripeからの商品情報を配列にまとめる
    const prices = await Promise.all(
        planIDs.map((id) => stripe.prices.retrieve(id))
    )
    // 商品情報をMap化する
    const priceMap = new Map(prices.map((price) => [price.id, price]))

    // 3. mergeして返す
    const planInfo = plans.map<planInfo>((plan) => {
        const price = priceMap.get(plan.stripe_price_id)

        if (!price || !price.unit_amount || !price.recurring) {
            throw new Error(`Invalid price: ${plan.stripe_price_id}`)
        }

        return {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            isRecommended: plan.is_recommended,
            priceId: price.id,
            amount: price.unit_amount,
            currency: price.currency,
            interval: price.recurring.interval,
        }
    })

    return { ok: true, data: planInfo }
}
