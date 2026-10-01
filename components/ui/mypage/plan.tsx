import { PlanBadge } from '@/components/ui/plan-badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReactivateSubscription } from '@/lib/actions/stripe/subscription'
import { userPlan } from '@/types/userPlan'
import { Unsubscription } from '@/lib/actions/stripe/unsubscription'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ui/comfirm/dialog'
import { Message } from '@/types/message'

export const MypagePlan = ({
    userPlan,
    setToastMessage,
}: {
    userPlan: userPlan | null
    setToastMessage: (message: Message) => void
}) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const { refresh } = useRouter()

    if (!userPlan)
        return (
            <p className="text-body-default-pc">
                プラン情報を取得できませんでした。
            </p>
        )

    const handleUnsubscription = async () => {
        const message = await Unsubscription()

        setToastMessage(message)
        if (message.messageType !== 'error') {
            setConfirmDialogOpen(false)
            refresh()
        } else {
            console.error(message.message)
        }
    }

    const handleReactivateSubscription = async () => {
        const message = await ReactivateSubscription()
        setToastMessage(message)
        if (message.messageType !== 'error') {
            refresh()
        } else {
            console.error(message.message)
        }
    }

    return (
        <div>
            <h2 className="text-heading-h2-pc">プラン</h2>
            <div className="flex items-center gap-4-pc text-body-default-pc mt-40-pc">
                <div>現在のプラン：</div>
                <PlanBadge>{userPlan?.name}</PlanBadge>
            </div>
            {userPlan?.cancel_at_period_end ? (
                <>
                    <div className="flex items-center gap-4-pc text-body-default-pc mt-16-pc">
                        <div>解約予定日：</div>
                        <div>{userPlan?.current_period_end}</div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-4-pc text-body-default-pc mt-16-pc">
                        <div>次回の支払い：</div>
                        <div>
                            {userPlan?.current_period_end ?? '支払いなし'}
                        </div>
                    </div>
                </>
            )}
            <div className="text-body-default-pc mt-16-pc">
                現在の台本数：
                <span className="text-heading-h3-pc">
                    {userPlan?.script_count} /{' '}
                    {userPlan.max_scripts ? userPlan.max_scripts : '無制限'}
                </span>{' '}
                作成済み
            </div>

            <Button asChild className="mt-40-pc w-pcvw-[180]">
                <Link href={'/plan'}>プランを変更する</Link>
            </Button>
            {userPlan.stripe_subscription_id &&
                (userPlan.cancel_at_period_end ? (
                    <Button
                        variant={'secondary'}
                        className="mt-8-pc w-pcvw-[180]"
                        onClick={handleReactivateSubscription}
                    >
                        解約を解除する
                    </Button>
                ) : (
                    <Button
                        variant={'secondary'}
                        className="mt-16-pc w-pcvw-[180]"
                        onClick={() => setConfirmDialogOpen(true)}
                    >
                        プランを解約する
                    </Button>
                ))}

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
