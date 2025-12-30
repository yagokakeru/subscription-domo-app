'use server'

import { createClient } from '@/utils/supabase/server'

export const getAllScript = async () => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    const userID = user?.id

    const { data: script, error } = await supabase
        .from('script')
        .select('*')
        .eq('user_id', userID)

    if (error) {
        console.error(error)
        return { success: false, error: '台本の取得に失敗しました。' }
    }

    return { success: true, data: script }
}

export const getEditScript = async (id: string) => {
    const supabase = await createClient()

    const { data: script, error } = await supabase
        .from('script')
        .select('*')
        .eq('id', id)

    if (error) {
        console.error(error)
        return { success: false, error: '台本の取得に失敗しました。' }
    }

    return { success: true, data: script }
}
