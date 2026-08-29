import { clsx, type ClassValue } from 'clsx'

// 条件付きの className をまとめるクラスヘルパー
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}
