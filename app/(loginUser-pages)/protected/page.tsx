import { Message } from '@/components/form-message'
import { Protected } from '@/components/app/loginUser-pages/protected'
import { getAllScript } from '@/lib/actions/script/getScript'

export default async function ProtectedPage(props: {
    searchParams: Promise<Message>
}) {
    const searchParams = await props.searchParams
    const script = await getAllScript()

    return <Protected message={searchParams} script={script} />
}
