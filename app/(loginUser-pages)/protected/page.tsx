"use client"

import { useAtomValue } from "jotai";
import { deleteAccountAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use } from 'react'

import { userProfileAtom } from "@/lib/atoms/authUser";

import { SubmitButton } from "@/components/submit-button";

export default function ProtectedPage({
  searchParams,
}: {
  searchParams: Promise<Message>
}) {
  const messages = use(searchParams);
  const userProfile = useAtomValue(userProfileAtom);

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          アバター画像を更新できるようにする
          メールアドレスはとりあえず変更不可にする。Stripeとか色々面倒くさそう
        </div>
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          eslintを入れてコードを整形する
        </div>
      </div>
      <div className="flex gap-2">
        <div>
          <form>
            <Input type="hidden" name="user_id" value={userProfile.user_id} />
            <SubmitButton formAction={deleteAccountAction} pendingText="Deleting account...">Delete Account</SubmitButton>
          </form>
          <FormMessage message={messages} />
        </div>
        <Button asChild size="sm" variant={"destructive"}>
          <Link href="/pricing">Pleace Subscribe!!</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your User Profile Infomation</h2>
        <pre className="text-xs font-mono p-3 rounded border overflow-auto break-all whitespace-pre-wrap">
          {JSON.stringify(userProfile, null, 2)}
        </pre>
      </div>
    </div>
  );
}
