'use client'

import { Button } from './ui/button'
import Link from 'next/link'

export default function Home() {
    return (
        <>
            <p className="text-3xl font-bold leading-loose text-center">
                プロンプターアプリを使って
                <br />
                カメラから目を離さず話そう👀
            </p>
            <div>
                <Button asChild>
                    <Link href="/sign-up">無料で始める</Link>
                </Button>
            </div>
            <div>
                <Button asChild size="lg">
                    <Link href="/sign-up">無料で始める</Link>
                </Button>
            </div>
            <div>
                <Button asChild variant="secondary" size="sm">
                    <Link href="/sign-up">無料で始める</Link>
                </Button>
            </div>
            <div>
                <Button asChild variant="ghost">
                    <Link href="/sign-up">無料で始める</Link>
                </Button>
            </div>
        </>
    )
}
