import Header from '@/components/header'
import Footer from '@/components/footer'

export default function WithHeaderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
        </main>
    )
}
