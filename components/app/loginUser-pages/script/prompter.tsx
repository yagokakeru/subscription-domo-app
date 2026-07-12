'use client'

import { FormMessage } from '@/components/form-message'
import type { Message } from '@/types/message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEditScriptForm } from '@/lib/validation/hooks'
import type { getEditScript, scriptData } from '@/types/script'
import Tiptap from '@/components/ui/tiptap/tiptap'
import { useRef, useEffect, useState } from 'react'
import { useAutoScroll } from '@/lib/hooks/autoScroll'
import { CircleArrowLeft, Bold, Italic } from 'lucide-react'
import EditMenu from '@/components/ui/tiptap/edit-menu'
import { editScriptName } from '@/lib/actions/script/editScript'
import ToastMessage from '@/components/ui/message/toast'

export function EditComponent({
    message,
    script,
}: {
    message: Message
    script: getEditScript
}) {
    const { scrollToWithDuration, stopScroll, enableWheelStop } =
        useAutoScroll()
    const { form, onSubmit } = useEditScriptForm(script.data as scriptData)
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    const [hours, setHours] = useState<number>(0)
    const [minutes, setMinutes] = useState<number>(0)
    const [seconds, setSeconds] = useState<number>(0)
    const [duration, setDuration] = useState<number>(10000)
    const startRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)
    const name = form.watch('name')

    useEffect(() => {
        if (name === script.data?.title) return

        const timeout = setTimeout(async () => {
            const result = await editScriptName(name, script.data?.id as number)

            if (result.messageType === 'success') {
                setToastMessage(result)
            }
        }, 2000)
        return () => clearTimeout(timeout)
    }, [name, script.data?.id, script.data?.title, setToastMessage])

    // const scrollToStart = (startingPoint = false) => {
    //     if (!endRef.current || !startRef.current) return

    //     const startY =
    //         startRef.current.getBoundingClientRect().top + window.scrollY
    //     const targetY =
    //         endRef.current.getBoundingClientRect().top + window.scrollY

    //     if (startingPoint) {
    //         window.scrollTo(0, startY)
    //     }

    //     // 10秒かけてスクロール
    //     scrollToWithDuration(startY, targetY, duration)
    // }

    // const timeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     switch (e.target.name) {
    //         case 'hours':
    //             setHours(Number(e.target.value))
    //             setDuration(
    //                 Number(e.target.value) * 3600 * 1000 +
    //                     minutes * 60 * 1000 +
    //                     seconds * 1000
    //             )
    //             break
    //         case 'minutes':
    //             setMinutes(Number(e.target.value))
    //             setDuration(
    //                 hours * 3600 * 1000 +
    //                     Number(e.target.value) * 60 * 1000 +
    //                     seconds * 1000
    //             )
    //             break
    //         case 'seconds':
    //             setSeconds(Number(e.target.value))
    //             setDuration(
    //                 hours * 3600 * 1000 +
    //                     minutes * 60 * 1000 +
    //                     Number(e.target.value) * 1000
    //             )
    //             break
    //         default:
    //     }
    // }

    // useEffect(() => {
    //     enableWheelStop()
    // }, [enableWheelStop])

    if (!script.success) {
        return <p className="text-center">{script.error}</p>
    }

    return (
        <>
            <section className="pt-pcvw-[150]">
                <div className="w-pcvw-[1280] mx-auto">
                    <div className="flex items-center gap-pcvw-[24]">
                        <Link href="/protected">
                            <CircleArrowLeft className="block w-pcvw-[44] h-auto" />
                        </Link>
                        <div className="flex items-center gap-pcvw-[8]">
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <Input
                                    className="border-none"
                                    {...form.register('name')}
                                />
                            </form>
                            <div className="aspect-square bg-status-warning w-pcvw-[20] rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-pcvw-[16]">
                            <SubmitButton
                                pendingText="saving"
                                form="edit-script-form"
                            >
                                保存
                            </SubmitButton>
                            <Link href="/protected">
                                <Button variant="ghost">
                                    プロンプター表示
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <form
                        className="mt-16-pc"
                        id="edit-script-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <Tiptap
                            form={form}
                            renderMenu={(editor) => (
                                <EditMenu editor={editor} />
                            )}
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

            {/* <div ref={startRef}>START</div>

            <form id="edit-script-form" onSubmit={form.handleSubmit(onSubmit)}>
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

            <div ref={endRef}>END</div>

            <div className="bg-black w-screen h-screen"></div>

            <div className="flex justify-center gap-x-2.5 fixed bottom-5 left-0 w-screen">
                <div className="flex gap-x-1 mr-4">
                    <input
                        type="number"
                        name="hours"
                        min={0}
                        max={24}
                        value={hours}
                        onChange={timeHandler}
                    />
                    <span>時間</span>

                    <input
                        type="number"
                        name="minutes"
                        min={0}
                        max={59}
                        value={minutes}
                        onChange={timeHandler}
                    />
                    <span>分</span>

                    <input
                        type="number"
                        name="seconds"
                        min={0}
                        max={59}
                        value={seconds}
                        onChange={timeHandler}
                    />
                    <span>秒</span>
                </div>
                <Button
                    asChild
                    size="sm"
                    variant={'destructive'}
                    onClick={() => scrollToStart()}
                >
                    <p>自動スクロール</p>
                </Button>
                <Button
                    asChild
                    size="sm"
                    variant={'destructive'}
                    onClick={() => scrollToStart(true)}
                >
                    <p>初めから自動スクロール</p>
                </Button>
                <Button
                    asChild
                    size="sm"
                    variant={'destructive'}
                    onClick={stopScroll}
                >
                    <p>自動スクロール停止</p>
                </Button>
                <Button
                    asChild
                    size="sm"
                    variant={'destructive'}
                    onClick={() => scrollToStart()}
                >
                    <p>自動スクロール再開</p>
                </Button>
            </div> */}
        </>
    )
}
