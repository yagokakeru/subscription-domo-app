'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { createScriptFormValues } from '@/lib/validation/schema'
import type { userProfile } from '@/types/userProfile'

export const postScript = async (
    formData: createScriptFormValues,
    jsonS: string,
    userID: userProfile['user_id']
) => {
    const supabase = await createClient()
    const name = formData.name || 'defaultName'
    // jsonが文字列で渡されるのでパースする
    const jsonP = JSON.parse(jsonS)

    const { error } = await supabase.from('script').insert({
        user_id: userID,
        title: name,
        content: jsonP,
    })

    if (error) {
        console.error(error)
        return encodedRedirect(
            'error',
            '/protected/post',
            `投稿に失敗しました。`
        )
    }

    return encodedRedirect(
        'success',
        '/protected/script/post',
        '投稿しました。'
    )
}
