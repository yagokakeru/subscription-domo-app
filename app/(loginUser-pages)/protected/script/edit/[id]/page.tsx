import { EditComponent } from '@/components/app/loginUser-pages/script/edit'
import { Message } from '@/components/form-message'
import { getEditScript } from '@/lib/actions/script/getScript'

export default async function Editpage(props: {
    searchParams: Promise<Message>
    params: Promise<{ id: string }>
}) {
    const searchParams = await props.searchParams
    const { id } = await props.params
    const script = await getEditScript(id)

    return <EditComponent message={searchParams} script={script} />
}
