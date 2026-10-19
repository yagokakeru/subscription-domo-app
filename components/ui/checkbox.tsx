import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const checkboxVariants = cva(
    `peer appearance-none size-full cursor-pointer bg-background-surface
    rounded-sm-pc max-md:rounded-sm-sp
    border-pcvw-[1] max-md:border-spvw-[1]
    checked:bg-background-primary checked:border-background-primary
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
    disabled:cursor-not-allowed disabled:bg-background-disabled disabled:border-border-disabled`,
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

export interface CheckboxProps
    extends
        React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof checkboxVariants> {}

const Checkbox = ({ className, variant, ...props }: CheckboxProps) => {
    return (
        <span className="relative inline-flex shrink-0 aspect-square w-pcvw-[24] max-md:w-spvw-[24]">
            <input
                type="checkbox"
                className={cn(checkboxVariants({ variant }), className)}
                {...props}
            />
            {/* チェックされたときだけ表示するチェックマーク */}
            <Check
                aria-hidden
                strokeWidth={3}
                className="pointer-events-none absolute inset-0 m-auto size-[75%] text-text-onPrimary hidden peer-checked:block"
            />
        </span>
    )
}

export { Checkbox }
