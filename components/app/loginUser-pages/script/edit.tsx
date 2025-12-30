'use client'

import { FormMessage, Message } from '@/components/form-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { useEditScriptFrom } from '@/lib/validation/hooks'
import type { script } from '@/types/script'

export function EditComponent({
    message,
    script,
}: {
    message: Message
    script: script
}) {
    const { form, onSubmit } = useEditScriptFrom()

    if (script.success === false) {
        return <p className="text-center">{script.error}</p>
    }

    return (
        <>
            <h2 className="font-bold text-2xl mb-4">Post page</h2>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Input
                    {...form.register('id')}
                    defaultValue={script.data?.[0].id || ''}
                    type="hidden"
                />
                <Label htmlFor="name">ファイル名</Label>
                <Input
                    {...form.register('name')}
                    defaultValue={script.data?.[0].title || '無題の台本'}
                />
                <Label htmlFor="script">台本</Label>
                <textarea
                    className="border-2 border-solid border-gray-400 rounded flex items-center justify-center w-96"
                    {...form.register('script')}
                    id="script"
                    rows={9}
                    defaultValue={script.data?.[0].script || ''}
                ></textarea>
                {form.formState.errors.script && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.script.message}
                    </p>
                )}
                <SubmitButton pendingText="creating">編集</SubmitButton>
            </form>

            <FormMessage message={message} />
        </>
    )
}
