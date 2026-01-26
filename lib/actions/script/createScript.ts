'use server'

import { redirect } from 'next/navigation'
import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import type { userProfile } from '@/types/userProfile'
import { SCRIPT_DEFAULT } from '@/lib/consts/script/script'

export const createScript = async (userID: userProfile['user_id']) => {
    // 新規ファイルをDBに追加
    const supabase = await createClient()
    const { data: script, error } = await supabase
        .from('script')
        .insert({
            user_id: userID,
            title: SCRIPT_DEFAULT.NAME,
            content: SCRIPT_DEFAULT.CONTENT,
        })
        .select()

    if (error) {
        console.error(error)
        return encodedRedirect(
            'error',
            `/protected`,
            `新規作成に失敗しました。`
        )
    }

    // 追加したファイルの情報をもとにeditページに遷移
    redirect(`/protected/script/edit/${script[0].id}`)
}
