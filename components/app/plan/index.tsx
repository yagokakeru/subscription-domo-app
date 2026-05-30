'use client'

import type { planInfo } from '@/types/planInfo'
import type { userProfile } from '@/types/userProfile'
import type { Result } from '@/types/result'
import type { userPlan } from '@/types/userPlan'
import PlanCard from '@/components/ui/card/plan'

export function PlanComponent({
    planInfo,
    userInfo,
    userPlan,
}: {
    planInfo: Result<planInfo[]>
    userInfo: userProfile | null
    userPlan: userPlan | null
}) {
    return (
        <>
            <section className="pt-pcvw-[216]">
                <div className="w-pcvw-[1280] mx-auto">
                    <h1 className="text-heading-h1-pc mb-48-pc">プラン</h1>
                    <div className="flex items-end justify-center gap-x-48-pc">
                        {planInfo.ok ? (
                            planInfo.data.map(
                                (item: planInfo, index: number) => {
                                    return (
                                        <PlanCard
                                            key={index}
                                            planInfo={item}
                                            userInfo={userInfo}
                                            userPlan={userPlan}
                                            className="w-pcvw-[300]"
                                        />
                                    )
                                }
                            )
                        ) : (
                            <div className="text-body-default-pc">
                                プラン情報が取得できませんでした
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
