import { PostComponent } from '@/components/app/loginUser-pages/post'
import { Message } from '@/components/form-message'

export default async function Postpage(props: {
    searchParams: Promise<Message>
}) {
    const searchParams = await props.searchParams
    return <PostComponent message={searchParams} />
}
