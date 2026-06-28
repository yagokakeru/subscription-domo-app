'use client'

import { useAtom, useAtomValue } from 'jotai'
import { isFavorited } from '@/lib/actions/script/favorite'
import { createScript } from '@/lib/actions/script/createScript'
import type { Message } from '@/types/message'
import { InfoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ToastMessage from '@/components/ui/message/toast'
import { useState, useEffect } from 'react'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { scriptFavoriteAtom } from '@/lib/atoms/scriptFavorite'
import ScriptCard from '@/components/ui/card/script'
import SortButton from '@/components/ui/sort_buttom'
import { Plus } from 'lucide-react'
import type { script } from '@/types/script'
import type { SortCategory, SortOrder } from '@/types/sort'

export function Protected({ script }: { script: script }) {
    const userProfile = useAtomValue(userProfileAtom)
    const [scriptFavorite, setScriptFavorite] = useAtom(scriptFavoriteAtom)
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    const [sortCategory, setSortCategory] = useState<SortCategory>('作成日')
    const [sortOrder, setSortOrder] = useState<SortOrder>('降順')
    const sortedScripts = [...(scriptFavorite ?? [])].sort((a, b) => {
        if (sortCategory === 'お気に入りを優先') {
            return Number(b.isFavorite) - Number(a.isFavorite)
        }

        const aDate =
            sortCategory === '作成日'
                ? new Date(a.data.inserted_at).getTime()
                : new Date(a.data.updated_at).getTime()

        const bDate =
            sortCategory === '作成日'
                ? new Date(b.data.inserted_at).getTime()
                : new Date(b.data.updated_at).getTime()

        return sortOrder === '昇順' ? aDate - bDate : bDate - aDate
    })

    useEffect(() => {
        if (!script.data) return

        const fetchFavorites = async () => {
            const results = await Promise.all(
                script.data!.map(async (s) => {
                    const isFav = await isFavorited(s.id)
                    return { data: s, isFavorite: isFav }
                })
            )

            setScriptFavorite(results)
        }

        fetchFavorites()
    }, [script.data, setScriptFavorite])

    if (!script.success) {
        return <p className="text-center">{script.error}</p>
    }

    if (!userProfile) return <div>Loading...</div>

    return (
        <section className="pt-pcvw-[150]">
            <div className="w-pcvw-[1280] mx-auto">
                <div className="w-full">
                    <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                        <InfoIcon size="16" strokeWidth={2} />
                        台本一覧作成
                        <br />
                        台本カードプロンプター表示ボタン
                    </div>
                    <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                        <InfoIcon size="16" strokeWidth={2} />
                        始まるまでのタイマー表示
                    </div>
                    <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                        <InfoIcon size="16" strokeWidth={2} />
                        決済機能見直し
                        <br />
                        ーサブスク購読・解約時のメッセージ
                    </div>
                </div>

                <h1 className="text-heading-h1-pc">
                    {sortedScripts.length > 0
                        ? '台本一覧'
                        : '台本を作成してみましょう！'}
                </h1>

                <div className="flex items-center gap-x-16-pc mt-24-pc">
                    <Button
                        size="default"
                        variant={'default'}
                        onClick={() => {
                            createScript(userProfile.user_id)
                        }}
                    >
                        新規作成
                    </Button>
                    {sortedScripts.length > 0 && (
                        <SortButton
                            sortCategory={sortCategory}
                            sortOrder={sortOrder}
                            onChangeCategory={setSortCategory}
                            onChangeOrder={setSortOrder}
                        />
                    )}
                </div>

                <div className="flex flex-wrap gap-y-40-pc gap-x-24-pc mt-48-pc">
                    {sortedScripts.length > 0 ? (
                        sortedScripts.map((item) => {
                            return (
                                <ScriptCard
                                    key={item.data['id']}
                                    scriptInfo={item}
                                    className="w-pcvw-[302]"
                                    setToastMessage={setToastMessage}
                                />
                            )
                        })
                    ) : (
                        <div
                            className="aspect-[302/322] cursor-pointer rounded-lg-pc border-border border-dashed border-[2px] p-24-pc flex items-center justify-center flex-col gap-y-12-pc w-pcvw-[302]"
                            onClick={() => {
                                createScript(userProfile.user_id)
                            }}
                        >
                            <Plus size="48" strokeWidth={2} />
                            <p className="text-heading-h3-pc text-center">
                                新規作成
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {toastMessage && (
                <ToastMessage
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </section>
    )
}
