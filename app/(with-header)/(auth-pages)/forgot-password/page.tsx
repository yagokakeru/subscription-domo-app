import { Message } from '@/components/form-message'
import ForgotPasswordForm from '@/components/app/auth-pages/forgot-password'

export default async function ForgotPassword(props: {
    searchParams: Promise<Message>
}) {
    const searchParams = await props.searchParams

    return <ForgotPasswordForm message={searchParams} />
}
