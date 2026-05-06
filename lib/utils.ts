import { clsx, type ClassValue } from 'clsx'
// import { twMerge } from 'tailwind-merge'

// 条件付きの className をまとめるクラスヘルパー
export function cn(...inputs: ClassValue[]) {
    // return twMerge(clsx(inputs))
    return clsx(inputs)
}
