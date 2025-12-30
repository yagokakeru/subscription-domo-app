'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { editScriptFormValues } from '@/lib/validation/schema'

export const editScript = async (formData: editScriptFormValues) => {
    const supabase = await createClient()
    const { id, script } = formData
    const name = formData.name || 'defaultName'

    const { error } = await supabase
        .from('script')
        .update({
            title: name,
            script: script,
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
