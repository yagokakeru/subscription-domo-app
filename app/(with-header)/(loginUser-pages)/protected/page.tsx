import { Protected } from '@/components/app/loginUser-pages/protected'
import { getAllScript } from '@/lib/actions/script/getScript'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'

export default async function ProtectedPage() {
    const script = await getAllScript()
    const userPlan = await getUserPlan()
    const isLimitReached =
        userPlan?.max_scripts != null &&
        userPlan.script_count >= userPlan.max_scripts

    return (
        <>
            <Protected script={script} isLimitReached={isLimitReached} />
        </>
    )
}
