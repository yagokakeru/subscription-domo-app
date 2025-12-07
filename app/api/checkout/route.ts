/**
 * 決算ページのURLを返す
 *
 * priceIDから決算ページのURLを返す
 *
 * @param {string} priceID - price_ から始まるID
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCheckoutUrl } from '@/lib/getCheckoutUrl'

export async function POST(req: NextRequest) {
    // 商品IDを取得
    const { priceID, customerID } = await req.json()
    const sessionURL = await getCheckoutUrl(priceID, customerID)

    return NextResponse.json({ checkout_url: sessionURL }, { status: 200 })
}
