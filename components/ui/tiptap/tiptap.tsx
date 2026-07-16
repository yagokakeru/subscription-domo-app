'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import {
    FontSize,
    LineHeight,
    Color,
    TextStyle,
} from '@tiptap/extension-text-style'
import { type ReactNode, useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { editScriptFormValues } from '@/lib/validation/schema'
import type { Message } from '@/types/message'
import { editScript } from '@/lib/actions/script/editScript'
import { scriptData } from '@/types/script'
import type { saveState } from '@/types/saveState'

const Tiptap = ({
    renderMenu,
    form,
    setToastMessage,
    scriptData,
    setSaveState,
}: {
    renderMenu: (editor: Editor) => ReactNode
    form: UseFormReturn<editScriptFormValues>
    setToastMessage: (message: Message) => void
    scriptData: scriptData
    setSaveState: (state: saveState) => void
}) => {
    const content = form.watch('content')
    const plainContent = form.watch('plainContent')

    const extensions = [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        TextStyle,
        LineHeight,
        FontSize,
        Color,
        Heading.configure({
            levels: [1, 2, 3],
        }),
    ]

    const editor = useEditor({
        extensions: extensions,
        content: content ?? '',
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
        // contentのvalue値にエディターに入力した値を反映
        onUpdate: ({ editor }) => {
            form.setValue('content', editor.getJSON(), {
                shouldValidate: true,
            })
            form.setValue('plainContent', editor.getText(), {
                shouldValidate: true,
            })
            setSaveState('saving')
        },
    })

    useEffect(() => {
        if (!editor) return
        form.setValue('plainContent', editor.getText())
    }, [editor, form])

    useEffect(() => {
        if (plainContent === scriptData.plain_content) return

        const timeout = setTimeout(async () => {
            // action serverに受け渡すときにjsonのattrsが消え、fontsizeが保持されないので一度文字列にする
            const jsonS = JSON.stringify(content, null, 2)
            const result = await editScript(
                form.getValues(),
                jsonS,
                scriptData.id
            )

            setToastMessage(result)
            if (result.messageType === 'success') {
                setSaveState('saved')
            } else {
                setSaveState('unsaved')
            }
        }, 2000)
        return () => clearTimeout(timeout)
    }, [content, plainContent, scriptData.id, setToastMessage, setSaveState])

    if (!editor) {
        return null
    }

    return (
        <>
            {renderMenu && renderMenu(editor)}
            <EditorContent editor={editor} />
        </>
    )
}

export default Tiptap
