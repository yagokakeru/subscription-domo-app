'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'

const InputPasswordVariants = cva(
    `rounded-md-pc bg-background-surface text-input-text-pc w-full border-pcvw-[1] px-16-pc py-12-pc pr-48-pc
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

export interface InputPasswordProps
    extends
        React.ComponentPropsWithoutRef<typeof PasswordToggleField.Input>,
        VariantProps<typeof InputPasswordVariants> {}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
    ({ className, variant, ...props }, ref) => {
        return (
            <PasswordToggleField.Root>
                <div className="relative">
                    <PasswordToggleField.Input
                        ref={ref}
                        className={cn(
                            InputPasswordVariants({ variant, className })
                        )}
                        {...props}
                    />
                    <PasswordToggleField.Toggle className="absolute right-16-pc top-[40%]">
                        <PasswordToggleField.Icon
                            className="block w-pcvw-[16] h-auto"
                            visible={<EyeOpenIcon />}
                            hidden={<EyeClosedIcon />}
                        />
                    </PasswordToggleField.Toggle>
                </div>
            </PasswordToggleField.Root>
        )
    }
)
InputPassword.displayName = 'InputPassword'

export { InputPassword }
