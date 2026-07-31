export default function WithoutHeaderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <main className="min-h-screen">{children}</main>
}
