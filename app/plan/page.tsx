import { PlanComponent } from '@/components/app/plan'
import { getPlan } from '@/lib/functions/plan/getPlan'
import { getUserInfo } from '@/lib/functions/profile/getUserInfo'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'

export default async function Pricing() {
    const planInfo = await getPlan()
    const userInfo = await getUserInfo()
    const userPlan = await getUserPlan()

    return (
        <PlanComponent
            planInfo={planInfo}
            userInfo={userInfo}
            userPlan={userPlan}
        />
    )
}
