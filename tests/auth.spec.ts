import { test, expect } from '@playwright/test'

// サインアップで作ったアカウントを、後続のログインテストでそのまま使う。
// signInテストがsignUpテストより先に実行されると失敗するため、
// describe.serial でこのファイル内の実行順を固定する。
test.describe.serial('サインアップ〜ログイン', () => {
    const email = `e2e-${Date.now()}@example.com`
    const password = 'E2ePassword1'

    test('サインアップすると/protectedへ到達する', async ({ page }) => {
        await page.goto('/sign-up')
        await page.getByLabel('メールアドレス').fill(email)
        await page.getByLabel('パスワード').fill(password)
        await page.getByRole('button', { name: '新規登録' }).click()

        await expect(page).toHaveURL('/protected')
    })

    test('ログアウト後、同じアカウントで再ログインできる', async ({ page }) => {
        await page.goto('/sign-in')
        await page.getByLabel('メールアドレス').fill(email)
        await page.getByLabel('パスワード').fill(password)
        await page.getByRole('button', { name: 'ログイン' }).click()

        await expect(page).toHaveURL('/protected')
    })
})
