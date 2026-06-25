import { Toast } from 'radix-ui'
import { CircleX as Cancel } from 'lucide-react'
import type { Message } from '@/types/message'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { MESSAGE_ICONS } from '@/lib/consts/massageIcon'

const toastVariants = cva(
    'bg-background-surface border text-text-primary p-16-pc rounded-md-pc flex items-start p-12-pc w-full shadow-pcvw-[4] shadow-shadow',
    {
        variants: {
            variant: {
                success: 'border-border-success text-text-success',
                error: 'border-border-error text-text-error',
                warning: 'border-border-warning text-text-warning',
                message: 'border-border-strong text-text-secondary',
            },
        },
        defaultVariants: {
            variant: 'message',
        },
    }
)

interface ToastMessageProps extends VariantProps<typeof toastVariants> {
    message: Message
}

export default function ToastMessage({ message }: ToastMessageProps) {
    const Icon = MESSAGE_ICONS[message.messageType]

    if (!message?.message || !message.messageType) return null

    return (
        <Toast.Provider swipeDirection="right">
            <Toast.Root
                className={cn(toastVariants({ variant: message.messageType }))}
                defaultOpen
            >
                <Icon
                    className="aspect-square w-pcvw-[24] shrink-0 block mr-8-pc h-auto"
                    strokeWidth={2}
                />

                <Toast.Description className="text-body-small-pc w-full">
                    {message.message}
                </Toast.Description>
                <Toast.Close>
                    <Cancel
                        className="aspect-square w-pcvw-[16] shrink-0 block ml-16-pc h-auto"
                        strokeWidth={2}
                    />
                </Toast.Close>
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-32-pc right-pcvw-[80] z-[9999] min-w-[300px] max-w-[100vw]" />
        </Toast.Provider>
    )
}
