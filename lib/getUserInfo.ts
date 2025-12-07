import { createClient } from '@/utils/supabase/server'

export async function getUserInfo() {
    // supabaseクライアントを作成
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    const userID = user ? user.id : ''

    const userData = await supabase
        .from('user_with_profile')
        .select()
        .eq('user_id', userID) // supabase ユーザーのprofile情報取得

    return userData
}
