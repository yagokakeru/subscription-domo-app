'use client'

import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Bold from '@tiptap/extension-bold'
import { TextStyle, FontSize } from '@tiptap/extension-text-style'

const Tiptap = () => {
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Bold,
            TextStyle,
            FontSize,
            Heading.configure({
                levels: [1, 2, 3],
            }),
        ],
        content:
            '今日は少しだけ時間に余裕があったので、いつもよりゆっくりコーヒーを飲みました。窓の外を見ると、特別な景色があるわけではないのに、なぜか落ち着いた気持ちになります。忙しい日が続くと、こうした何気ない時間の大切さを忘れてしまいがちですが、ほんの数分立ち止まるだけで頭の中が整理される気がします。たまには何も考えず、ただ目の前のことに集中するのも悪くないですね。',
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
    })

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
                <div className="button-group">
                    <button
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
                    </button>
                    <button
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
                    </button>
                    <button
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
                    </button>
                    <button
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
                    </button>
                </div>
                <div className="button-group">
                    <button
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
                    </button>
                    <button
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
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().unsetFontSize().run()
                        }
                        className={`border-2
                            border-black
                            px-10`}
                        data-test-id="unsetFontSize"
                    >
                        Unset font size
                    </button>
                </div>
                <div className="button-group">
                    <button
                        onClick={() => {
                            editor.chain().focus().unsetAllMarks().run()
                            editor.chain().focus().clearNodes().run()
                        }}
                        className={`border-2
                            border-black
                            px-10`}
                    >
                        delete style
                    </button>
                </div>
            </div>
            <EditorContent editor={editor} className="prose-content" />
        </>
    )
}

export default Tiptap
