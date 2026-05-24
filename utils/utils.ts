import { Message } from '@/components/form-message'
import { redirect } from 'next/navigation'

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {Message['messageType']} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
    type: Message['messageType'],
    path: string,
    message: Message['message']
) {
    return redirect(
        `${path}?messageType=${type}&message=${encodeURIComponent(message)}`
    )
}
