import { CircleCheck, TriangleAlert, ShieldAlert, Info } from 'lucide-react'
import type { Message } from '@/types/message'

export const MESSAGE_ICONS: Record<Message['messageType'], typeof Info> = {
    success: CircleCheck,
    error: TriangleAlert,
    warning: ShieldAlert,
    message: Info,
} as const
