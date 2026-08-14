import { z } from 'zod'
import {
    priceidValidation,
    emailValidation,
    passwordValidation,
    passwordConfirmdValidation,
    nameValidation,
    avatarValidation,
    contentValidation,
    plainContentValidation,
} from '@/lib/validation/validation'
import { MESSAGES } from '@/lib/consts/messages'

// サインアップ用スキーマ
export const signupSchema = z.object({
    priceid: priceidValidation,
    email: emailValidation,
    password: passwordValidation,
})

// ログイン用スキーマ
export const loginSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
})

// パスワード忘れ用スキーマ
export const forgotPasswordSchema = z.object({
    email: emailValidation,
})

// パスワードリセット用スキーマ
export const passwordResetSchema = z
    .object({
        newPassword: passwordValidation,
        newPasswordConfirm: passwordConfirmdValidation,
    })
    .refine((data) => data.newPassword === data.newPasswordConfirm, {
        error: MESSAGES.PASSWORD_CONFIRM_MISMATCH,
        path: ['newPasswordConfirm'],
    })

// プロフィール用スキーマ
export const profileSchema = z.object({
    avatar: avatarValidation,
    name: nameValidation,
})

// script編集用のスキーマ
export const editScriptSchema = z.object({
    name: nameValidation,
    content: contentValidation,
    plainContent: plainContentValidation,
})

// スキーマから型を自動生成
export type signupFormValues = z.infer<typeof signupSchema>
export type loginFormValues = z.infer<typeof loginSchema>
export type forgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type passwordResetFormValues = z.infer<typeof passwordResetSchema>
export type profileFormValues = z.infer<typeof profileSchema>
export type editScriptFormValues = z.infer<typeof editScriptSchema>
