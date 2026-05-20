import { cn } from '@/lib/utils'

export type Message =
    | { success: string }
    | { error: string }
    | { message: string }

export function FormMessage({
    message,
    className,
}: {
    message: Message
    className?: string
}) {
    if (!message || Object.keys(message).length === 0) {
        return null
    }

    return (
        <div
            className={cn(
                'flex flex-col gap-2 w-full max-w-md text-sm',
                className
            )}
        >
            {'success' in message && (
                <div className="text-foreground border-l-2 border-foreground px-4">
                    {message.success}
                </div>
            )}
            {'error' in message && (
                <div className="text-foreground border-l-2 border-foreground px-4">
                    {message.error}
                </div>
            )}
            {'message' in message && (
                <div className="text-foreground border-l-2 px-4">
                    {message.message}
                </div>
            )}
        </div>
    )
}
