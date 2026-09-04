import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { PlanBadge } from '@/components/ui/plan-badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReactivateSubscription } from '@/lib/actions/stripe/subscription'
import { userPlan } from '@/types/userPlan'
import { Unsubscription } from '@/lib/actions/stripe/unsubscription'
import { useState } from 'react'
import ConfirmDialog from '@/components/ui/comfirm/dialog'
import { Message } from '@/types/message'

export const MypagePlan = ({
    userPlan,
    setToastMessage,
}: {
    userPlan: userPlan
    setToastMessage: (message: Message) => void
}) => {
    const userProfile = useAtomValue(userProfileAtom)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    const handleUnsubscription = async () => {
        const message = await Unsubscription(userProfile!.user_id)
        setToastMessage(message)
    }

    const handleReactivateSubscription = async () => {
        const message = await ReactivateSubscription(userProfile!.user_id)
        setToastMessage(message)
    }

    return (
        <div>
            <h2 className="text-heading-h2-pc">プラン</h2>
            <div className="flex items-center gap-4-pc text-body-default-pc mt-40-pc">
                <div>現在のプラン：</div>
                <PlanBadge>{userPlan?.name ?? 'フリー'}</PlanBadge>
            </div>
            {userPlan?.cancel_at_period_end ? (
                <>
                    <div className="flex items-center gap-4-pc text-body-default-pc mt-16-pc">
                        <div>解約予定日：</div>
                        <div>{userPlan?.current_period_end}</div>
                    </div>
                    <div onClick={handleReactivateSubscription}>
                        解約を解除する
                    </div>
                    <Button
                        asChild
                        variant={'secondary'}
                        className="mt-8-pc w-pcvw-[180]"
                        onClick={handleReactivateSubscription}
                    >
                        <div>解約を解除する</div>
                    </Button>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-4-pc text-body-default-pc mt-16-pc">
                        <div>次回の支払い：</div>
                        <div>{userPlan?.current_period_end}</div>
                    </div>
                </>
            )}
            <div className="text-body-default-pc mt-16-pc">
                現在の台本数：
                <span className="text-heading-h3-pc">
                    {userPlan?.script_count} / {userPlan?.max_scripts}
                </span>{' '}
                作成済み
            </div>

            <Button asChild className="mt-40-pc w-pcvw-[180]">
                <Link href={'/plan?planname=' + userPlan?.name}>
                    プランを変更する
                </Link>
            </Button>
            <Button
                asChild
                variant={'secondary'}
                className="mt-16-pc w-pcvw-[180] cursor-pointer"
                onClick={() => setConfirmDialogOpen(true)}
            >
                <div>プランを解約する</div>
            </Button>

            <ConfirmDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                onConfirm={handleUnsubscription}
                title="プランを解約しますか？"
                description="この操作は元に戻せません"
                confirmText="解約"
            />
        </div>
    )
}
