import { useProfileFrom } from '@/lib/validation/hooks'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { Label } from '@/components/ui/label'
import { ProfilePhoto } from '@/components/ui/profile-photo'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createAvatarUrl } from '@/lib/actions/auth/createAvatarUrl'

export const MypageProfile = () => {
    const userProfile = useAtomValue(userProfileAtom)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const { form, onSubmit } = useProfileFrom()

    useEffect(() => {
        // アバターURLを取得
        if (!userProfile?.avatar_url) return

        const fetchAvatarUrl = async () => {
            try {
                const signedUrl = await createAvatarUrl(userProfile?.avatar_url)
                setAvatarUrl(signedUrl)
            } catch (err) {
                console.error(err)
            }
        }

        fetchAvatarUrl()
    }, [userProfile?.avatar_url])

    return (
        <div>
            <h2 className="text-heading-h2-pc">プロフィール</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-48-pc">
                <Label>
                    <ProfilePhoto>
                        <Image
                            src={avatarUrl || '/default-avatar.jpg'}
                            alt="Avatar"
                            width={100}
                            height={100}
                            className="rounded-full"
                            unoptimized
                        />
                    </ProfilePhoto>
                    <Input
                        type="file"
                        {...form.register('avatar')}
                        accept="image/png, image/jpeg"
                        className="hidden"
                    />
                </Label>
                {form.formState.errors.avatar &&
                    typeof form.formState.errors.avatar.message ===
                        'string' && (
                        <p className="text-red-500 text-sm">
                            {form.formState.errors.avatar.message}
                        </p>
                    )}

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
