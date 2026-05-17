import { ProfilePhoto } from './profile-photo'
import { Button } from './button'
import { SubmitButton } from '@/components/submit-button'
import { signOutAction } from '@/app/actions'
import { PlanBadge } from './plan-badge'
import Link from 'next/link'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

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
}

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
    ({ className, open, onClose, ...props }, ref) => {
        return (
            <div
                className={cn(profilePhotoVariants({ open, className }))}
                ref={ref}
                {...props}
            >
                <div className="flex items-center flex-col gap-4-pc">
                    <ProfilePhoto className="pointer-events-none">
                        Y
                    </ProfilePhoto>
                    <div className="text-body-default-pc">山田 太郎</div>
                    <div className="text-body-notice-pc">
                        yamada@exsample.com
                    </div>
                </div>
                <div className="flex items-center flex-col gap-8-pc">
                    <div className="flex items-center gap-4-pc">
                        <div className="text-body-small-pc">現在のプラン：</div>
                        <PlanBadge variant={'paid'}>プレミアム</PlanBadge>
                    </div>
                    <div className="text-body-notice-pc">
                        残り{' '}
                        <span className="text-body-strong-pc">12 / 50</span>{' '}
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
