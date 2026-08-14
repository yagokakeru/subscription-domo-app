import type { Message } from '@/types/message'
import { redirect } from 'next/navigation'

export function encodedRedirect(
    type: Message['messageType'],
    path: string,
    message: Message['message']
) {
    return redirect(
        `${path}?messageType=${type}&message=${encodeURIComponent(message)}`
    )
}
