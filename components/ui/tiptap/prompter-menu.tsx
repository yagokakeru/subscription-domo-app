'use client'

import { Editor, useEditorState } from '@tiptap/react'

const PrompterMenu = ({ editor }: { editor: Editor }) => {
    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor) {
                return {
                    isH1: false,
                    isH2: false,
                    isH3: false,
                    isBold: false,
                    isFontSize28: false,
                    isFontSize32: false,
                    isLineHeight150: false,
                    isLineHeight200: false,
                    isLineHeight400: false,
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
                isLineHeight150: editor.isActive('textStyle', {
                    lineHeight: '1.5',
                }),
                isLineHeight200: editor.isActive('textStyle', {
                    lineHeight: '2.0',
                }),
                isLineHeight400: editor.isActive('textStyle', {
                    lineHeight: '4.0',
                }),
            }
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="control-group">
            <div className="button-group flex">
                <div
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`border-2 border-black px-10
                        ${editorState?.isH1 ? 'bg-black text-white' : ''}`}
                >
                    H1
                </div>
                <div
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`border-2 border-black px-10
                        ${editorState?.isH2 ? 'bg-black text-white' : ''}`}
                >
                    H2
                </div>
                <div
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={`border-2
                        border-black
                        px-10
                        ${editorState?.isH3 ? 'bg-black text-white' : ''}`}
                >
                    H3
                </div>
                <div
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`border-2
                        border-black
                        px-10
                        ${editorState?.isBold ? 'bg-black text-white' : ''}`}
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
                    onClick={() => editor.chain().focus().unsetFontSize().run()}
                    className={`border-2
                        border-black
                        px-10`}
                    data-test-id="unsetFontSize"
                >
                    Unset font size
                </div>
            </div>
            <div className="button-group flex">
                <div
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleTextStyle({ lineHeight: '1.5' })
                            .run()
                    }
                    className={`border-2
                        border-black
                        px-10
                        ${
                            editorState?.isLineHeight150
                                ? 'bg-black text-white'
                                : ''
                        }`}
                >
                    Line height 1.5
                </div>
                <div
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleTextStyle({ lineHeight: '2.0' })
                            .run()
                    }
                    className={`border-2
                        border-black
                        px-10
                        ${
                            editorState?.isLineHeight200
                                ? 'bg-black text-white'
                                : ''
                        }`}
                >
                    Line height 2.0
                </div>
                <div
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleTextStyle({ lineHeight: '4.0' })
                            .run()
                    }
                    className={`border-2
                        border-black
                        px-10
                        ${
                            editorState?.isLineHeight400
                                ? 'bg-black text-white'
                                : ''
                        }`}
                >
                    Line height 4.0
                </div>
                <div
                    onClick={() =>
                        editor.chain().focus().unsetLineHeight().run()
                    }
                    className={`border-2
                        border-black
                        px-10`}
                >
                    Unset line height
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
    )
}

export default PrompterMenu
