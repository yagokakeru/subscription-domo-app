'use client'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-128-pc pb-16-pc max-md:mt-48-sp max-md:pb-16-sp">
            <p className="text-body-small-pc text-center max-md:text-body-small-sp">
                © {currentYear} しゃべる台本. All rights reserved.
            </p>
        </footer>
    )
}
