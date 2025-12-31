'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import '@/components/app/loginUser-pages/tiptap.css'

const Tiptap = () => {
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Heading.configure({
                levels: [1, 2, 3],
            }),
        ],
        content: '<p>Hello World! 🌎️</p>',
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
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
                        className={
                            editor.isActive('heading', { level: 1 })
                                ? 'is-active'
                                : ''
                        }
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
                        className={
                            editor.isActive('heading', { level: 2 })
                                ? 'is-active'
                                : ''
                        }
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
                        className={
                            editor.isActive('heading', { level: 3 })
                                ? 'is-active'
                                : ''
                        }
                    >
                        H3
                    </button>
                </div>
            </div>
            <EditorContent editor={editor} className="prose-content" />
        </>
    )
}

export default Tiptap
