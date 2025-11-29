"use server";

import { createClient } from '@/utils/supabase/server';
import { profileFormValues } from "@/lib/validation/schema";
import type { userProfile } from '@/types/userProfile';

export const updateProfile = async (
    formData:profileFormValues,
    id:userProfile["user_id"]):
    Promise<{
        status: "success" | "error",
        message: string
    }> => {
    const supabase = await createClient();
    const { name } = formData;

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