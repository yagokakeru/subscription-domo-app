import { MypageComponent } from '@/components/app/loginUser-pages/mypage'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'

export default async function Mypage() {
    const userPlan = await getUserPlan()

    return <MypageComponent userPlan={userPlan} />
}
