import Header from '@/components/header'
import Footer from '@/components/footer'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'

export default async function WithHeaderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const userPlan = await getUserPlan()

    return (
        <main className="min-h-screen flex flex-col">
            <Header userPlan={userPlan} />
            <div className="flex-1">{children}</div>
            <Footer />
        </main>
    )
}
