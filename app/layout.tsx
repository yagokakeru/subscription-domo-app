import Header from '@/components/header'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { AuthProvider } from '@/lib/providers/AuthProvider'
import { getUserInfo } from '@/lib/functions/profile/getUserInfo'
import Footer from '@/components/footer'

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'Next.js and Supabase Starter Kit',
    description: 'The fastest way to build apps with Next.js and Supabase',
}

const geistSans = Geist({
    display: 'swap',
    subsets: ['latin'],
})

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const userProfile = await getUserInfo()

    return (
        <html
            lang="ja"
            className={geistSans.className}
            suppressHydrationWarning
        >
            <body>
                <AuthProvider userProfile={userProfile}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <main className="min-h-screen">
                            <Header />
                            {children}
                            <Footer />
                        </main>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
