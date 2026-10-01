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
                        リリース準備
                        <br />
                        【R1 今すぐ】
                        <br />
                        ーR1-1
                        チェックリストExcel修正：CN-04のDB列を「フリープランに更新される」に、Stripe側列を「status=&apos;canceled&apos;」に戻す
                        <br />
                        ーR1-2
                        チェックリストExcel修正：CN-04の画面表示（userPlanはnullにならない）・手順（stripe
                        triggerは代替にならない）、RE-03の前提条件と★確認ポイント
                        <br />
                        ーR1-3 supabase db
                        pullで現在のスキーマ（RLS・CASCADE・user_with_profileビュー・planの初期データ）をmigration化してGit管理
                        <br />
                        ーR1-4
                        checkout()のcustomerID／userIDをセッションから取得し、price_idが有効なプランか検証する
                        <br />
                        ーR1-5 README：NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET →
                        STRIPE_WEBHOOK_SECRET に修正
                        <br />
                        ーR1-6
                        支払い失敗（past_due）時の扱いを決める（猶予として許容
                        or 制限してカード更新を促す）
                        <br />
                        【R2 スマホ表示】
                        <br />
                        ーR2-1 スマホデザインをClaude
                        Designで生成してコーディング
                        <br />
                        【R3 リリース直前】
                        <br />
                        ーR3-1 特定商取引法に基づく表記ページを作成
                        <br />
                        ーR3-2 利用規約・プライバシーポリシーページを作成
                        <br />
                        ーR3-3
                        最終確認画面の表示（料金・契約期間・自動更新・解約方法）をプランページ／Checkout前に追加
                        <br />
                        ーR3-4
                        Stripe本番：商品・価格を作成し、本番DBのplan.stripe_price_idに登録
                        <br />
                        ーR3-5
                        Stripe本番：Webhookエンドポイント登録（subscription.created/updated/deleted
                        ほか）とSTRIPE_WEBHOOK_SECRET設定
                        <br />
                        ーR3-6 Supabase本番：Site
                        URL／リダイレクトURLを本番ドメインに、カスタムSMTPを設定
                        <br />
                        ーR3-7
                        Vercel環境変数：NEXT_PUBLIC_APP_URL、Stripe／Supabaseの本番キー（SERVICE_ROLE_KEYにNEXT_PUBLIC_を付けない）
                        <br />
                        ーR3-8 next buildが通ることを確認
                        <br />
                        ーR3-9 本番相当環境で手動テストチェックリストを全件実施
                        <br />
                        ーR3-10 この画面のタスクメモ（InfoIcon）をGitHub
                        Issues等へ移して削除
                        <br />
                        【R4 余裕があれば】
                        <br />
                        ーR4-1 Webhookの絵文字入りconsole.logを整理
                        <br />
                        ーR4-2
                        エラー監視（Sentry等）を導入し、Webhook処理失敗に気づけるようにする
                        <br />
                        ーR4-3
                        ProfileCard：userPlanがnullの時は台本数を表示しない
                        <br />
                        ーR4-4 Lockアイコンにaria-labelを付ける
                    </div>
                    <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                        <InfoIcon size="16" strokeWidth={2} />
                        actions.tsをリファクタリング
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
