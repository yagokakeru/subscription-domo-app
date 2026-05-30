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
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { UpgradeSubscription } from '@/lib/actions/stripe/subscription'
import { checkout } from '@/lib/actions/stripe/checkout'

const planCardVariants = cva('bg-background-surface rounded-xl-pc p-24-pc', {
    variants: {
        recommended: {
            false: '',
            true: 'border-border-focus border-solid border-pcvw-[4] border-t-0 rounded-t-none',
        },
        defaultVariants: {
            variant: 'false',
        },
    },
})

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
    const [loading, setLoading] = useState(false)
    const { push } = useRouter()
    const searchParams = useSearchParams()
    const planname = searchParams.get('planname')

    const handleCheckout = async (priceId: string) => {
        if (loading) return

        setLoading(true)

        const result = await checkout(
            priceId,
            userInfo?.stripe_uuid || '',
            userInfo?.user_id || ''
        )

        if (result && !result.ok) {
            console.error(result.message)
            setLoading(false)
        }
        // 成功時は redirect() されるのでここには来ない
    }

    return (
        <div>
            {planInfo.isRecommended && (
                <div className="bg-background-primary text-body-strong-pc text-text-onPrimary text-center rounded-t-xl-pc px-16-pc py-8-pc">
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
                <h3 className="text-heading-h2-pc text-center">
                    {planInfo.name}
                </h3>
                <p className="text-body-small-pc mt-12-pc text-center">
                    {planInfo.description}
                </p>
                <p className="text-heading-h1-pc mt-40-pc text-center">
                    ¥{planInfo.amount}
                    <span className="text-heading-h2-pc">
                        /{planInfo.interval}
                    </span>
                </p>

                {!planInfo.priceId ? ( // freeプランの場合
                    <Button
                        className="mt-40-pc w-full"
                        onClick={() => {
                            push('/sign-up')
                        }}
                        disabled={planname == planInfo.name ? true : loading}
                    >
                        {loading ? '無料で始める' : '無料で始める'}
                    </Button>
                ) : userInfo && planname && userPlan ? ( // サブスクアップグレード
                    <Button
                        className="mt-40-pc w-full"
                        onClick={() => {
                            userPlan.stripe_subscription_id
                                ? UpgradeSubscription(
                                      userPlan.stripe_subscription_id,
                                      planInfo.priceId || ('' as string)
                                  )
                                : handleCheckout(planInfo.priceId || '')
                        }}
                        disabled={planname == planInfo.name ? true : loading}
                    >
                        {loading ? 'アップグレードする' : 'アップグレードする'}
                    </Button>
                ) : userInfo ? ( // ログイン済み、サブスク未加入
                    <Button
                        className="mt-40-pc w-full"
                        type="submit"
                        onClick={() => handleCheckout(planInfo.priceId || '')}
                        disabled={loading}
                    >
                        {loading ? '今すぐ始める' : '今すぐ始める'}
                    </Button>
                ) : (
                    <Button
                        className="mt-40-pc w-full"
                        onClick={() => {
                            setPriceId(planInfo.priceId || '')
                            push('/sign-up')
                        }}
                    >
                        {loading ? '今すぐ始める' : '今すぐ始める'}
                    </Button>
                )}

                {planInfo.planFeatures.length > 0 && (
                    <div className="flex flex-col gap-y-8-pc mt-40-pc">
                        {planInfo.planFeatures.map((feature, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-x-4-pc"
                                >
                                    {feature.enabled ? (
                                        <CircleCheck className="square block fill-text-success stroke-text-onPrimary w-pcvw-[20] h-auto" />
                                    ) : (
                                        <CircleX className="square block fill-text-error stroke-text-onPrimary w-pcvw-[20] h-auto" />
                                    )}
                                    <p className="text-body-default-pc">
                                        {feature.text}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
