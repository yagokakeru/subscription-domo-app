import { createClient } from '@/utils/supabase/server'
import { encodedRedirect } from '@/utils/utils'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    // The `/auth/callback` route is required for the server-side auth flow implemented
    // by the SSR package. It exchanges an auth code for the user's session.
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin
    const redirectTo = requestUrl.searchParams.get('redirect_to')

    if (!code) {
        return encodedRedirect(
            'error',
            '/sign-in',
            '認証コードが見つかりませんでした。もう一度お試しください。'
        )
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        return encodedRedirect(
            'error',
            '/sign-in',
            'ログインに失敗しました。リンクの有効期限が切れている可能性があります。'
        )
    }

    if (redirectTo) {
        return NextResponse.redirect(`${origin}${redirectTo}`)
    }

    // URL to redirect to after sign up process completes
    return NextResponse.redirect(`${origin}/protected`)
}
