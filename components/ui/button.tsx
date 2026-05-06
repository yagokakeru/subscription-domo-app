import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    `inline-flex items-center justify-center rounded-lg-pc font-base text-body-strong-pc
    disabled:pointer-events-none disabled:bg-background-disabled disabled:content-disabled`,
    {
        variants: {
            variant: {
                default: `bg-background-primary text-text-onPrimary
                    hover:bg-background-primary-hover
                    active:bg-background-primary-active`,
                // destructive:
                //     'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                // outline:
                //     'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                secondary: `bg-background-surface border-border border-solid border
                    hover:bg-background-surface-hover
                    active:bg-background-surface-active`,
                ghost: `hover:bg-background-surface-hover
                        active:bg-background-surface-active`,
                // link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'px-32-pc py-12-pc',
                sm: 'text-body-small-pc px-24-pc py-8-pc',
                lg: 'px-48-pc py-16-pc',
                // icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
