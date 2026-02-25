/**
 * ユーザーの契約中のプラン情報を返す関数
 */
import { createClient } from '@/utils/supabase/server'

export async function getUserPlan() {
    // supabaseクライアントを作成
    const supabase = await createClient()

    // 1. ログインユーザーIDを取得
    const {
        data: { user },
    } = await supabase.auth.getUser()
    const userID = user ? user.id : ''

    // 2. 契約中のサブスク情報を取得
    const { data: subData, error: subError } = await supabase
        .from('subscription')
        .select()
        .eq('user_id', userID)
        .single()

    if (subError) {
        return null
    }

    // 3. プラン情報を取得
    const { data: planData, error: planError } = await supabase
        .from('plan')
        .select()
        .eq('stripe_price_id', subData.price_id)
        .single()

    // 4. サブスク情報とプラン情報をマージして返す
    const result = Object.assign(subData, planData)

    return result || null
}
