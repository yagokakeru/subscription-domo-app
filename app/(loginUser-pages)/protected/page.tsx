import { Message } from '@/components/form-message'
import { Protected } from '@/components/app/loginUser-pages/protected'

export default async function ProtectedPage(props: {
    searchParams: Promise<Message>
}) {
    const searchParams = await props.searchParams

    return <Protected message={searchParams} />
}
