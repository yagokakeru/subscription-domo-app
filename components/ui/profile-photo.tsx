import { Avatar } from 'radix-ui'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { useState, useEffect } from 'react'
import { createAvatarUrl } from '@/lib/actions/auth/createAvatarUrl'

const ProfilePhoto = ({ className }: { className?: string }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
    const userProfile = useAtomValue(userProfileAtom)
    const initial = userProfile
        ? userProfile.email.charAt(0).toUpperCase()
        : '台'

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
