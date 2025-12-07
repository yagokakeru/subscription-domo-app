import { Message } from "@/components/form-message";
import { MypageComponent } from "@/components/app/loginUser-pages/mypage";

export default async function Mypage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return <MypageComponent message={searchParams} />;
}
