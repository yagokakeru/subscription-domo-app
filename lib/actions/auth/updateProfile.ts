"use server";

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

    const image = await uploadImage(avatar[0], id);
    console.log(image);

    // プロフィール情報を更新
    const { error } = await supabase
        .from("profile")
        .update({ name })
        .eq("supabase_uuid", id)

    if ( !error ) {
        return { status: 'success', message: 'プロフィールを更新しました。'};
    } else {
        return { status: 'error', message: `プロフィールを更新できませんでした。${error?.message}` };
    }
}