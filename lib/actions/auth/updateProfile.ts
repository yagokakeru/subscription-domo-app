"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from '@/utils/supabase/server';
import { profileFormValues } from "@/lib/validation/schema";
import { uploadImage } from '@/lib/actions/auth/uploadImage';
import type { userProfile } from '@/types/userProfile';

export const updateProfile = async (
    formData:profileFormValues,
    id:userProfile["user_id"]):
    Promise<{
        status: "success" | "error",
        message: string
    }> => {
    const supabase = await createClient();
    const { name, avatar } = formData;

    // アバターを更新
    await uploadImage(avatar[0], id);

    // プロフィール情報を更新
    const { error } = await supabase
        .from("profile")
        .update({ name })
        .eq("supabase_uuid", id)

    if ( !error ) {
        return encodedRedirect("success", "/protected/mypage", "プロフィールを更新しました。");
    } else {
        return encodedRedirect("error", "/protected/mypage", `プロフィールを更新できませんでした。${error?.message}`);
    }
}