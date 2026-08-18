import ProfilePhoto from '@/components/ui/profile-photo'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/submit-button'
import { signOutAction } from '@/app/actions'
import { PlanBadge } from '@/components/ui/plan-badge'
import Link from 'next/link'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import type { userPlan } from '@/types/userPlan'

const profilePhotoVariants = cva(
    `bg-background-surface rounded-xl-pc flex items-center flex-col gap-24-pc mt-16-pc p-24-pc shadow-pcvw-[16] shadow-shadow absolute top-full right-0
    transition-all duration-button ease-button`,
    {
        variants: {
            open: {
                true: 'opacity-100 translate-y-0 pointer-events-auto',
                false: 'opacity-0 -translate-y-4-pc pointer-events-none',
            },
        },
        defaultVariants: {
            open: false,
        },
    }
)

export interface ProfileCardProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof profilePhotoVariants> {
    open: boolean
    onClose?: () => void
    userPlan: userPlan
}

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
    ({ className, open, onClose, userPlan, ...props }, ref) => {
        const userProfile = useAtomValue(userProfileAtom)

        return (
            <div
                className={cn(profilePhotoVariants({ open, className }))}
                ref={ref}
                {...props}
            >
                <div className="flex items-center flex-col gap-4-pc">
                    <ProfilePhoto className="pointer-events-none" />
                    <div className="text-body-default-pc">
                        {userProfile?.name || userProfile?.email}
                    </div>
                    {userProfile?.name && (
                        <div className="text-body-notice-pc">
                            {userProfile?.email}
                        </div>
                    )}
                </div>
                <div className="flex items-center flex-col gap-8-pc">
                    <div className="flex items-center gap-4-pc">
                        <div className="text-body-small-pc">現在のプラン：</div>
                        <PlanBadge
                            variant={userPlan?.name ? 'paid' : 'default'}
                        >
                            {userPlan?.name ?? 'フリー'}
                        </PlanBadge>
                    </div>
                    <div className="text-body-notice-pc">
                        残り{' '}
                        <span className="text-body-strong-pc">
                            {userPlan?.script_count} / {userPlan?.max_scripts}
                        </span>{' '}
                        台本作成可能
                    </div>
                    <Button size={'sm'} asChild>
                        <Link href={'/plan'} onClick={onClose}>
                            アップグレード
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center w-full justify-between w-pcvw-[230]">
                    <Button
                        variant={'secondary'}
                        size={'sm'}
                        className="w-pcvw-[110]"
                        asChild
                    >
                        <Link href={'/protected/mypage'} onClick={onClose}>
                            マイページ
                        </Link>
                    </Button>
                    <form onSubmit={onClose}>
                        <SubmitButton
                            className="w-pcvw-[110]"
                            pendingText="ログアウト中..."
                            variant={'ghost'}
                            size={'sm'}
                            formAction={signOutAction}
                        >
                            ログアウト
                        </SubmitButton>
                    </form>
                </div>
            </div>
        )
    }
)

ProfileCard.displayName = 'ProfileCard'

export { ProfileCard }
