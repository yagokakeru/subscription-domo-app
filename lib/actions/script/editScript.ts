'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { editScriptFormValues } from '@/lib/validation/schema'
import { SCRIPT_DEFAULT } from '@/lib/consts/script/script'
import type { Message } from '@/types/message'

export const editScript = async (
    formData: editScriptFormValues,
    jsonS: string,
    id: number
) => {
    const supabase = await createClient()
    const name = formData.name || SCRIPT_DEFAULT.NAME
    const plainContent = formData.plainContent
    // jsonが文字列で渡されるのでパースする
    const jsonP = JSON.parse(jsonS)

    const { error } = await supabase
        .from('script')
        .update({
            title: name,
            content: jsonP,
            plain_content: plainContent,
        })
        .eq('id', id)

    if (error) {
        console.error(error)
        return encodedRedirect(
            'error',
            `/protected/script/edit/${id}`,
            `編集に失敗しました。`
        )
    }

    return encodedRedirect(
        'success',
        `/protected/script/edit/${id}`,
        '編集しました。'
    )
}

export const editScriptName = async (
    name: string,
    id: number
): Promise<Message> => {
    const supabase = await createClient()

    const { error } = await supabase
        .from('script')
        .update({
            title: name,
        })
        .eq('id', id)

    if (error) {
        console.error(error)
        return {
            messageType: 'error',
            message: 'タイトル編集に失敗しました。',
        }
    }

    return {
        messageType: 'success',
        message: 'タイトル編集に成功しました。',
    }
}
