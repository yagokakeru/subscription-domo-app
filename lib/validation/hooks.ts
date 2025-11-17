"use cliant"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { signUpAction, signInAction } from "@/app/actions";
import { signupSchema, signupFormValues, loginSchema, loginFormValues, profileSchema, profileFormValues } from "./schema";
import { useAtom } from "jotai";
import { userProfileAtom } from "@/lib/atoms/authUser";
import axios from 'axios';

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
            id: userProfile?.user_id,
            name: userProfile?.name
        }
    });

    const onSubmit = (data: profileFormValues) => {
        alert(JSON.stringify(data));
        // try {
        //     const res = await axios.post('/api/editProfile', {
        //         id: data.id,
        //         name: data.name
        //     });

        //     console.log(res);

        //     if (res.data.data) {
        //         // setUserProfile(res.data.data);
        //         return { ok: true };
        //     } else {
        //         return { ok: false };
        //     }
        // } catch (err) {
        //     return { ok: false };
        // }
    };

    return {form, onSubmit};
}