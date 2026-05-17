import * as React from 'react'

import { cn } from '@/lib/utils'

const ProfilePhoto = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            className={cn(
                'aspect-square relative cursor-pointer w-pcvw-[50] group',
                className
            )}
            ref={ref}
            {...props}
        >
            <div className="bg-[#F3F4F6]/0 rounded-full absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full h-full scale-125 group-hover:bg-[#F3F4F6]/80 transition-colors duration-button ease-button"></div>
            <div className="bg-background-primary flex items-center justify-center rounded-full w-full h-full text-text-onPrimary text-heading-h2-pc relative">
                {children}
            </div>
        </div>
    )
})

ProfilePhoto.displayName = 'ProfilePhoto'

export { ProfilePhoto }
