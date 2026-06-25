import { Protected } from '@/components/app/loginUser-pages/protected'
import { getAllScript } from '@/lib/actions/script/getScript'

export default async function ProtectedPage() {
    const script = await getAllScript()

    return (
        <>
            <Protected script={script} />
        </>
    )
}
