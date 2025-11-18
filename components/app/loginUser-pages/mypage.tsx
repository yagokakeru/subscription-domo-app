"use client"

import { useAtomValue } from "jotai";
import { userProfileAtom } from "@/lib/atoms/authUser";
import { signOutAction, deleteAccountAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileFrom } from "@/lib/validation/hooks";
import { useState } from "react";


export function MypageComponent() {
    const userProfile = useAtomValue(userProfileAtom);
    const [msg, setMsg] = useState<string | null>(null);
    const [msgType, setMsgType] = useState<"success" | "error" | null>(null);
    const { form, onSubmit } = useProfileFrom();

    return (
        <>
            <h2 className="font-bold text-2xl mb-4">マイページ</h2>
            <div>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex">
                        <div>メールアドレス</div>
                        <div>{userProfile?.email}</div>
                    </div>
                    <div className="flex">
                        <Label htmlFor="name">名前</Label>
                        <Input {...form.register("name")} placeholder="山田 太郎" />
                    </div>
                    {form.formState.errors.name && (
                        <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                    )}

                    <SubmitButton pendingText="editing">編集</SubmitButton>
                </form>
                {/* メッセージ表示（3秒で消える） */}
                {msg && (
                    <div
                    className={`mt-4 px-4 py-2 rounded text-white ${
                        msgType === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                    >
                        {msg}
                    </div>
                )}

                <div className="flex items-center gap-4 mt-10">
                    <SubmitButton pendingText="Signing out..." variant={"outline"} size={"sm"} formAction={signOutAction}>Sign out</SubmitButton>
                    <SubmitButton pendingText="Deleting account..." variant={"destructive"} size={"sm"} formAction={deleteAccountAction}>Delete Account</SubmitButton>
                </div>
            </div>
        </>
    )
}