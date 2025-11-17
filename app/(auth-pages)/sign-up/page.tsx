import { Message } from "@/components/form-message";
import { SignUpForm } from "@/components/app/auth-pages/sign-up";


export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return <SignUpForm message={searchParams} />;
}
