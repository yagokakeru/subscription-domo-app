'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { editScriptFormValues } from '@/lib/validation/schema'
import { SCRIPT_DEFAULT } from '@/lib/consts/script/script'

export const editScript = async (
    formData: editScriptFormValues,
    jsonS: string,
    id: number
) => {
    const supabase = await createClient()
    const name = formData.name || SCRIPT_DEFAULT.NAME
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
