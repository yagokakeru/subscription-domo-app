'use client'

import { ThemeSwitcher } from '@/components/theme-switcher'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { ProfilePhoto } from './ui/profile-photo'
import { ProfileCard } from './ui/profile-card'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
    const userProfile = useAtomValue(userProfileAtom)
    const [isProfileCardOpen, setIsProfileCardOpen] = useState(false)
    const profileMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isProfileCardOpen) return

        const handlePointerDown = (event: PointerEvent) => {
            if (!profileMenuRef.current?.contains(event.target as Node)) {
                setIsProfileCardOpen(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [isProfileCardOpen])

    return (
        <header
            className={
                'bg-background-surface rounded-xl-pc flex items-center py-16-pc px-48-pc fixed top-16-pc left-1/2 translate-x-[-50%] w-pcvw-[1280] max-h-pcvw-[72]'
            }
        >
            <nav className="flex justify-between items-center w-full">
                <div className="flex items-center gap-32-pc">
                    <h1>
                        <Link href={'/'}>
                            <Image
                                className="w-pcvw-[170]"
                                src={'/header_logo.svg'}
                                alt="logo"
                                width={100}
                                height={100}
                            ></Image>
                        </Link>
                    </h1>
                    <ul className="flex items-center gap-32-pc">
                        {userProfile && (
                            <li>
                                <Link
                                    className="text-body-default-pc"
                                    href={'/protected'}
                                >
                                    台本一覧
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link
                                className="text-body-default-pc"
                                href={'/plan'}
                            >
                                プラン
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center gap-8-pc">
                    {userProfile ? (
                        <div ref={profileMenuRef}>
                            <ProfilePhoto
                                role="button"
                                tabIndex={0}
                                aria-expanded={isProfileCardOpen}
                                onClick={() =>
                                    setIsProfileCardOpen((current) => !current)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === 'Enter' ||
                                        event.key === ' '
                                    ) {
                                        event.preventDefault()
                                        setIsProfileCardOpen(
                                            (current) => !current
                                        )
                                    }
                                }}
                            >
                                Y
                            </ProfilePhoto>
                            <ProfileCard
                                open={isProfileCardOpen}
                                onClose={() => setIsProfileCardOpen(false)}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-24-pc">
                            <Button asChild size="sm" variant={'secondary'}>
                                <Link href="/sign-in">ログイン</Link>
                            </Button>
                            <Button asChild size="sm" variant={'default'}>
                                <Link href="/sign-up">新規登録</Link>
                            </Button>
                        </div>
                    )}
                    <ThemeSwitcher />
                </div>
            </nav>
        </header>
    )
}
