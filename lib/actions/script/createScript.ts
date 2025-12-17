'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { scriptFormValues } from '@/lib/validation/schema'
import type { userProfile } from '@/types/userProfile'

export const postScript = async (
    formData: scriptFormValues,
    userID: userProfile['user_id']
) => {
    const supabase = await createClient()
    const { script } = formData

    const { error } = await supabase.from('sript').insert({
        user_id: userID,
        title: '無題の台本',
        script: script,
        favorite: false,
    })

    if (error) {
        console.error(error)
        return encodedRedirect(
            'error',
            '/protected/post',
            `投稿に失敗しました。`
        )
    }

    return encodedRedirect('success', '/protected/post', '投稿しました。')
}
