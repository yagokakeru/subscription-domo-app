'use client'

import type { Message } from '@/types/message'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEditScriptForm } from '@/lib/validation/hooks'
import type { getEditScript, scriptData } from '@/types/script'
import Tiptap from '@/components/ui/tiptap/tiptap'
import { useEffect, useState } from 'react'
import { CircleArrowLeft } from 'lucide-react'
import EditMenu from '@/components/ui/tiptap/edit-menu'
import { editScriptName } from '@/lib/actions/script/editScript'
import ToastMessage from '@/components/ui/message/toast'
import type { saveState } from '@/types/saveState'
import { editScriptFormValues } from '@/lib/validation/schema'

export function EditComponent({ script }: { script: getEditScript }) {
    const { form, onSubmit } = useEditScriptForm(script.data as scriptData)
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    const [saveState, setSaveState] = useState<saveState>('unsaved')
    const id = script.data?.id as number
    const name = form.watch('name')
    const nameRegister = form.register('name')

    const saveStatusClass = {
        saved: 'bg-status-success',
        saving: 'bg-status-warning animate-pulse',
        unsaved: 'bg-status-error',
    }[saveState]

    useEffect(() => {
        if (name === script.data?.title) return

        const timeout = setTimeout(async () => {
            const result = await editScriptName(name, id)

            setToastMessage(result)
            if (result.messageType === 'success') {
                setSaveState('saved')
            } else {
                setSaveState('unsaved')
            }
        }, 2000)
        return () => clearTimeout(timeout)
    }, [name, id, script.data?.title, setToastMessage, setSaveState])

    const handleSubmit = async (data: editScriptFormValues) => {
        const result = await onSubmit(data)

        setToastMessage(result)

        if (result.messageType === 'success') {
            setSaveState('saved')
        }
    }

    if (!script.success) {
        return <p className="text-center">{script.error}</p>
    }

    return (
        <>
            <section className="pt-pcvw-[16]">
                <div className="w-pcvw-[1280] mx-auto">
                    <div className="flex items-center gap-pcvw-[24]">
                        <Link href="/protected">
                            <CircleArrowLeft className="block w-pcvw-[44] h-auto" />
                        </Link>
                        <div className="flex items-center gap-pcvw-[8]">
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <Input
                                    className="border-none !text-heading-h3-pc max-w-pcvw-[400]"
                                    {...nameRegister}
                                    onChange={(e) => {
                                        nameRegister.onChange(e)
                                        setSaveState('unsaved')
                                    }}
                                />
                            </form>
                            <div
                                className={`aspect-square w-pcvw-[20] rounded-full ${saveStatusClass}`}
                            ></div>
                        </div>
                        <div className="flex items-center gap-pcvw-[16]">
                            <SubmitButton
                                pendingText="saving"
                                form="edit-script-form"
                            >
                                保存
                            </SubmitButton>
                            <Link href={`/protected/script/prompter/${id}`}>
                                <Button variant="ghost">
                                    プロンプター表示
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <form
                        className="mt-16-pc"
                        id="edit-script-form"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <Tiptap
                            form={form}
                            renderMenu={(editor) => (
                                <EditMenu editor={editor} />
                            )}
                            setToastMessage={setToastMessage}
                            scriptData={script.data as scriptData}
                            setSaveState={setSaveState}
                        />
                        {form.formState.errors.content && (
                            <p className="text-red-500 text-sm">
                                {String(form.formState.errors.content.message)}
                            </p>
                        )}
                    </form>
                </div>

                {toastMessage && (
                    <ToastMessage
                        message={toastMessage}
                        onClose={() => setToastMessage(null)}
                    />
                )}
            </section>
        </>
    )
}
