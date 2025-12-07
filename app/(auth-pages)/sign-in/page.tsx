import { Message } from '@/components/form-message'
import { LoginForm } from '@/components/app/auth-pages/sign-in'

export default async function Login(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams

    return <LoginForm message={searchParams} />
}
