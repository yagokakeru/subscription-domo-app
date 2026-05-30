import { cn } from '@/lib/utils'
import { planInfo } from '@/types/planInfo'
import { Button } from '@/components/ui/button'
import { CircleCheck, CircleX } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { useSetAtom } from 'jotai'
import { priceIdAtom } from '@/lib/atoms/handOver'
import { useRouter } from 'next/navigation'

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
}
export default function PlanCard({ planInfo, className }: PlanCardProps) {
    const setPriceId = useSetAtom(priceIdAtom)
    const router = useRouter()

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
                <Button
                    className="mt-40-pc w-full"
                    onClick={() => {
                        setPriceId(planInfo.priceId || '')
                        router.push('/sign-up')
                    }}
                >
                    {planInfo.priceId ? '今すぐ始める' : '無料で始める'}
                </Button>
                {planInfo.planFeatures.length > 0 && (
                    <div className="flex flex-col gap-y-8-pc mt-40-pc">
                        {planInfo.planFeatures.map((feature, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-x-4-pc"
                                >
                                    {feature.enabled ? (
                                        <CircleCheck className="square fill-text-success stroke-text-onPrimary w-pcvw-[20]" />
                                    ) : (
                                        <CircleX className="square fill-text-error stroke-text-onPrimary w-pcvw-[20]" />
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
