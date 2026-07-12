'use client'

import { useEditorState, type Editor } from '@tiptap/react'
import { Bold as BoldIcon, Italic as ItalicIcon } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'

const EditMenu = ({ editor }: { editor: Editor }) => {
    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor) {
                return {
                    isBold: false,
                    isItalic: false,
                    isBlack: false,
                    isRed: false,
                    isBlue: false,
                    isGreen: false,
                    isYellow: false,
                    isOrange: false,
                }
            }

            return {
                isBold: editor.isActive('bold'),
                isItalic: editor.isActive('italic'),
                isBlack: editor.isActive('textStyle', { color: '#000000' }),
                isRed: editor.isActive('textStyle', { color: '#EF4444' }),
                isBlue: editor.isActive('textStyle', { color: '#3B82F6' }),
                isGreen: editor.isActive('textStyle', { color: '#22C55E' }),
                isYellow: editor.isActive('textStyle', { color: '#EAB308' }),
                isOrange: editor.isActive('textStyle', { color: '#F97316' }),
            }
        },
    })

    if (!editor) {
        return null
    }

    return (
        <>
            <div className="bg-background-surface rounded-full flex gap-pcvw-[12] mt-8-pc px-32-pc py-8-pc w-fit">
                <div className="flex items-center gap-pcvw-[12] border-r border-border-default pr-12-pc py-12-pc">
                    <IconButton
                        active={editorState?.isBold}
                        onClick={() => editor.commands.toggleBold()}
                    >
                        <BoldIcon className="h-auto" />
                    </IconButton>
                    <IconButton
                        active={editorState?.isItalic}
                        onClick={() => editor.commands.toggleItalic()}
                    >
                        <ItalicIcon className="h-auto" />
                    </IconButton>
                </div>
                <div className="flex items-center gap-pcvw-[12] py-12-pc">
                    <IconButton
                        active={editorState?.isBlack}
                        onClick={() =>
                            editor.commands.toggleTextStyle({
                                color: '#000000',
                            })
                        }
                    >
                        <div className="aspect-square bg-text w-pcvw-[14] rounded-full"></div>
                    </IconButton>
                    <IconButton
                        active={editorState?.isRed}
                        onClick={() =>
                            editor.commands.toggleTextStyle({
                                color: '#EF4444',
                            })
                        }
                    >
                        <div className="aspect-square bg-[#EF4444] w-pcvw-[14] rounded-full"></div>
                    </IconButton>
                    <IconButton
                        active={editorState?.isBlue}
                        onClick={() =>
                            editor.commands.toggleTextStyle({
                                color: '#3B82F6',
                            })
                        }
                    >
                        <div className="aspect-square bg-[#3B82F6] w-pcvw-[14] rounded-full"></div>
                    </IconButton>
                    <IconButton
                        active={editorState?.isGreen}
                        onClick={() =>
                            editor.commands.toggleTextStyle({
                                color: '#22C55E',
                            })
                        }
                    >
                        <div className="aspect-square bg-[#22C55E] w-pcvw-[14] rounded-full"></div>
                    </IconButton>
                    <IconButton
                        active={editorState?.isYellow}
                        onClick={() =>
                            editor.commands.toggleTextStyle({
                                color: '#EAB308',
                            })
                        }
                    >
                        <div className="aspect-square bg-[#EAB308] w-pcvw-[14] rounded-full"></div>
                    </IconButton>
                    <IconButton
                        active={editorState?.isOrange}
                        onClick={() =>
                            editor.commands.toggleTextStyle({
                                color: '#F97316',
                            })
                        }
                    >
                        <div className="aspect-square bg-[#F97316] w-pcvw-[14] rounded-full"></div>
                    </IconButton>
                </div>
            </div>
        </>
    )
}

export default EditMenu
