import { createClient } from '@/utils/supabase/server'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'

/**
 * ユーザーのアクティブな台本IDの配列を取得する
 */
export const getActiveScriptIds = async (): Promise<Set<number> | null> => {
    // supabaseクライアントを作成
    const supabase = await createClient()

    const userPlan = await getUserPlan()
    if (!userPlan) throw new Error('ユーザープランの取得に失敗しました。')
    if (userPlan.max_scripts == null) return null

    const maxScripts = userPlan.max_scripts

    const { data: scriptIds, error } = await supabase
        .from('script')
        .select('id')
        .order('inserted_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(maxScripts)
        .eq('user_id', userPlan.user_id)

    if (error) throw error

    return new Set(scriptIds.map((script) => script.id))
}
