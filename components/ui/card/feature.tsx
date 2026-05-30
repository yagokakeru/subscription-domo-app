import { cn } from '@/lib/utils'
import Image from 'next/image'

type FeatureCardProps = {
    title: string
    description: string
    image: string
    className?: string
}

export default function FeatureCard({
    title,
    description,
    image,
    className,
}: FeatureCardProps) {
    return (
        <div
            className={cn(
                'bg-background-surface rounded-lg-pc px-32-pc pt-32-pc pb-40-pc',
                className
            )}
        >
            <h3 className="text-heading-h2-pc">{title}</h3>
            <p className="color-text-secondary text-body-default-pc mt-8-pc ">
                {description}
            </p>
            <Image
                src={image}
                alt="機能画像"
                width={554}
                height={311}
                className="block mt-16-pc rounded-lg-pc"
            />
        </div>
    )
}
