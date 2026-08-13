'use client'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-128-pc pb-16-pc">
            <p className="text-body-small-pc text-center">
                © {currentYear} しゃべる台本. All rights reserved.
            </p>
        </footer>
    )
}
