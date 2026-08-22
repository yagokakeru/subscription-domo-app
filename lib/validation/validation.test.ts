import { describe, it, expect } from 'vitest'
import {
    emailValidation,
    passwordValidation,
    nameValidation,
    avatarValidation,
} from '@/lib/validation/validation'
import { MESSAGES } from '@/lib/consts/messages'
import { LABELS } from '@/lib/consts/labels'

describe('emailValidation', () => {
    it('正しい形式のメールアドレスは成功する', () => {
        expect(emailValidation.safeParse('user@example.com').success).toBe(true)
    })

    it('@のない文字列はエラーになる', () => {
        const result = emailValidation.safeParse('invalid-email')
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(MESSAGES.INVALID_EMAIL)
        }
    })
})

describe('passwordValidation', () => {
    it('大文字・小文字・数字を含む8文字以上は成功する', () => {
        expect(passwordValidation.safeParse('Password1').success).toBe(true)
    })

    it('8文字未満はエラーになる', () => {
        expect(passwordValidation.safeParse('Aa1').success).toBe(false)
    })

    it('大文字を含まない場合はエラーになる', () => {
        expect(passwordValidation.safeParse('password1').success).toBe(false)
    })

    it('数字を含まない場合はエラーになる', () => {
        expect(passwordValidation.safeParse('Password').success).toBe(false)
    })
})

describe('nameValidation', () => {
    it('通常の名前は成功する', () => {
        expect(nameValidation.safeParse('山田 太郎').success).toBe(true)
    })

    it('256文字はエラーになる', () => {
        const result = nameValidation.safeParse('あ'.repeat(256))
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                MESSAGES.MAX_LENGTH(LABELS.NAME, 255)
            )
        }
    })

    it('255文字ちょうどは成功する', () => {
        expect(nameValidation.safeParse('あ'.repeat(255)).success).toBe(true)
    })
})

describe('avatarValidation', () => {
    const makeFileList = (files: { size: number; type: string }[]) =>
        Object.assign(files, { length: files.length })

    it('ファイルが未選択でも成功する', () => {
        expect(avatarValidation.safeParse(undefined).success).toBe(true)
        expect(avatarValidation.safeParse(makeFileList([])).success).toBe(true)
    })

    it('1MB以下のjpeg/pngは成功する', () => {
        const files = makeFileList([{ size: 500 * 1024, type: 'image/png' }])
        expect(avatarValidation.safeParse(files).success).toBe(true)
    })

    it('1MBを超えるファイルはエラーになる', () => {
        const files = makeFileList([
            { size: 2 * 1024 * 1024, type: 'image/png' },
        ])
        const result = avatarValidation.safeParse(files)
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                MESSAGES.FILE_SIZE_EXCEEDED(1)
            )
        }
    })

    it('jpeg/png以外の形式はエラーになる', () => {
        const files = makeFileList([{ size: 500 * 1024, type: 'image/gif' }])
        const result = avatarValidation.safeParse(files)
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                MESSAGES.FILE_TYPE_INVALID('JPEG, PNG')
            )
        }
    })

    it('2つ以上のファイルはエラーになる', () => {
        const files = makeFileList([
            { size: 500 * 1024, type: 'image/png' },
            { size: 500 * 1024, type: 'image/png' },
        ])
        expect(avatarValidation.safeParse(files).success).toBe(false)
    })
})
