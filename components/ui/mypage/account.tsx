import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { deleteAccountAction, signOutAction } from '@/app/actions'

export const MypageAccount = () => {
    const userProfile = useAtomValue(userProfileAtom)

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
            <form className="mt-16-pc">
                <Input
                    type="hidden"
                    name="user_id"
                    value={userProfile!.user_id}
                />
                <SubmitButton
                    formAction={deleteAccountAction}
                    pendingText="Deleting account..."
                    variant={'secondary'}
                >
                    アカウント削除
                </SubmitButton>
            </form>
        </div>
    )
}
