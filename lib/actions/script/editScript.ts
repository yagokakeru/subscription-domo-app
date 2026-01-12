'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { editScriptFormValues } from '@/lib/validation/schema'

export const editScript = async (
    formData: editScriptFormValues,
    jsonS: string,
    id: number
) => {
    const supabase = await createClient()
    const name = formData.name || 'defaultName'
    // jsonが文字列で渡されるのでパースする
    const jsonP = JSON.parse(jsonS)

    const { error } = await supabase
        .from('script')
        .update({
            title: name,
            content: jsonP,
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
