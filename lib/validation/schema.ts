import { z } from 'zod'
import {
    priceidValidation,
    emailValidation,
    passwordValidation,
    nameValidation,
    avatarValidation,
    // scriptValidation,
    contentValidation,
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

// script作成用のスキーマ
export const createScriptSchema = z.object({
    name: nameValidation,
    content: contentValidation,
})

// script編集用のスキーマ
export const editScriptSchema = z.object({
    name: nameValidation,
    content: contentValidation,
})

// スキーマから型を自動生成
export type signupFormValues = z.infer<typeof signupSchema>
export type loginFormValues = z.infer<typeof loginSchema>
export type profileFormValues = z.infer<typeof profileSchema>
export type createScriptFormValues = z.infer<typeof createScriptSchema>
export type editScriptFormValues = z.infer<typeof editScriptSchema>
