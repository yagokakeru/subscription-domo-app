import { z } from 'zod'
import { LABELS } from '../consts/labels'
import { MESSAGES } from '../consts/messages'
import { JSONContent } from '@tiptap/react'

// priceidのバリデーション
export const priceidValidation = z.string().nullable().optional()

// supabace idのバリデーション
export const supabaceIdValidation = z.string().nullable().optional()

// メールアドレスのバリデーション
export const emailValidation = z.email(MESSAGES.INVALID_EMAIL)

// パスワードのバリデーション
export const passwordValidation = z
    .string()
    .min(8, MESSAGES.MIN_LENGTH(LABELS.PASSWORD, 8))

// 名前のバリデーション
export const nameValidation = z
    .string()
    .max(255, MESSAGES.MAX_LENGTH(LABELS.NAME, 255))

// アバター画像のバリデーション
export const avatarValidation = z
    .any()
    .refine(
        (file) => !file || file.length === 0 || file.length === 1,
        'ファイルは1つだけ選択してください'
    )
    .refine(
        (file) =>
            !file || file.length === 0 || file[0]?.size <= 1 * 1024 * 1024,
        '1MB以下の画像をアップロードしてください'
    )
    .refine(
        (file) =>
            !file ||
            file.length === 0 ||
            ['image/jpeg', 'image/png'].includes(file[0]?.type),
        'JPEGまたはPNGのみアップロードできます'
    )

// contentのバリデーション
export const contentValidation = z.custom<JSONContent>().refine(
    (value) => {
        if (!value || typeof value !== 'object') return false

        const hasText = (node: JSONContent): boolean => {
            if (
                node.type === 'text' &&
                node.text &&
                node.text.trim().length > 0
            ) {
                return true
            }

            if (Array.isArray(node.content)) {
                return node.content.some(hasText)
            }

            return false
        }

        return hasText(value)
    },
    {
        message: MESSAGES.MIN_LENGTH(LABELS.CONTENT, 1),
    }
)
