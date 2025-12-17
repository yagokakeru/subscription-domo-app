import { z } from 'zod'
import {
    priceidValidation,
    emailValidation,
    passwordValidation,
    nameValidation,
    avatarValidation,
    scriptValidation,
} from './validation'

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

// プロフィール用スキーマ
export const profileSchema = z.object({
    avatar: avatarValidation,
    name: nameValidation,
})

// script用のスキーマ
export const scriptSchema = z.object({
    script: scriptValidation,
})

// スキーマから型を自動生成
export type signupFormValues = z.infer<typeof signupSchema>
export type loginFormValues = z.infer<typeof loginSchema>
export type profileFormValues = z.infer<typeof profileSchema>
export type scriptFormValues = z.infer<typeof scriptSchema>
