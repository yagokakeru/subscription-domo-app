import { createClient } from "@/utils/supabase/server";

export async function getUserInfo() {
    // supabaseクライアントを作成
    const supabase = await createClient();

    
    const { data: { user } } = await supabase.auth.getUser();
    const useID = user ? user.id : "";
    const userData = await supabase.from('profile').select().eq('supabase_uuid', useID); // supabase ユーザーのprofile情報取得

    return userData;
}