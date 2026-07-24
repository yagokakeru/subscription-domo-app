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

const PrompterMenu = ({
    fontSize,
    lineHeight,
    rotateX,
    rotateY,
    timer,
    onFontSizeChange,
    onLineHeightChange,
    onRotateXChange,
    onRotateYChange,
    onTimerChange,
}: {
    fontSize: number
    lineHeight: number
    rotateX: boolean
    rotateY: boolean
    timer: number
    onFontSizeChange: (value: number) => void
    onLineHeightChange: (value: number) => void
    onRotateXChange: (value: boolean) => void
    onRotateYChange: (value: boolean) => void
    onTimerChange: (value: number) => void
}) => {
    return (
        <div className="bg-background-surface rounded-full flex justify-between items-center mt-16-pc px-32-pc py-8-pc w-full">
            <div className="flex items-center gap-pcvw-[12]">
                <div className="flex items-center gap-pcvw-[12] border-r border-border-default pr-12-pc py-12-pc">
                    <IconButton>
                        <Link href="/protected">
                            <CircleArrowLeft className="h-auto" />
                        </Link>
                    </IconButton>
                </div>
                <div className="flex items-center gap-pcvw-[12] border-r border-border-default pr-12-pc py-12-pc">
                    <IconButton>
                        <Play className="h-auto" />
                    </IconButton>
                    <IconButton>
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
                        value={fontSize}
                        onValueChange={onFontSizeChange}
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
                        value={lineHeight}
                        onValueChange={onLineHeightChange}
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
                        value={timer}
                        onValueChange={onTimerChange}
                    />
                </div>
            </div>
            <div className="flex items-center gap-pcvw-[12]">
                <IconButton onClick={() => onRotateYChange(!rotateY)}>
                    <FlipHorizontal2 className="h-auto" />
                </IconButton>
                <IconButton onClick={() => onRotateXChange(!rotateX)}>
                    <FlipVertical2 className="h-auto" />
                </IconButton>
                <IconButton>
                    <Maximize className="h-auto" />
                </IconButton>
            </div>
        </div>
    )
}

export default PrompterMenu
