'use client'

import * as React from 'react'
import { Slider } from 'radix-ui'

const SliderDemo = ({
    defaultValue,
    unit,
    max,
    min,
    step,
    value,
    onValueChange,
}: {
    defaultValue: number
    unit: string | undefined
    max: number
    min: number
    step: number
    value?: number
    onValueChange?: (value: number) => void
}) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const currentValue = value ?? internalValue

    const handleValueChange = ([nextValue]: number[]) => {
        setInternalValue(nextValue)
        onValueChange?.(nextValue)
    }

    return (
        <form className="flex items-center gap-pcvw-[8]">
            <Slider.Root
                className="relative flex h-pcvw-[4] w-pcvw-[64] touch-none select-none items-center"
                value={[currentValue]}
                max={max}
                min={min}
                step={step}
                onValueChange={handleValueChange}
            >
                <Slider.Track className="relative h-[3px] grow rounded-full bg-background-surface-active">
                    <Slider.Range className="absolute h-full rounded-full bg-background-primary" />
                </Slider.Track>
                <Slider.Thumb
                    className="aspect-square block rounded-full bg-background-primary w-pcvw-[10] hover:bg-background-primary-hover active:bg-background-primary-active focus:outline-none"
                    aria-label="Volume"
                />
            </Slider.Root>
            <span className="min-w-pcvw-[24] text-center text-pcvw-[12] text-text-primary">
                {currentValue}
                {unit && ` ${unit}`}
            </span>
        </form>
    )
}

export default SliderDemo
