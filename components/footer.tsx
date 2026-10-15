'use client'

import Link from 'next/link'
import { LEGAL_PATHS } from '@/lib/consts/legal'

const LEGAL_LINKS = [
    { href: LEGAL_PATHS.TERMS, label: '利用規約' },
    { href: LEGAL_PATHS.PRIVACY, label: 'プライバシーポリシー' },
    { href: LEGAL_PATHS.TOKUSHOHO, label: '特定商取引法に基づく表記' },
]

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-128-pc pb-16-pc max-md:mt-48-sp max-md:pb-16-sp">
            <nav className="flex flex-wrap justify-center gap-x-24-pc gap-y-8-pc mb-16-pc max-md:gap-x-16-sp max-md:gap-y-8-sp max-md:mb-16-sp">
                {LEGAL_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-body-small-pc text-text-secondary underline max-md:text-body-small-sp"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <p className="text-body-small-pc text-center max-md:text-body-small-sp">
                © {currentYear} しゃべる台本. All rights reserved.
            </p>
        </footer>
    )
}
