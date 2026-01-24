'use client'

import { useAtomValue } from 'jotai'
import { deleteAccountAction } from '@/app/actions'
import {
    insertFavorite,
    deleteFavorite,
    isFavorited,
} from '@/lib/actions/script/favorite'
import { deleteScript } from '@/lib/actions/script/deleteScript'
import { FormMessage, Message } from '@/components/form-message'
import { Input } from '@/components/ui/input'
import { InfoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { userProfileAtom } from '@/lib/atoms/authUser'

import { SubmitButton } from '@/components/submit-button'

import type { script } from '@/types/script'

export function Protected({
    message,
    script,
}: {
    message: Message
    script: script
}) {
    const userProfile = useAtomValue(userProfileAtom)
    type ScriptItem = NonNullable<script['data']>[number]
    const [scriptMap, setScriptMap] = useState<Array<{
        data: ScriptItem
        isFavorite: boolean
    }> | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!script.data) return

        const fetchFavorites = async () => {
            const results = await Promise.all(
                script.data!.map(async (s) => {
                    const isFav = await isFavorited(s.id)
                    return { data: s, isFavorite: isFav }
                })
            )

            setScriptMap(results)
        }

        fetchFavorites()
    }, [script.data])

    if (!userProfile) return <div>Loading...</div>

    return (
        <div className="flex-1 w-full flex flex-col gap-12">
            <div className="w-full">
                <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                    <InfoIcon size="16" strokeWidth={2} />
                    This is a protected page that you can only see as an
                    authenticated user
                </div>
                <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                    <InfoIcon size="16" strokeWidth={2} />
                    表示機能
                    <br />
                    ・タイトル、台本
                    <br />
                    ・自動スクロール、速度調整、時間で流す
                </div>
                <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                    <InfoIcon size="16" strokeWidth={2} />
                    行間調整機能
                </div>
                <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                    <InfoIcon size="16" strokeWidth={2} />
                    決済機能見直し
                </div>
            </div>
            <div className="flex gap-2">
                <div>
                    <form>
                        <Input
                            type="hidden"
                            name="user_id"
                            value={userProfile.user_id}
                        />
                        <SubmitButton
                            formAction={deleteAccountAction}
                            pendingText="Deleting account..."
                        >
                            Delete Account
                        </SubmitButton>
                    </form>
                    <FormMessage message={message} />
                </div>
                <Button asChild size="sm" variant={'destructive'}>
                    <Link href="/pricing">Pleace Subscribe!!</Link>
                </Button>
            </div>
            <div className="flex flex-col gap-2 items-start">
                <h2 className="font-bold text-2xl mb-4">
                    Your User Profile Infomation
                </h2>
                <pre className="text-xs font-mono p-3 rounded border overflow-auto break-all whitespace-pre-wrap">
                    {JSON.stringify(userProfile, null, 2)}
                </pre>
            </div>

            <div className="flex gap-2">
                {scriptMap ? (
                    scriptMap.map((item) => {
                        const { data, isFavorite } = item
                        return (
                            <div key={data['id']} className="w-28">
                                <Link
                                    href={`/protected/script/edit/${data.id}`}
                                >
                                    <div className="border-2 border-solid border-gray-400 rounded flex items-center justify-center w-full h-40"></div>
                                    <p>{data.title}</p>
                                </Link>
                                <svg
                                    className="cursor-pointer w-1/4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 19"
                                    onClick={() => {
                                        if (isFavorite) {
                                            deleteFavorite(
                                                data.id,
                                                userProfile.user_id
                                            )
                                        } else {
                                            insertFavorite(
                                                data.id,
                                                userProfile.user_id
                                            )
                                        }

                                        // お気に入りステータス更新
                                        setScriptMap((prev) =>
                                            prev!.map((item) =>
                                                item.data.id === data.id
                                                    ? {
                                                          ...item,
                                                          isFavorite:
                                                              !item.isFavorite,
                                                      }
                                                    : item
                                            )
                                        )
                                    }}
                                >
                                    <path
                                        className={
                                            isFavorite
                                                ? 'fill-yellow-500'
                                                : 'fill-black'
                                        }
                                        d="M6.85,14.83l3.15-1.9,3.15,1.93-.83-3.6,2.78-2.4-3.65-.33-1.45-3.4-1.45,3.38-3.65.33,2.78,2.43-.83,3.58ZM3.83,19l1.63-7.03L0,7.25l7.2-.63L10,0l2.8,6.63,7.2.63-5.45,4.73,1.63,7.03-6.18-3.73-6.18,3.73Z"
                                    />
                                    <polygon
                                        className={
                                            isFavorite
                                                ? 'fill-yellow-500'
                                                : 'fill-transparent'
                                        }
                                        points="10 4.97 8.5 8.45 4.74 8.79 7.6 11.29 6.75 14.98 10 13.02 13.25 15 12.4 11.29 15.26 8.81 11.5 8.48 10 4.97"
                                    />
                                </svg>
                                <Image
                                    className="cursor-pointer w-1/4"
                                    src={'/delete.svg'}
                                    width={100}
                                    height={100}
                                    alt="削除"
                                    onClick={async () => {
                                        await deleteScript(data.id)
                                        router.refresh()
                                    }}
                                />
                            </div>
                        )
                    })
                ) : (
                    <p className="w-full">{script.error}</p>
                )}

                <div>
                    <a
                        className="border-2 border-solid border-gray-400 rounded flex items-center justify-center w-28 h-40"
                        href="/protected/script/post"
                    >
                        +
                    </a>
                    <p>追加</p>
                </div>
            </div>
        </div>
    )
}
