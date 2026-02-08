import { PlanComponent } from '@/components/app/plan'
import { getPlan } from '@/lib/functions/plan/getPlan'
import { getUserInfo } from '@/lib/functions/profile/getUserInfo'

export default async function Pricing() {
    const planInfo = await getPlan()
    const userInfo = await getUserInfo()

    return <PlanComponent planInfo={planInfo} userInfo={userInfo} />
}
