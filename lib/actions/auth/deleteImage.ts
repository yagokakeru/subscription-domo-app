'use server'

import { createClient } from '@/utils/supabase/server'
import type { userProfile } from '@/types/userProfile'
import type { Message } from '@/types/message'

export const deleteImage = async (
    id: userProfile['user_id']
): Promise<Message> => {
    const supabase = await createClient()

    // 1. 現在のプロフィール取得（古い画像削除のため）
    const { data: profile } = await supabase
        .from('profile')
        .select('avatar_url')
        .eq('supabase_uuid', id)
        .single()

    const oldPath = profile?.avatar_url || null

    // 2. 古いファイルを削除
    if (oldPath) {
        const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([oldPath])

        if (deleteError) {
            return {
                messageType: 'error',
                message: `アバター画像削除に失敗しました。${deleteError?.message}`,
            }
        }
    }

    // 3. profile.avatar_url を null に更新
    const { error: updateError } = await supabase
        .from('profile')
        .update({ avatar_url: '' })
        .eq('supabase_uuid', id)

    if (updateError) {
        return {
            messageType: 'error',
            message: `プロフィールの更新に失敗しました。${updateError?.message}`,
        }
    }

    return {
        messageType: 'success',
        message: '画像を削除しました。',
    }
}
