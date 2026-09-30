'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type { userProfile } from '@/types/userProfile'
import { SCRIPT_DEFAULT } from '@/lib/consts/script/script'
import type { Message } from '@/types/message'

export const createScript = async (
    userID: userProfile['user_id']
): Promise<Message> => {
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

        if (error.code === '42501') {
            return {
                messageType: 'error',
                message:
                    '台本の作成上限に達しています。プランをアップグレードしてください。',
            }
        }
        return {
            messageType: 'error',
            message: `新規作成に失敗しました。`,
        }
    }

    // 追加したファイルの情報をもとにeditページに遷移
    redirect(`/protected/script/edit/${script[0].id}`)
}
