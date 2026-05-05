import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 条件付きの className をまとめ、Tailwind CSS の競合するクラスを解決します。
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
