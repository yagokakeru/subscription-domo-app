import { cn } from '@/lib/utils'
import { planInfo } from '@/types/planInfo'
import { userPlan } from '@/types/userPlan'
import { userProfile } from '@/types/userProfile'
import { Button } from '@/components/ui/button'
import { CircleCheck, CircleX } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { useSetAtom } from 'jotai'
import { priceIdAtom } from '@/lib/atoms/handOver'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
    UpgradeSubscription,
    ReactivateSubscription,
} from '@/lib/actions/stripe/subscription'
import { checkout } from '@/lib/actions/stripe/checkout'
import ToastMessage from '@/components/ui/message/toast'
import { Unsubscription } from '@/lib/actions/stripe/unsubscription'
import ConfirmDialog from '@/components/ui/comfirm/dialog'
import PurchaseConfirmDialog from '@/components/ui/comfirm/purchase-dialog'
import type { Message } from '@/types/message'

const planCardVariants = cva(
    'bg-background-surface rounded-xl-pc p-24-pc max-md:rounded-xl-sp max-md:p-24-sp',
    {
        variants: {
            recommended: {
                false: '',
                true: 'border-border-focus border-solid border-pcvw-[4] border-t-0 rounded-t-none max-md:border-spvw-[4] max-md:border-t-0 max-md:rounded-t-none',
            },
            defaultVariants: {
                variant: 'false',
            },
        },
    }
)

