import Header from '@/components/header'
import Footer from '@/components/footer'

export default function WithHeaderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen">
            <Header />
            {children}
            <Footer />
        </main>
    )
}
