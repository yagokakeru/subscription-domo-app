/**
 * My pageの更新API
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { id, name } = await req.json()

    const { data, error } = await supabase
        .from('profile')
        .update({ name })
        .eq('supabase_uuid', id)
        .select()

    return NextResponse.json({ data, error }, { status: 200 })
}
