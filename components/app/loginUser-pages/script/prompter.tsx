'use client'

import type { Message } from '@/types/message'
import { useEditScriptForm } from '@/lib/validation/hooks'
import type { getEditScript, scriptData } from '@/types/script'
import PrompterMenu from '@/components/ui/prompter-menu'
import { useRef, useEffect, useMemo, useState } from 'react'
import { useAutoScroll } from '@/lib/hooks/autoScroll'
import { editScriptName } from '@/lib/actions/script/editScript'
import ToastMessage from '@/components/ui/message/toast'
import { generateHTML } from '@tiptap/html'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import BoldExtension from '@tiptap/extension-bold'
import ItalicExtension from '@tiptap/extension-italic'
import {
    FontSize,
    LineHeight,
    Color,
    TextStyle,
} from '@tiptap/extension-text-style'

const tiptapExtensions = [
    Document,
    Paragraph,
    Text,
    BoldExtension,
    ItalicExtension,
    TextStyle,
    LineHeight,
    FontSize,
    Color,
    Heading.configure({
        levels: [1, 2, 3],
    }),
]

export function PrompterComponent({ script }: { script: getEditScript }) {
    const {
        handleStartScrollWithCountdown,
        handleResetScroll,
        enableWheelStop,
    } = useAutoScroll()
    const { form } = useEditScriptForm(script.data as scriptData)
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    const [prompterSetting, setPrompterSetting] = useState<{
        fontSize: number
        lineHeight: number
        rotateX: boolean
        rotateY: boolean
        timer: number
        scrollSpeed: number
    }>({
        fontSize: 48,
        lineHeight: 1.5,
        rotateX: false,
        rotateY: false,
        timer: 0,
        scrollSpeed: 1,
    })
    const [countdown, setCountdown] = useState<number | null>(null)
    const startRef = useRef<HTMLDivElement>(null)
    const prompterSettingRef = useRef(prompterSetting)
    const name = form.watch('name')
    const scriptContent = script.data?.content
    const prompterHtml = useMemo(() => {
        if (!scriptContent) return ''

        return generateHTML(scriptContent, tiptapExtensions)
    }, [scriptContent])

    useEffect(() => {
        prompterSettingRef.current = prompterSetting
    }, [prompterSetting])

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

    useEffect(() => {
        if (!startRef.current) return

        return enableWheelStop(startRef.current)
    }, [enableWheelStop])

    if (!script.success) {
        return <p className="text-center">{script.error}</p>
    }

    return (
        <>
            <section>
                <div className="w-pcvw-[1280] mx-auto h-screen relative">
                    <div className="fixed top-pcvw-[16] left-1/2 -translate-x-1/2 w-pcvw-[1280] z-10">
                        <PrompterMenu
                            prompterSetting={prompterSetting}
                            onPrompterSettingChange={setPrompterSetting}
                            onStartScroll={() =>
                                handleStartScrollWithCountdown(
                                    startRef as React.RefObject<HTMLDivElement>,
                                    () =>
                                        prompterSettingRef.current.scrollSpeed,
                                    prompterSetting.timer,
                                    setCountdown
                                )
                            }
                            onResetScroll={() => {
                                setCountdown(null)
                                handleResetScroll(
                                    startRef as React.RefObject<HTMLDivElement>
                                )
                            }}
                        />
                    </div>

                    <div
                        ref={startRef}
                        className="h-full overflow-y-auto [&_*]:![font-size:inherit] [&_*]:![line-height:inherit]"
                        style={{
                            fontSize: `${prompterSetting.fontSize}px`,
                            lineHeight: prompterSetting.lineHeight,
                            transform: `rotateY(${prompterSetting.rotateY ? '180deg' : '0deg'}) rotateX(${prompterSetting.rotateX ? '180deg' : '0deg'})`,
                        }}
                    >
                        <div
                            className="pt-pcvw-[380] pb-pcvw-[380]"
                            dangerouslySetInnerHTML={{ __html: prompterHtml }}
                        />
                    </div>

                    {countdown !== null && (
                        <div className="bg-background-primary text-text-onPrimary text-pcvw-[48] font-bold rounded-xl-pc flex align-center justify-center py-16-pc w-full absolute top-pcvw-[140] left-1/2 -translate-x-1/2">
                            {countdown}
                        </div>
                    )}
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
