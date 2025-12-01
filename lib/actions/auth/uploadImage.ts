"use server";

import { createClient } from '@/utils/supabase/server';
import { profileFormValues } from "@/lib/validation/schema";
import type { userProfile } from '@/types/userProfile';

export const uploadImage = async ( file: File, id:userProfile["user_id"] ) => {
    const supabase = await createClient();

    if (!file) return { error: "ファイルがありません。" };

    // 1. 現在のプロフィール取得（古い画像削除のため）
    const { data: profile } = await supabase
        .from("profile")
        .select("avatar_url")
        .eq("supabase_uuid", id)
        .single();

    const oldPath = profile?.avatar_url || null;

    // 2. 新しい画像をアップロード
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = `${id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, buffer, {
        upsert: true,
        contentType: file.type,
        });

    if (uploadError) {
        return { error: "画像アップロードに失敗しました。" };
    }

    // 3. profile.avatar_url を更新
    const { error: updateError } = await supabase
        .from("profile")
        .update({ avatar_url: filePath })
        .eq("supabase_uuid", id);

    if (updateError) {
        return { error: "プロフィールの更新に失敗しました。" };
    }

    // 4. 古いファイルを削除（安全のため最後に）
    if (oldPath) {
        await supabase.storage.from("avatars").remove([oldPath]);
    }

    // 5. 再描画
    // revalidatePath("/mypage");

    return { success: true };
}