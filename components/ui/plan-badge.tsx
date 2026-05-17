import * as React from 'react'
// import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const planBadgeVariants = cva(
    `inline-block rounded-full px-8-pc py-4-pc text-body-small-pc`,
    {
        variants: {
            variant: {
                default: `bg-background-surface-hover`,
                paid: `bg-background-primary text-text-onPrimary`,
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface PlanBadgeProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof planBadgeVariants> {
    children?: React.ReactNode
}

const PlanBadge = React.forwardRef<HTMLDivElement, PlanBadgeProps>(
    ({ className, variant, children = 'フリー', ...props }, ref) => {
        return (
            <div
                className={cn(planBadgeVariants({ variant, className }))}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        )
    }
)
PlanBadge.displayName = 'PlanBadge'

export { PlanBadge, planBadgeVariants }
