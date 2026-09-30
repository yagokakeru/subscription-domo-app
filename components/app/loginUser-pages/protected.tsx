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
import Link from 'next/link'
import type { script } from '@/types/script'
import type { SortCategory, SortOrder } from '@/types/sort'

export function Protected({
    script,
    isLimitReached,
}: {
    script: script
    isLimitReached: boolean
}) {
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

    const handleCreateScript = async () => {
        const result = await createScript(userProfile.user_id)
        setToastMessage(result)
    }

    return (
        <section className="pt-pcvw-[150]">
            <div className="w-pcvw-[1280] mx-auto">
                <div className="w-full">
                    <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                        <InfoIcon size="16" strokeWidth={2} />
                        フォームとかをテストする
                        <br />
                        lib/actions/auth/updateProfile.ts(updateProfile)
                        lib/actions/auth/uploadImage.ts / deleteImage.ts /
                        createAvatarUrl.ts
                        <br />
                        lib/actions/script/editScript.ts(editScript /
                        editScriptName) の② 結合テスト層 実施
                    </div>
                    <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                        <InfoIcon size="16" strokeWidth={2} />
                        決済機能見直し
                        <br />
                        【テスト】
                        <br />
                        ーA6
                        deleteAccountActionのテストを新仕様に合わせる（引数なし・getUserInfoモック・StripeモックにerrorsのStripeErrorを追加）
                        <br />
                        ーC4
                        subscription.test.ts／unsubscription.test.tsを新仕様に合わせる（引数なし・getUserPlanモック、UpgradeSubscriptionはprice_idのみ）
                        <br />
                        ーC4
                        stripe_subscription_idがnullの時にエラーを返すテストを追加（Upgrade／Unsubscription／Reactivate）
                        <br />
                        【その他】
                        <br />
                        ーCN-04の期待結果を「subscriptionの行がフリープランに更新される」に修正する（チェックリストExcel）
                        <br />
                        ー型エラー修正：profile-card.tsx:101
                        formのactionにMessageを返す関数を渡している
                        <br />
                        ー型エラー修正：sort_buttom.tsx:62,82
                        stringをSortCategory／SortOrderに渡している
                        <br />
                        ー型エラー修正：webhook/route.ts:18 POST(req:
                        NextResponse) → NextRequestにする
                    </div>
                    <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                        <InfoIcon size="16" strokeWidth={2} />
                        actions.tsをリファクタリング
                    </div>
                    <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                        <InfoIcon size="16" strokeWidth={2} />
                        スマホデザインをClaude Designで生成
                    </div>
                </div>

                <h1 className="text-heading-h1-pc">
                    {sortedScripts.length > 0
                        ? '台本一覧'
                        : '台本を作成してみましょう！'}
                </h1>

                <div className="flex items-center gap-x-16-pc mt-24-pc">
                    {isLimitReached ? (
                        <Button size="default" variant={'default'} asChild>
                            <Link href="/plan">プランをアップグレード</Link>
                        </Button>
                    ) : (
                        <Button
                            size="default"
                            variant={'default'}
                            onClick={() => {
                                handleCreateScript()
                            }}
                        >
                            新規作成
                        </Button>
                    )}
                    {sortedScripts.length > 0 && (
                        <SortButton
                            sortCategory={sortCategory}
                            sortOrder={sortOrder}
                            onChangeCategory={setSortCategory}
                            onChangeOrder={setSortOrder}
                        />
                    )}
                </div>
                {isLimitReached && (
                    <div className="text-text-secondary text-sm mt-4">
                        台本の作成上限に達しています。プランをアップグレードしてください。
                    </div>
                )}

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
                                handleCreateScript()
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
