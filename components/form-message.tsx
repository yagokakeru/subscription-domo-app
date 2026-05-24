import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import {
    TriangleAlert,
    ShieldAlert,
    CircleCheck,
    CircleX as Cancel,
    Info,
} from 'lucide-react'
import { useRef } from 'react'
import gsap from 'gsap'

/**
 * Message type
 * @description The type of message to display
 * @property {string} message - The message to display
 * @property {string} messageType - The type of message to display
 */
export type Message = {
    messageType: 'success' | 'error' | 'warning' | 'message'
    message: string
}

/**
 * Root variants
 * @description The variants for the root element
 */
const rootVariants = cva(
    'rounded-md-pc flex items-start gap-16-pc border-l-8 px-16-pc py-12-pc w-full',
    {
        variants: {
            variant: {
                success:
                    'bg-background-successSubtle border-border-success text-text-success',
                error: 'bg-background-errorSubtle border-border-error text-text-error',
                warning:
                    'bg-background-warningSubtle border-border-warning text-text-warning',
                message:
                    'bg-background-disabled border-border-strong text-text-secondary',
            },
        },
        defaultVariants: {
            variant: 'message',
        },
    }
)

/**
 * Form message props
 * @description The props for the form message component
 * @property {Message} message - The message to display
 * @property {string} className - The class name of the form message component
 */
interface FormMessageProps extends VariantProps<typeof rootVariants> {
    message: Message
    className?: string
}

/**
 * Form message component
 * @description The form message component
 * @param {FormMessageProps} props - The props for the form message component
 * @returns {React.ReactNode} The form message component
 */
export function FormMessage({ message, className }: FormMessageProps) {
    const rootRef = useRef<HTMLDivElement>(null)

    const handleCancel = () => {
        gsap.to(rootRef.current, {
            duration: 0.3,
            autoAlpha: 0,
            ease: 'power4.inOut',
            onComplete: () => {
                rootRef.current?.remove()
            },
        })
    }

    if (!message) {
        return null
    }

    return (
        <div
            className={cn(
                rootVariants({ variant: message.messageType, className })
            )}
            ref={rootRef}
        >
            <>
                {(message.messageType === 'success' && (
                    <CircleCheck
                        className="aspect-square w-pcvw-[24] shrink-0 block h-auto"
                        strokeWidth={3}
                    />
                )) ||
                    (message.messageType === 'error' && (
                        <TriangleAlert
                            className="aspect-square w-pcvw-[24] shrink-0 block h-auto"
                            strokeWidth={3}
                        />
                    )) ||
                    (message.messageType === 'warning' && (
                        <ShieldAlert
                            className="aspect-square w-pcvw-[24] shrink-0 block h-auto"
                            strokeWidth={3}
                        />
                    )) ||
                    (message.messageType === 'message' && (
                        <Info
                            className="aspect-square w-pcvw-[24] shrink-0 block h-auto"
                            strokeWidth={3}
                        />
                    ))}
                <div className="text-body-small-pc">{message.message}</div>
                <Cancel
                    className="aspect-square cursor-pointer shrink-0 ml-auto w-pcvw-[16] block h-auto"
                    strokeWidth={2}
                    onClick={handleCancel}
                />
            </>
        </div>
    )
}
