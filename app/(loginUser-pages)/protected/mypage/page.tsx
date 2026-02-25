import { Message } from '@/components/form-message'
import { MypageComponent } from '@/components/app/loginUser-pages/mypage'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'

export default async function Mypage(props: {
    searchParams: Promise<Message>
}) {
    const searchParams = await props.searchParams
    const userPlan = await getUserPlan()

    return <MypageComponent message={searchParams} userPlan={userPlan} />
}
