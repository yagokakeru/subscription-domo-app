'use server'

import { createClient } from '@/utils/supabase/server'
import type { userProfile } from '@/types/userProfile'
import type { Message } from '@/types/message'

export const uploadImage = async (
    file: File,
    id: userProfile['user_id']
): Promise<Message & { avatarUrl?: userProfile['avatar_url'] }> => {
    const supabase = await createClient()

    if (!file)
        return { messageType: 'error', message: 'ファイルを選択してください。' }

    // 1. 現在のプロフィール取得（古い画像削除のため）
    const { data: profile } = await supabase
        .from('profile')
        .select('avatar_url')
        .eq('supabase_uuid', id)
        .single()

    const oldPath = profile?.avatar_url || null

    // 2. 新しい画像をアップロード
    const arrayBuffer = await file.arrayBuffer() // FileオブジェクトをArrayBufferに変換
    const buffer = Buffer.from(arrayBuffer) // ArrayBufferをNode.jsのBufferに変換
    const filePath = `${id}/${Date.now()}-${file.name}` // ユニークなファイル名を生成

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, buffer, {
            upsert: true,
            contentType: file.type,
        })

    if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return {
            messageType: 'error',
            message: `画像アップロードに失敗しました。`,
        }
    }

    // 3. profile.avatar_url を更新
    const { error: updateError } = await supabase
        .from('profile')
        .update({ avatar_url: filePath })
        .eq('supabase_uuid', id)

    if (updateError) {
        console.error('Error updating profile:', updateError)
        return {
            messageType: 'error',
            message: `プロフィールの更新に失敗しました。`,
        }
    }

    // 4. 古いファイルを削除（安全のため最後に）
    if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath])
    }

    return {
        messageType: 'success',
        message: 'アバター画像を更新しました。',
        avatarUrl: filePath,
    }
}
