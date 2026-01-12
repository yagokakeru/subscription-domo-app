'use client'

import { FormMessage, Message } from '@/components/form-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { useCreateScriptFrom } from '@/lib/validation/hooks'
import Tiptap from '@/components/app/loginUser-pages/tiptap'

export function PostComponent({ message }: { message: Message }) {
    const { form, onSubmit } = useCreateScriptFrom()

    return (
        <>
            <h2 className="font-bold text-2xl mb-4">Post page</h2>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Label htmlFor="name">ファイル名</Label>
                <Input {...form.register('name')} defaultValue="無題の台本" />
                {/* <Label htmlFor="script">台本</Label>
                <textarea
                    className="border-2 border-solid border-gray-400 rounded flex items-center justify-center w-96"
                    {...form.register('script')}
                    id="script"
                    rows={9}
                ></textarea>
                {form.formState.errors.script && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.script.message}
                    </p>
                )} */}

                <Label htmlFor="content">台本</Label>
                <Tiptap {...form} />
                {form.formState.errors.content && (
                    <p className="text-red-500 text-sm">
                        {String(form.formState.errors.content.message)}
                    </p>
                )}
                <SubmitButton pendingText="creating">作成</SubmitButton>
            </form>

            <FormMessage message={message} />
        </>
    )
}
