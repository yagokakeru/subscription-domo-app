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
    // Stripe price_id があるものだけ抽出
    const paidPlans = plans.filter((p) => p.stripe_price_id)

    // stripeからの商品情報を配列にまとめる
    const prices = await Promise.all(
        paidPlans.map((p) => stripe.prices.retrieve(p.stripe_price_id))
    )

    // 商品情報をMap化する
    const priceMap = new Map(prices.map((price) => [price.id, price]))

    // 3. mergeして返す
    const planInfo = plans.map<planInfo>((plan) => {
        // freeプランの場合
        if (!plan.stripe_price_id) {
            return {
                id: plan.id,
                name: plan.name,
                description: plan.description,
                isRecommended: plan.is_recommended,
                planFeatures: plan.features,
                priceId: null,
                amount: 0,
                currency: 'jpy',
                interval: '月',
            }
        }

        const price = priceMap.get(plan.stripe_price_id)

        if (!price || !price.unit_amount || !price.recurring) {
            throw new Error(`Invalid price: ${plan.stripe_price_id}`)
        }

        return {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            isRecommended: plan.is_recommended,
            planFeatures: plan.features,
            priceId: price.id,
            amount: price.unit_amount,
            currency: price.currency,
            interval: intervalLabelMap[price.recurring.interval],
        }
    })

    return { ok: true, data: planInfo }
}

// 決済間隔のラベルマップ
const intervalLabelMap: Record<Stripe.Price.Recurring.Interval, string> = {
    day: '日',
    week: '週',
    month: '月',
    year: '年',
}
