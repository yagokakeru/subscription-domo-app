'use client'

import { FormMessage, Message } from '@/components/form-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { useEditScriptFrom } from '@/lib/validation/hooks'
import type { getEditScript, scriptData } from '@/types/script'
import Tiptap from '@/components/ui/tiptap'

export function EditComponent({
    message,
    script,
}: {
    message: Message
    script: getEditScript
}) {
    const { form, onSubmit } = useEditScriptFrom(script.data as scriptData)

    if (!script.success) {
        return <p className="text-center">{script.error}</p>
    }

    return (
        <>
            <h2 className="font-bold text-2xl mb-4">Post page</h2>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Label htmlFor="name">ファイル名</Label>
                <Input {...form.register('name')} />

                <Label htmlFor="content">台本</Label>
                <Tiptap {...form} />
                {form.formState.errors.content && (
                    <p className="text-red-500 text-sm">
                        {String(form.formState.errors.content.message)}
                    </p>
                )}

                <SubmitButton pendingText="creating">編集</SubmitButton>
            </form>

            <FormMessage message={message} />
        </>
    )
}
