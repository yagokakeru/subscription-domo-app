"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from 'stripe'

import { getUserInfo } from '@/lib/getUserInfo';
import { getCheckoutUrl } from "@/lib/getCheckoutUrl";

export const signUpAction = async (formData: FormData) => {
  const priceID = formData.get("priceid")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  // const origin = (await headers()).get("origin");
  // Stripeクライアントを作成
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)

  // emailかpasswordの入力がなければサインアップページにリダイレクト
  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  // ユーザーを作成
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })
  // Stripeの顧客情報を作成
  if (data.user) {
    const customer = await stripe.customers.create({
      email: data.user.email,
    });

    // SupabeseとStripeのユーザIDをDBに挿入
    const { error } = await supabase.from('profile').insert({ stripe_uuid: customer.id, supabase_uuid: data.user.id })
    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    }
  }

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    // 登録したユーザーをログインさせる
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      return encodedRedirect("error", "/sign-in", error.message);
    }

    // priceIDがあったらプランを購入する新規ユーザー
    if(priceID){
        // ログインユーザー情報を取得
        const userData = await getUserInfo();

        if(userData.data){
          const customerID = userData.data[0].stripe_uuid;
          const sessionURL = await getCheckoutUrl(priceID, customerID);

          if(sessionURL){
            return redirect(sessionURL);
          }
        }else{
          return encodedRedirect("error", "/sign-in", userData.error.message);
        }
    }

    return redirect("/protected");
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const deleteAccountAction = async (formData: FormData) => {
  const userID = formData.get("user_id")?.toString();
  const supabase = await createClient();
  const supabaseAdmin = createClientAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  // Stripeクライアントを作成
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)
  
  if (userID) {
    const { data, error } = await supabase.from('profile').select('stripe_uuid')
    .eq('supabase_uuid', userID);

    if(data) {
      const deleted = await stripe.customers.del(data[0].stripe_uuid); // stripe顧客情報削除
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userID) // supabase authユーザー情報削除
      const response = await supabase.from('profile').delete().eq('supabase_uuid', userID); // supabase profile情報削除2
    }

    if(error){
      console.error('error', error);
      return redirect("/protected");
    }
    
    await supabase.auth.signOut();
    return redirect("/");
  } else {
    return encodedRedirect(
      "error",
      "/protected",
      "Delete account failed",
    );
  }
}