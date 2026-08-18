import { useProfileFrom } from '@/lib/validation/hooks'
import { useAtomValue, useSetAtom } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { Label } from '@/components/ui/label'
import ProfilePhoto from '@/components/ui/profile-photo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/submit-button'
import { profileFormValues } from '@/lib/validation/schema'
import type { Message } from '@/types/message'
import { uploadImage } from '@/lib/actions/auth/uploadImage'
import { deleteImage } from '@/lib/actions/auth/deleteImage'

export const MypageProfile = (props: {
    setToastMessage: (message: Message) => void
}) => {
    const { setToastMessage } = props
    const userProfile = useAtomValue(userProfileAtom)
    const setUserProfile = useSetAtom(userProfileAtom)
    const { form, onSubmit } = useProfileFrom()

    const handleSubmit = async (data: profileFormValues) => {
        const result = await onSubmit(data)

        setToastMessage(result)

        if (result.messageType === 'success') {
            setUserProfile((current) =>
                current
                    ? {
                          ...current,
                          name: data.name,
                      }
                    : current
            )
        }
    }

    const handleUploadImage = async (file: File) => {
        const result = await uploadImage(file, userProfile?.user_id || '')

        setToastMessage(result)

        if (result.messageType === 'success' && result.avatarUrl) {
            const avatarUrl = result.avatarUrl
            setUserProfile((current) =>
                current
                    ? {
                          ...current,
                          avatar_url: avatarUrl,
                      }
                    : current
            )
        }
    }

    const handleDeleteImage = async () => {
        const result = await deleteImage(userProfile?.user_id || '')

        setToastMessage(result)

        if (result.messageType === 'success') {
            setUserProfile((current) =>
                current
                    ? {
                          ...current,
                          avatar_url: '',
                      }
                    : current
            )
        }
    }

    return (
        <div>
            <h2 className="text-heading-h2-pc">プロフィール</h2>

            <Label className="block mt-48-pc">
                <ProfilePhoto />
                <Input
                    type="file"
                    {...form.register('avatar')}
                    accept="image/png, image/jpeg"
                    className="hidden cursor-pointer"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                            handleUploadImage(file)
                        }
                    }}
                />
                {userProfile?.avatar_url && (
                    <Button
                        variant="secondary"
                        className="mt-16-pc"
                        type="button"
                        onClick={() => {
                            handleDeleteImage()
                        }}
                    >
                        アバター画像を削除
                    </Button>
                )}
            </Label>
            {form.formState.errors.avatar &&
                typeof form.formState.errors.avatar.message === 'string' && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.avatar.message}
                    </p>
                )}
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="mt-32-pc max-w-pcvw-[452]">
                    <div>
                        <Label htmlFor="name">名前</Label>
                        <Input
                            {...form.register('name')}
                            placeholder="山田 太郎"
                        />
                    </div>
                    {form.formState.errors.name && (
                        <p className="text-status-error text-body-small-pc mt-4-pc">
                            {form.formState.errors.name.message}
                        </p>
                    )}
                    <div className="mt-24-pc">
                        <Label>メールアドレス</Label>
                        <div className="text-body-default-pc mt-8-pc">
                            {userProfile?.email}
                        </div>
                    </div>
                </div>

                <SubmitButton pendingText="保存中..." className="mt-40-pc">
                    保存
                </SubmitButton>
            </form>
        </div>
    )
}
