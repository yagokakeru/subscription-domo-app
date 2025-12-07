/**
 * ログインユーザー情報を取得
 */

import { NextResponse } from 'next/server'
import { getUserInfo } from '@/lib/getUserInfo'

export async function POST() {
    const userData = await getUserInfo()

    if (userData.data) {
        return NextResponse.json(
            { userInfo: userData.data[0], error: userData.error },
            { status: 200 }
        )
    } else {
        return NextResponse.json({ error: userData.error }, { status: 200 })
    }
}
