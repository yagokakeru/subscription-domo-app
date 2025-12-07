'use client'

import { signOutAction } from '@/app/actions'
import { ThemeSwitcher } from '@/components/theme-switcher'
import Link from 'next/link'
import { Button } from './ui/button'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'

export default function Header() {
    const userProfile = useAtomValue(userProfileAtom)

    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex items-center gap-3">
                    <div className="font-semibold">
                        <Link href={'/'}>プロンプターApp</Link>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {userProfile ? (
                        <div className="flex items-center gap-4">
                            Hey, {userProfile.email}!
                            <Button asChild size="sm" variant={'outline'}>
                                <Link href="/protected/mypage/">My Page</Link>
                            </Button>
                            <form action={signOutAction}>
                                <Button type="submit" variant={'outline'}>
                                    Sign out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button asChild size="sm" variant={'destructive'}>
                                <Link href="/pricing">Pricing</Link>
                            </Button>
                            <Button asChild size="sm" variant={'outline'}>
                                <Link href="/sign-in">Sign in</Link>
                            </Button>
                            <Button asChild size="sm" variant={'default'}>
                                <Link href="/sign-up">Sign up</Link>
                            </Button>
                        </div>
                    )}
                    <ThemeSwitcher />
                </div>
            </div>
        </nav>
    )
}
