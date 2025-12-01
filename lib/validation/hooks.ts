"use cliant"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { signUpAction, signInAction } from "@/app/actions";
import { signupSchema, signupFormValues, loginSchema, loginFormValues, profileSchema, profileFormValues } from "./schema";
import { useAtom } from "jotai";
import { userProfileAtom } from "@/lib/atoms/authUser";
import { updateProfile } from '@/lib/actions/auth/updateProfile';
import type { userProfile } from '@/types/userProfile';
// import axios from 'axios';
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
        return await updateProfile(data, userProfile!.user_id);
    };

    return {form, onSubmit};
}