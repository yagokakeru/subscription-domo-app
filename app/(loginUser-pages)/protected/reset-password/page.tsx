import ResetPasswordForm from '@/components/app/loginUser-pages/reset-password'
import { Message } from '@/components/form-message'

export default async function ResetPassword(props: {
    searchParams: Promise<Message>
}) {
    const searchParams = await props.searchParams
    return <ResetPasswordForm message={searchParams} />
}
