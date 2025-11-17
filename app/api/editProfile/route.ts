/**
 * My pageの更新
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    let count;
    for(let i = 0; i < 10000; i++){
        count = i;
    }
  return NextResponse.json({ message: 'GET：Hello from Next.js!', count: count }, {status: 200})
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { id, name } = await req.json();

    const { data, error } = await supabase
        .from('profile')
        .update({ name: name })
        .eq('id', id)
        .select()

    return NextResponse.json({ data, error }, {status: 200})
}