export interface PlanCardProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof planCardVariants> {
    planInfo: planInfo
    userInfo?: userProfile | null
    userPlan?: userPlan | null
}
export default function PlanCard({
    planInfo,
    userInfo = null,
    userPlan = null,
    className,
}: PlanCardProps) {
    const setPriceId = useSetAtom(priceIdAtom)
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    const [loading, setLoading] = useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [regularDialogOpen, setRegularDialogOpen] = useState(false)
    const [changeDialogOpen, setChangeDialogOpen] = useState(false)
    const [paidDialogOpen, setPaidDialogOpen] = useState(false)
    const { push, refresh } = useRouter()

    const handleCheckout = async (priceId: string) => {
        if (loading) return

        setLoading(true)

        const result = await checkout(priceId)

        if (result) {
            console.error(result.message)
            setLoading(false)
            setToastMessage(result)
        }
        // 成功時は redirect() されるのでここには来ない
    }

    const handleUpgradeSubscription = async (priceId: string) => {
        if (loading) return

        setLoading(true)

        const result = await UpgradeSubscription(priceId)

        setToastMessage(result)

        if (result.messageType === 'error') {
            console.error(result.message)
        } else {
            refresh() // ヘッダー・プランページ両方が再フェッチされる
        }

        setLoading(false)
    }

    const handleDowngrade = async () => {
        if (loading) return
        setLoading(true)

        const message = await Unsubscription()
        setToastMessage(message)

        if (message.messageType !== 'error') {
            setConfirmDialogOpen(false)
            refresh()
        } else {
            console.error(message.message)
        }
        setLoading(false)
    }

    const handleReactivate = async () => {
        if (loading) return
        setLoading(true)

        const message = await ReactivateSubscription()
        setToastMessage(message)

        if (message.messageType !== 'error') {
            refresh()
        } else {
            console.error(message.message)
        }

        setLoading(false)
    }

    return (
        <div>
            {planInfo.isRecommended && (
                <div className="bg-background-primary text-body-strong-pc text-text-onPrimary text-center rounded-t-xl-pc px-16-pc py-8-pc max-md:text-body-strong-sp max-md:rounded-t-xl-sp max-md:px-24-sp max-md:py-8-sp">
                    もっとも選ばれています！
                </div>
            )}
            <div
                className={cn(
                    planCardVariants({
                        recommended: planInfo.isRecommended,
                        className,
                    })
                )}
            >
                <h3 className="text-heading-h2-pc text-center max-md:text-heading-h2-sp">
                    {planInfo.name}
                </h3>
                <p className="text-body-small-pc mt-12-pc text-center max-md:text-body-small-sp max-md:mt-12-sp">
                    {planInfo.description}
                </p>
                <p className="text-heading-h1-pc mt-40-pc text-center max-md:text-heading-h1-sp max-md:mt-40-sp">
                    ¥{planInfo.amount}
                    <span className="text-heading-h2-pc max-md:text-heading-h2-sp">
                        /{planInfo.interval}
                    </span>
                </p>

                {!planInfo.priceId ? ( // freeプランの場合
                    !userInfo ? (
                        <Button
                            className="mt-40-pc w-full max-md:mt-40-sp"
                            onClick={() => push('/sign-up')}
                        >
                            無料で始める
                        </Button>
                    ) : !userPlan?.stripe_subscription_id ? (
                        <Button
                            className="mt-40-pc w-full max-md:mt-40-sp"
                            disabled
                        >
                            現在のプラン
                        </Button>
                    ) : userPlan.cancel_at_period_end ? (
                        <Button
                            className="mt-40-pc w-full max-md:mt-40-sp"
                            disabled
                        >
                            ダウングレード予定
                        </Button>
                    ) : (
                        <Button
                            className="mt-40-pc w-full max-md:mt-40-sp"
                            onClick={() => setConfirmDialogOpen(true)}
                            disabled={loading}
                        >
                            ダウングレード
                        </Button>
                    )
                ) : userInfo && userPlan ? ( // サブスクアップグレード
                    userPlan.price_id === planInfo.priceId ? (
                        // 現在のプラン
                        userPlan.cancel_at_period_end ? (
                            <Button
                                className="mt-40-pc w-full max-md:mt-40-sp"
                                onClick={handleReactivate}
                                disabled={loading}
                            >
                                {loading ? '解除しています…' : '解約を解除する'}
                            </Button>
                        ) : (
                            <Button
                                className="mt-40-pc w-full max-md:mt-40-sp"
                                disabled
                            >
                                現在のプラン
                            </Button>
                        )
                    ) : (
                        // 他の有料プラン
                        <Button
                            className="mt-40-pc w-full max-md:mt-40-sp"
                            onClick={() => {
                                if (!userPlan.stripe_subscription_id)
                                    return setChangeDialogOpen(true)
                                setPaidDialogOpen(true)
                            }}
                            disabled={loading}
                        >
                            {loading
                                ? '処理しています…'
                                : 'このプランに変更する'}
                        </Button>
                    )
                ) : (
                    <Button
                        className="mt-40-pc w-full max-md:mt-40-sp"
                        onClick={() => {
                            setRegularDialogOpen(true)
                        }}
                    >
                        {loading ? '今すぐ始める' : '今すぐ始める'}
                    </Button>
                )}

                {planInfo.planFeatures.length > 0 && (
                    <div className="flex flex-col gap-y-8-pc mt-40-pc max-md:gap-y-8-sp max-md:mt-40-sp">
                        {planInfo.planFeatures.map((feature, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-x-4-pc max-md:gap-x-4-sp"
                                >
                                    {feature.enabled ? (
                                        <CircleCheck className="square block fill-text-success stroke-text-onPrimary w-pcvw-[20] h-auto max-md:w-spvw-[20]" />
                                    ) : (
                                        <CircleX className="square block fill-text-error stroke-text-onPrimary w-pcvw-[20] h-auto max-md:w-spvw-[20]" />
                                    )}
                                    <p className="text-body-default-pc max-md:text-body-default-sp">
                                        {feature.text}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                onConfirm={handleDowngrade}
                title="フリープランにダウングレードしますか？"
                description={`${userPlan?.current_period_end}までは現在のプランを利用できます。\nそれ以降はフリープランになり、上限を超えた台本はロックされます（編集・プロンプター表示は不可、削除は可能）。\n再度アップグレードすると、ロックされた台本も利用できるようになります。`}
                confirmText="ダウングレード"
            />
            <PurchaseConfirmDialog
                open={regularDialogOpen}
                onOpenChange={setRegularDialogOpen}
                onConfirm={async () => {
                    setPriceId(planInfo.priceId || '')
                    push('/sign-up')
                }}
                title={`${planInfo.name}プラン`}
                amount={planInfo.amount}
                interval={planInfo.interval}
                confirmText="新規登録へ進む"
            />
            <PurchaseConfirmDialog
                open={changeDialogOpen}
                onOpenChange={setChangeDialogOpen}
                onConfirm={async () => {
                    const priceId = planInfo.priceId || ''
                    handleCheckout(priceId)
                }}
                title={`${planInfo.name}プランに変更しますか？`}
                amount={planInfo.amount}
                interval={planInfo.interval}
                confirmText="申し込む"
            />
            <PurchaseConfirmDialog
                open={paidDialogOpen}
                onOpenChange={setPaidDialogOpen}
                onConfirm={async () => {
                    const priceId = planInfo.priceId || ''
                    await handleUpgradeSubscription(priceId)
                    setPaidDialogOpen(false)
                }}
                title={`${planInfo.name}プランに変更しますか？`}
                amount={planInfo.amount}
                interval={planInfo.interval}
                confirmText="変更する"
                note={
                    <ul className="list-disc pl-24-pc mt-16-pc max-md:pl-24-sp max-md:mt-16-sp">
                        <li>プランの変更はすぐに反映されます。</li>
                        <li>
                            現在のプランとの差額は日割りで計算します。上位プランへの変更では変更時に請求し、
                            下位プランへの変更では次回以降の請求から差し引きます。
                        </li>
                        <li>
                            次回の更新日（{userPlan?.current_period_end}
                            ）以降は、
                            {planInfo.interval}額{' '}
                            {planInfo.amount.toLocaleString('ja-JP')}
                            円で請求されます。
                        </li>
                        {userPlan?.cancel_at_period_end && (
                            <li>
                                現在の解約予定は取り消され、プランは継続されます。
                            </li>
                        )}
                    </ul>
                }
            />

            {toastMessage && (
                <ToastMessage
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </div>
    )
}
