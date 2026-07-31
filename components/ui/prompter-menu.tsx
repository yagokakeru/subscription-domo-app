'use client'

import {
    CircleArrowLeft,
    Play,
    RotateCcw,
    ALargeSmall,
    TableOfContents,
    Clock,
    AlarmClock,
    FlipHorizontal2,
    FlipVertical2,
    Maximize,
} from 'lucide-react'
import Link from 'next/link'
import { IconButton } from '@/components/ui/icon-button'
import Slider from '@/components/ui/slider'
import { useState } from 'react'

const PrompterMenu = ({
    prompterSetting,
    onPrompterSettingChange,
    onStartScroll,
    onResetScroll,
}: {
    prompterSetting: {
        fontSize: number
        lineHeight: number
        rotateX: boolean
        rotateY: boolean
        timer: number
        scrollSpeed: number
    }
    onPrompterSettingChange: (value: {
        fontSize: number
        lineHeight: number
        rotateX: boolean
        rotateY: boolean
        timer: number
        scrollSpeed: number
    }) => void
    onStartScroll: () => void
    onResetScroll: () => void
}) => {
    const [fullScreen, setFullScreen] = useState<boolean>(false)

    const handleFullScreen = async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen()
            setFullScreen(true)
        } else {
            await document.exitFullscreen()
            setFullScreen(false)
        }
    }

    return (
        <div className="bg-background-surface rounded-full flex justify-between items-center px-32-pc py-8-pc w-full">
            <div className="flex items-center gap-pcvw-[12]">
                <div className="flex items-center gap-pcvw-[12] border-r border-border-default pr-12-pc py-12-pc">
                    <IconButton>
                        <Link href="/protected">
                            <CircleArrowLeft className="h-auto" />
                        </Link>
                    </IconButton>
                </div>
                <div className="flex items-center gap-pcvw-[12] border-r border-border-default pr-12-pc py-12-pc">
                    <IconButton onClick={onStartScroll}>
                        <Play className="h-auto" />
                    </IconButton>
                    <IconButton onClick={onResetScroll}>
                        <RotateCcw className="h-auto" />
                    </IconButton>
                </div>
                <div className="flex items-center gap-pcvw-[12] border-r border-border-default pr-12-pc py-12-pc">
                    <IconButton>
                        <ALargeSmall className="h-auto" />
                    </IconButton>
                    <Slider
                        defaultValue={48}
                        unit="px"
                        max={140}
                        min={48}
                        step={1}
                        value={prompterSetting.fontSize}
                        onValueChange={(value) =>
                            onPrompterSettingChange({
                                ...prompterSetting,
                                fontSize: value,
                            })
                        }
                    />
                </div>
                <div className="flex items-center gap-pcvw-[12] border-r border-border-default pr-12-pc py-12-pc">
                    <IconButton>
                        <TableOfContents className="h-auto" />
                    </IconButton>
                    <Slider
                        defaultValue={1.5}
                        unit="行"
                        max={5}
                        min={1}
                        step={0.1}
                        value={prompterSetting.lineHeight}
                        onValueChange={(value) =>
                            onPrompterSettingChange({
                                ...prompterSetting,
                                lineHeight: value,
                            })
                        }
                    />
                </div>
                <div className="flex items-center gap-pcvw-[12] border-r border-border-default pr-12-pc py-12-pc">
                    <IconButton>
                        <Clock className="h-auto" />
                    </IconButton>
                    <Slider
                        defaultValue={1}
                        unit=""
                        max={20}
                        min={1}
                        step={1}
                        value={prompterSetting.scrollSpeed}
                        onValueChange={(value) =>
                            onPrompterSettingChange({
                                ...prompterSetting,
                                scrollSpeed: value,
                            })
                        }
                    />
                </div>
                <div className="flex items-center gap-pcvw-[12] border-r border-border-default pr-12-pc py-12-pc">
                    <IconButton>
                        <AlarmClock className="h-auto" />
                    </IconButton>
                    <Slider
                        defaultValue={0}
                        unit="秒"
                        max={60}
                        min={0}
                        step={1}
                        value={prompterSetting.timer}
                        onValueChange={(value) =>
                            onPrompterSettingChange({
                                ...prompterSetting,
                                timer: value,
                            })
                        }
                    />
                </div>
            </div>
            <div className="flex items-center gap-pcvw-[12]">
                <IconButton
                    active={prompterSetting.rotateY}
                    onClick={() =>
                        onPrompterSettingChange({
                            ...prompterSetting,
                            rotateY: !prompterSetting.rotateY,
                        })
                    }
                >
                    <FlipHorizontal2 className="h-auto" />
                </IconButton>
                <IconButton
                    active={prompterSetting.rotateX}
                    onClick={() =>
                        onPrompterSettingChange({
                            ...prompterSetting,
                            rotateX: !prompterSetting.rotateX,
                        })
                    }
                >
                    <FlipVertical2 className="h-auto" />
                </IconButton>
                <IconButton active={fullScreen} onClick={handleFullScreen}>
                    <Maximize className="h-auto" />
                </IconButton>
            </div>
        </div>
    )
}

export default PrompterMenu
