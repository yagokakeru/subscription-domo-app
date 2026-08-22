import { describe, it, expect } from 'vitest'
import { passwordResetSchema } from '@/lib/validation/schema'
import { MESSAGES } from '@/lib/consts/messages'

describe('passwordResetSchema', () => {
    it('新しいパスワードと確認用パスワードが一致すれば成功する', () => {
        const result = passwordResetSchema.safeParse({
            newPassword: 'Password1',
            newPasswordConfirm: 'Password1',
        })
        expect(result.success).toBe(true)
    })

    it('新しいパスワードと確認用パスワードが一致しなければエラーになる', () => {
        const result = passwordResetSchema.safeParse({
            newPassword: 'Password1',
            newPasswordConfirm: 'Password2',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                MESSAGES.PASSWORD_CONFIRM_MISMATCH
            )
        }
    })

    it('エラーはnewPasswordConfirmに紐づく', () => {
        const result = passwordResetSchema.safeParse({
            newPassword: 'Password1',
            newPasswordConfirm: 'Password2',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(['newPasswordConfirm'])
        }
    })
})
