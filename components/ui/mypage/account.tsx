import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/submit-button'
import ConfirmDialog from '@/components/ui/comfirm/dialog'
import { deleteAccountAction, signOutAction } from '@/app/actions'

export const MypageAccount = () => {
    const userProfile = useAtomValue(userProfileAtom)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        const formData = new FormData()
        formData.append('user_id', userProfile!.user_id)
        await deleteAccountAction(formData)
    }

    return (
        <div>
            <h2 className="text-heading-h2-pc">アカウント操作</h2>

            <form className="mt-40-pc">
                <SubmitButton
                    pendingText="Signing out..."
                    formAction={signOutAction}
                >
                    ログアウト
                </SubmitButton>
            </form>
            <Button
                type="button"
                variant={'secondary'}
                className="mt-16-pc"
                aria-disabled={isDeleting}
                onClick={() => setConfirmDialogOpen(true)}
            >
                {isDeleting ? 'Deleting account...' : 'アカウント削除'}
            </Button>
            <ConfirmDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                onConfirm={handleDeleteAccount}
                title="アカウントを削除しますか？"
                description="この操作は元に戻せません"
            />
        </div>
    )
}
