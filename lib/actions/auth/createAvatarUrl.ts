"use server";
import { createClient } from "@/utils/supabase/server";

export const createAvatarUrl = async (avatarPath: string): Promise<string> => {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(avatarPath, 3600);

  if (error || !data) {
    throw new Error("Failed to create signed URL for avatar.");
  }
  return data.signedUrl;
};
