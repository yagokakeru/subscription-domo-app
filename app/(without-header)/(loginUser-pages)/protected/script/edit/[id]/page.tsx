import { EditComponent } from '@/components/app/loginUser-pages/script/edit'
import { getEditScript } from '@/lib/actions/script/getScript'

export default async function Editpage(props: {
    params: Promise<{ id: string }>
}) {
    const { id } = await props.params
    const script = await getEditScript(id)

    return <EditComponent script={script} />
}
