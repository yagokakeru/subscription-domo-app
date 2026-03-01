'use client'

import type { planInfo } from '@/types/planInfo'
import type { userProfile } from '@/types/userProfile'
import type { Result } from '@/types/result'
import { Button } from '@/components/ui/button'
import { FormMessage } from '@/components/form-message'
import { useState } from 'react'
import { checkout } from '@/lib/actions/stripe/checkout'
import { useSetAtom } from 'jotai'
import { priceIdAtom } from '@/lib/atoms/handOver'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { UpgradeSubscription } from '@/lib/actions/stripe/subscription'
import type { userPlan } from '@/types/userPlan'

export function PlanComponent({
    planInfo,
    userInfo,
    userPlan,
}: {
    planInfo: Result<planInfo[]>
    userInfo: userProfile
    userPlan: userPlan | null
}) {
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
            userInfo?.stripe_uuid,
            userInfo.user_id
        )

        if (result && !result.ok) {
            console.error(result.message)
            setLoading(false)
        }
        // 成功時は redirect() されるのでここには来ない
    }

    return (
        <>
            <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
                {planInfo.ok ? (
                    planInfo.data.map((item: planInfo, index: number) => {
                        const priceId = item.priceId

                        return (
                            <div key={index}>
                                <h2 className="text-2xl font-medium text-gray-900 mb-2">
                                    {item.name}
                                </h2>
                                <p className="text-4xl font-medium text-gray-900 mb-6">
                                    ¥{item.amount}
                                    <span className="text-xl font-normal text-gray-600">
                                        per user / {item.interval}
                                    </span>
                                </p>
                                {!priceId ? (
                                    <Button
                                        id="checkout-and-portal-button"
                                        onClick={() => {
                                            push('/sign-up')
                                        }}
                                        disabled={
                                            planname == item.name
                                                ? true
                                                : loading
                                        }
                                    >
                                        {loading ? 'Moving…' : 'Signup'}
                                    </Button>
                                ) : userInfo && planname && userPlan ? ( // サブスクアップグレード
                                    <Button
                                        id="checkout-and-portal-button"
                                        onClick={() =>
                                            UpgradeSubscription(
                                                userPlan.stripe_subscription_id,
                                                priceId
                                            )
                                        }
                                        disabled={
                                            planname == item.name
                                                ? true
                                                : loading
                                        }
                                    >
                                        {loading ? 'Upgrading…' : 'Upgrade'}
                                    </Button>
                                ) : userInfo ? ( // ログイン、サブスク未加入
                                    <Button
                                        id="checkout-and-portal-button"
                                        type="submit"
                                        onClick={() => handleCheckout(priceId)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Redirecting…' : 'Checkout'}
                                    </Button>
                                ) : (
                                    // ログインしていなければ登録画面へ遷移させる
                                    <Button
                                        id="checkout-and-portal-button"
                                        onClick={() => {
                                            setPriceId(priceId)
                                            push('/sign-up')
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Redirecting…' : 'Checkout'}
                                    </Button>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <FormMessage message={planInfo} />
                )}
            </div>
        </>
    )
}
