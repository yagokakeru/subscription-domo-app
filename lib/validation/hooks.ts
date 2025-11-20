"use cliant"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { signUpAction, signInAction } from "@/app/actions";
import { signupSchema, signupFormValues, loginSchema, loginFormValues, profileSchema, profileFormValues } from "./schema";
import { useAtom } from "jotai";
import { userProfileAtom } from "@/lib/atoms/authUser";
import axios from 'axios';
// import { getUserInfo } from '@/lib/getUserInfo';

export function useSignupFrom() {
    const form = useForm<signupFormValues>({
        resolver: zodResolver(signupSchema), // ZodをRHFに接続
    });

    const onSubmit = (data: signupFormValues) => {
        signUpAction(data);
    };

    return {form, onSubmit};
}

export function useLoginFrom() {
    const form = useForm<loginFormValues>({
        resolver: zodResolver(loginSchema), // ZodをRHFに接続
    });

    const onSubmit = (data: loginFormValues) => {
        signInAction(data);
    };

    return {form, onSubmit};
}

export function useProfileFrom() {
    const [ userProfile, setUserProfile ] = useAtom(userProfileAtom);

    const form = useForm<profileFormValues>({
        resolver: zodResolver(profileSchema), // ZodをRHFに接続
        defaultValues: {
            name: userProfile?.name,
        }
    });

    const onSubmit = async (data: profileFormValues): Promise<{ status: "success" | "error", message: string }> => {
        try {
            // プロフィール情報を更新
            const res = await axios.post('/api/editProfile', {
                id: userProfile?.user_id,
                name: data.name
            });

            if (res.status === 200 && !res.data.error) {
                // 最新ユーザー情報を取得してAtomを更新
                const getUserInfoRes = await axios.post('/api/getUserInfo');
                setUserProfile(getUserInfoRes.data.userInfo);

                return { status: 'success', message: 'プロフィールを更新しました。'};
            } else {
                return { status: 'error', message: 'プロフィールを更新できませんでした。'};
            }
        } catch (err) {
            return { status: 'error', message: 'プロフィールを更新できませんでした。'};
        }
    };

    return {form, onSubmit};
}