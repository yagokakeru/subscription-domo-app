import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
    `aspect-square flex items-center justify-center rounded-sm-pc w-pcvw-[24] h-auto
    transition-colors duration-button ease-button
    hover:bg-background-surface-hover
    active:bg-background-surface-active`,
    {
        variants: {
            active: {
                false: ``,
                true: `bg-background-surface-active`,
            },
        },
        defaultVariants: {
            active: false,
        },
    }
)

export interface IconButtonProps
    extends
        React.HTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof iconButtonVariants> {
    active?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, active, children, ...props }, ref) => {
        return (
            <button
                className={cn(iconButtonVariants({ active, className }))}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        )
    }
)
IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants }
