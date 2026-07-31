import { PrompterComponent } from '@/components/app/loginUser-pages/script/prompter'
import { getEditScript } from '@/lib/actions/script/getScript'

export default async function PrompterPage(props: {
    params: Promise<{ id: string }>
}) {
    const { id } = await props.params
    const script = await getEditScript(id)

    return <PrompterComponent script={script} />
}
