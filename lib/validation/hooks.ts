'use cliant'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signUpAction, signInAction } from '@/app/actions'
import {
    signupSchema,
    signupFormValues,
    loginSchema,
    loginFormValues,
    profileSchema,
    profileFormValues,
    createScriptSchema,
    createScriptFormValues,
    editScriptSchema,
    editScriptFormValues,
} from './schema'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { updateProfile } from '@/lib/actions/auth/updateProfile'
import { postScript } from '@/lib/actions/script/createScript'
import { editScript } from '@/lib/actions/script/editScript'

export function useSignupFrom() {
    const form = useForm<signupFormValues>({
        resolver: zodResolver(signupSchema), // ZodをRHFに接続
    })

    const onSubmit = (data: signupFormValues) => {
        signUpAction(data)
    }

    return { form, onSubmit }
}

export function useLoginFrom() {
    const form = useForm<loginFormValues>({
        resolver: zodResolver(loginSchema), // ZodをRHFに接続
    })

    const onSubmit = (data: loginFormValues) => {
        signInAction(data)
    }

    return { form, onSubmit }
}

export function useProfileFrom() {
    const userProfile = useAtomValue(userProfileAtom)

    const form = useForm<profileFormValues>({
        resolver: zodResolver(profileSchema), // ZodをRHFに接続
        defaultValues: {
            name: userProfile?.name,
        },
    })

    const onSubmit = async (
        data: profileFormValues
    ): Promise<{ status: 'success' | 'error'; message: string }> => {
        return await updateProfile(data, userProfile!.user_id)
    }

    return { form, onSubmit }
}

export function useCreateScriptFrom() {
    const userProfile = useAtomValue(userProfileAtom)

    const form = useForm<createScriptFormValues>({
        resolver: zodResolver(createScriptSchema), // ZodをRHFに接続
    })

    const onSubmit = (data: createScriptFormValues) => {
        postScript(data, userProfile!.user_id)
    }

    return { form, onSubmit }
}

export function useEditScriptFrom() {
    const form = useForm<editScriptFormValues>({
        resolver: zodResolver(editScriptSchema), // ZodをRHFに接続
    })

    const onSubmit = (data: editScriptFormValues) => {
        editScript(data)
    }

    return { form, onSubmit }
}
