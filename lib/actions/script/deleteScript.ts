'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * 台本を削除
 * @param id
 */
export const deleteScript = async (id: number) => {
    const supabase = await createClient()

    const { error } = await supabase.from('script').delete().eq('id', id)

    if (error) {
        console.error(error)
    }
}
