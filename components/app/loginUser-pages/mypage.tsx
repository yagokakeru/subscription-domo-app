"use client";

import { FormMessage, Message } from "@/components/form-message";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "@/lib/atoms/authUser";
import { signOutAction, deleteAccountAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileFrom } from "@/lib/validation/hooks";
import { useState } from "react";
import Image from "next/image";
import { createAvatarUrl } from "@/lib/actions/auth/createAvatarUrl";
import { useEffect } from "react";

export function MypageComponent({ message }: { message: Message }) {
  const userProfile = useAtomValue(userProfileAtom);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { form, onSubmit } = useProfileFrom();

  useEffect(() => {
    // アバターURLを取得
    if (!userProfile?.avatar_url) return;

    const fetchAvatarUrl = async () => {
      try {
        const signedUrl = await createAvatarUrl(userProfile?.avatar_url);
        setAvatarUrl(signedUrl);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAvatarUrl();
  }, [userProfile?.avatar_url]);

  return (
    <>
      <h2 className="font-bold text-2xl mb-4">マイページ</h2>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Image
            src={avatarUrl || "/default-avatar.jpg"}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full mb-4"
          />
          <Input
            type="file"
            {...form.register("avatar")}
            accept="image/png, image/jpeg"
          />
          {form.formState.errors.avatar &&
            typeof form.formState.errors.avatar.message === "string" && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.avatar.message}
              </p>
            )}
          <div className="flex">
            <div>メールアドレス</div>
            <div>{userProfile?.email}</div>
          </div>
          <div className="flex">
            <Label htmlFor="name">名前</Label>
            <Input {...form.register("name")} placeholder="山田 太郎" />
          </div>
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.name.message}
            </p>
          )}

          <SubmitButton pendingText="editing">編集</SubmitButton>
        </form>

        <FormMessage message={message} />

        <div className="flex items-center gap-4 mt-10">
          <SubmitButton
            pendingText="Signing out..."
            variant={"outline"}
            size={"sm"}
            formAction={signOutAction}
          >
            Sign out
          </SubmitButton>
          <SubmitButton
            pendingText="Deleting account..."
            variant={"destructive"}
            size={"sm"}
            formAction={deleteAccountAction}
          >
            Delete Account
          </SubmitButton>
        </div>
      </div>
    </>
  );
}
