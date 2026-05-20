import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
    `rounded-md-pc bg-background-surface text-input-text-pc w-full border-pcvw-[1] px-16-pc py-12-pc
    placeholder:text-text-secondary
    focus-visible:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
    disabled:cursor-not-allowed disabled:bg-background-disabled disabled:border-border-disabled disabled:placeholder:text-text-disabled`,
    {
        variants: {
            variant: {
                default: `border-border-strong`,
                error: `border-border-error ring-2 ring-border-error`,
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface InputProps
    extends
        React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(inputVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'

export { Input }
