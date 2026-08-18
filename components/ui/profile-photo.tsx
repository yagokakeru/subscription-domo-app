import { Avatar } from 'radix-ui'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { useState, useEffect } from 'react'
import { createAvatarUrl } from '@/lib/actions/auth/createAvatarUrl'

const ProfilePhoto = ({ className }: { className?: string }) => {
    const [signedAvatar, setSignedAvatar] = useState<{
        path?: string
        url?: string
    }>({})
    const userProfile = useAtomValue(userProfileAtom)
    const initial = userProfile
        ? userProfile.email.charAt(0).toUpperCase()
        : '台'

    useEffect(() => {
        // アバターURLを取得
        const avatarPath = userProfile?.avatar_url
        if (!avatarPath) return

        let cancelled = false
        const fetchAvatarUrl = async () => {
            try {
                const signedUrl = await createAvatarUrl(avatarPath)
                if (!cancelled)
                    setSignedAvatar({ path: avatarPath, url: signedUrl })
            } catch (err) {
                console.error(err)
            }
        }

        fetchAvatarUrl()
        return () => {
            cancelled = true
        }
    }, [userProfile?.avatar_url])

    // avatar_url が変わった瞬間（削除も含む）に古い署名URLを無効化し、即座に反映する
    const avatarUrl =
        signedAvatar.path === userProfile?.avatar_url
            ? signedAvatar.url
            : undefined

    return (
        <Avatar.Root
            className={`aspect-square block relative cursor-pointer w-pcvw-[50] group ${className || ''}`}
        >
            <div className="bg-[#F3F4F6]/0 rounded-full absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full h-full scale-125 group-hover:bg-[#F3F4F6]/80 transition-colors duration-button ease-button"></div>
            <Avatar.Image
                className="bg-background-primary flex items-center justify-center rounded-full object-cover w-full h-full text-text-onPrimary text-heading-h2-pc relative"
                src={avatarUrl}
                alt="アバター画像"
            />
            <Avatar.Fallback
                className="bg-background-primary flex items-center justify-center rounded-full w-full h-full text-text-onPrimary text-heading-h2-pc relative"
                delayMs={600}
            >
                {initial}
            </Avatar.Fallback>
        </Avatar.Root>
    )
}

export default ProfilePhoto
