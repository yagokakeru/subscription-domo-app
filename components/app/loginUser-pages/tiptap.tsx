'use client'

import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Bold from '@tiptap/extension-bold'
import { FontSize, TextStyle } from '@tiptap/extension-text-style'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { editScriptFormValues } from '@/lib/validation/schema'

const Tiptap = (form: UseFormReturn<editScriptFormValues>) => {
    const extensions = [
        Document,
        Paragraph,
        Text,
        Bold,
        TextStyle,
        FontSize,
        Heading.configure({
            levels: [1, 2, 3],
        }),
    ]

    const editor = useEditor({
        extensions: extensions,
        content: '',
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
        // contentのvalue値にエディターに入力した値を反映
        onUpdate: ({ editor }) => {
            form.setValue('content', editor.getJSON(), {
                shouldValidate: true,
            })
        },
    })

    useEffect(() => {
        if (editor && form.getValues('content')) {
            editor.commands.setContent(form.getValues('content'))
        }
    }, [editor, form])

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor) {
                return {
                    isH1: false,
                    isH2: false,
                    isH3: false,
                }
            }

            return {
                isH1: editor.isActive('heading', { level: 1 }),
                isH2: editor.isActive('heading', { level: 2 }),
                isH3: editor.isActive('heading', { level: 3 }),
                isBold: editor.isActive('bold'),
                isFontSize28: editor.isActive('textStyle', {
                    fontSize: '28px',
                }),
                isFontSize32: editor.isActive('textStyle', {
                    fontSize: '32px',
                }),
            }
        },
    })

    if (!editor) {
        return null
    }

    return (
        <>
            <div className="control-group">
                <div className="button-group flex">
                    <div
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run()
                        }
                        className={`border-2 border-black px-10
                            ${editorState?.isH1 ? 'bg-black text-white' : ''}`}
                    >
                        H1
                    </div>
                    <div
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                        className={`border-2 border-black px-10
                            ${editorState?.isH2 ? 'bg-black text-white' : ''}`}
                    >
                        H2
                    </div>
                    <div
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 3 })
                                .run()
                        }
                        className={`border-2
                            border-black
                            px-10
                            ${editorState?.isH3 ? 'bg-black text-white' : ''}`}
                    >
                        H3
                    </div>
                    <div
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        className={`border-2
                            border-black
                            px-10
                            ${
                                editorState?.isBold ? 'bg-black text-white' : ''
                            }`}
                    >
                        bold
                    </div>
                </div>
                <div className="button-group flex">
                    <div
                        onClick={() =>
                            editor.chain().focus().setFontSize('28px').run()
                        }
                        className={`border-2
                            border-black
                            px-10
                            ${
                                editorState?.isFontSize28
                                    ? 'bg-black text-white'
                                    : ''
                            }`}
                    >
                        Font size 28px
                    </div>
                    <div
                        onClick={() =>
                            editor.chain().focus().setFontSize('32px').run()
                        }
                        className={`border-2
                            border-black
                            px-10
                            ${
                                editorState?.isFontSize32
                                    ? 'bg-black text-white'
                                    : ''
                            }`}
                    >
                        Font size 32px
                    </div>
                    <div
                        onClick={() =>
                            editor.chain().focus().unsetFontSize().run()
                        }
                        className={`border-2
                            border-black
                            px-10`}
                        data-test-id="unsetFontSize"
                    >
                        Unset font size
                    </div>
                </div>
                <div className="button-group">
                    <div
                        onClick={() => {
                            editor.chain().focus().unsetAllMarks().run()
                            editor.chain().focus().clearNodes().run()
                        }}
                        className={`border-2
                            border-black
                            px-10`}
                    >
                        delete style
                    </div>
                </div>
            </div>
            <EditorContent
                editor={editor}
                className="prose-content border-2 border-solid border-gray-400 rounded"
            />
        </>
    )
}

export default Tiptap
