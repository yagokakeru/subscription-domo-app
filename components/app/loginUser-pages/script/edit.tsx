'use client'

import { FormMessage, Message } from '@/components/form-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { useEditScriptFrom } from '@/lib/validation/hooks'
import type { getEditScript, scriptData } from '@/types/script'
import Tiptap from '@/components/ui/tiptap'
import { useRef, useEffect, useState } from 'react'
import { useAutoScroll } from '@/lib/hooks/autoScroll'

export function EditComponent({
    message,
    script,
}: {
    message: Message
    script: getEditScript
}) {
    const { scrollToWithDuration, stopScroll, enableWheelStop } =
        useAutoScroll()
    const { form, onSubmit } = useEditScriptFrom(script.data as scriptData)
    const [hours, setHours] = useState<number>(0)
    const [minutes, setMinutes] = useState<number>(0)
    const [seconds, setSeconds] = useState<number>(0)
    const [duration, setDuration] = useState<number>(10000)
    const startRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)

    const scrollToStart = (startingPoint = false) => {
        if (!endRef.current || !startRef.current) return

        const startY =
            startRef.current.getBoundingClientRect().top + window.scrollY
        const targetY =
            endRef.current.getBoundingClientRect().top + window.scrollY

        if (startingPoint) {
            window.scrollTo(0, startY)
        }

        // 10秒かけてスクロール
        scrollToWithDuration(startY, targetY, duration)
    }

    const timeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case 'hours':
                setHours(Number(e.target.value))
                setDuration(
                    Number(e.target.value) * 3600 * 1000 +
                        minutes * 60 * 1000 +
                        seconds * 1000
                )
                break
            case 'minutes':
                setMinutes(Number(e.target.value))
                setDuration(
                    hours * 3600 * 1000 +
                        Number(e.target.value) * 60 * 1000 +
                        seconds * 1000
                )
                break
            case 'seconds':
                setSeconds(Number(e.target.value))
                setDuration(
                    hours * 3600 * 1000 +
                        minutes * 60 * 1000 +
                        Number(e.target.value) * 1000
                )
                break
            default:
        }
    }

    useEffect(() => {
        enableWheelStop()
    }, [enableWheelStop])

    if (!script.success) {
        return <p className="text-center">{script.error}</p>
    }

    return (
        <>
            <h2 className="font-bold text-2xl mb-4">Post page</h2>

            <div ref={startRef}>START</div>

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
            </div>
        </>
    )
}
