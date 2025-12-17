'use client'

import { FormMessage, Message } from '@/components/form-message'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { useScriptFrom } from '@/lib/validation/hooks'

export function PostComponent({ message }: { message: Message }) {
    const { form, onSubmit } = useScriptFrom()

    return (
        <>
            <h2 className="font-bold text-2xl mb-4">Post page</h2>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Label htmlFor="script">台本</Label>
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
                )}
                <SubmitButton pendingText="creating">作成</SubmitButton>
            </form>

            <FormMessage message={message} />
        </>
    )
}
