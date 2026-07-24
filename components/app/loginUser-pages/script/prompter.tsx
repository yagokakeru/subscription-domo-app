'use client'

import type { Message } from '@/types/message'
import { useEditScriptForm } from '@/lib/validation/hooks'
import type { getEditScript, scriptData } from '@/types/script'
import PrompterMenu from '@/components/ui/prompter-menu'
import { useEffect, useState } from 'react'
// import { useAutoScroll } from '@/lib/hooks/autoScroll'
import { editScriptName } from '@/lib/actions/script/editScript'
import ToastMessage from '@/components/ui/message/toast'
// import type { saveState } from '@/types/saveState'
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
    // const { scrollToWithDuration, stopScroll, enableWheelStop } = useAutoScroll()
    // const { form, onSubmit } = useEditScriptForm(script.data as scriptData)
    const { form } = useEditScriptForm(script.data as scriptData)
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    // const [saveState, setSaveState] = useState<saveState>('unsaved')
    // const [hours, setHours] = useState<number>(0)
    // const [minutes, setMinutes] = useState<number>(0)
    // const [seconds, setSeconds] = useState<number>(0)
    // const [duration, setDuration] = useState<number>(10000)
    const [prompterFontSize, setPrompterFontSize] = useState<number>(48)
    const [prompterLineHeight, setPrompterLineHeight] = useState<number>(1.5)
    const [prompterRotateX, setPrompterRotateX] = useState<boolean>(false)
    const [prompterRotateY, setPrompterRotateY] = useState<boolean>(false)
    const [prompterTimer, setPrompterTimer] = useState<number>(0)
    // const startRef = useRef<HTMLDivElement>(null)
    // const endRef = useRef<HTMLDivElement>(null)
    const name = form.watch('name')
    const prompterHtml = script.data?.content
        ? generateHTML(script.data.content, tiptapExtensions)
        : ''

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
                <div className="w-pcvw-[1280] mx-auto relative">
                    {/* <form
                        className="mt-16-pc"
                        id="edit-script-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <Tiptap
                            form={form}
                            renderMenu={(editor) => (
                                <PrompterMenu editor={editor} />
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
                    </form> */}

                    <PrompterMenu
                        fontSize={prompterFontSize}
                        lineHeight={prompterLineHeight}
                        rotateX={prompterRotateX}
                        rotateY={prompterRotateY}
                        timer={prompterTimer}
                        onFontSizeChange={setPrompterFontSize}
                        onLineHeightChange={setPrompterLineHeight}
                        onRotateXChange={setPrompterRotateX}
                        onRotateYChange={setPrompterRotateY}
                        onTimerChange={setPrompterTimer}
                    />

                    <div className="pt-pcvw-[304]">
                        <div
                            className="[&_*]:![font-size:inherit] [&_*]:![line-height:inherit]"
                            style={{
                                fontSize: `${prompterFontSize}px`,
                                lineHeight: prompterLineHeight,
                                transformOrigin: 'center top',
                                transform: `rotateY(${prompterRotateY ? '180deg' : '0deg'}) rotateX(${prompterRotateX ? '180deg' : '0deg'})`,
                            }}
                            dangerouslySetInnerHTML={{ __html: prompterHtml }}
                        />
                    </div>

                    {prompterTimer > 0 && (
                        <div className="bg-background-primary text-text-onPrimary text-pcvw-[48] font-bold rounded-xl-pc flex align-center justify-center py-16-pc w-full absolute top-pcvw-[140] left-1/2 -translate-x-1/2">
                            {prompterTimer}
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
