'use client'

import { FormMessage, Message } from '@/components/form-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { useEditScriptFrom } from '@/lib/validation/hooks'
import type { getEditScript, scriptData } from '@/types/script'
import Tiptap from '@/components/ui/tiptap'
import { useRef } from 'react'

export function EditComponent({
    message,
    script,
}: {
    message: Message
    script: getEditScript
}) {
    const { form, onSubmit } = useEditScriptFrom(script.data as scriptData)
    const startRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)

    if (!script.success) {
        return <p className="text-center">{script.error}</p>
    }

    const scrollToStart = () => {
        if (!endRef.current) return

        const targetY =
            endRef.current.getBoundingClientRect().top + window.scrollY

        // 2秒かけてスクロール
        scrollToWithDuration(targetY, 10000)
    }

    const scrollToWithDuration = (
        targetY: number,
        duration: number // ミリ秒
    ) => {
        const startY = window.scrollY
        const diff = targetY - startY
        const startTime = performance.now()

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // easeInOut（なくてもOK）
            const ease =
                progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2

            window.scrollTo(0, startY + diff * ease)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }

    return (
        <>
            <h2 className="font-bold text-2xl mb-4">Post page</h2>
            <Button
                asChild
                size="sm"
                variant={'destructive'}
                onClick={scrollToStart}
            >
                <p>自動スクロール</p>
            </Button>

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
        </>
    )
}
