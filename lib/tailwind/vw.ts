import plugin from 'tailwindcss/plugin'
import { DESIGN_SIZES } from '../consts/designSize'

const PC_WIDTH = DESIGN_SIZES.PC_WIDTH
const SP_WIDTH = DESIGN_SIZES.SP_WIDTH

export const toMinVw = (value: string | number, baseWidth: number) => {
    const px = Number(value)

    if (!Number.isNaN(px)) {
        return `min(${(px / baseWidth) * 100}vw, ${px}px)`
    }

    return `min(calc(var(${value}) / ${baseWidth} * 100vw), calc(var(${value}) * 1px))`
}

export const pcVw = (value: string | number) => toMinVw(value, PC_WIDTH)
export const spVw = (value: string | number) => toMinVw(value, SP_WIDTH)

const createUtility = (property: string, baseWidth: number) => {
    return (value: string) => ({
        [property]: toMinVw(value, baseWidth),
    })
}

const createShadowUtility = (baseWidth: number) => (value: string) => ({
    boxShadow: `0 0 ${toMinVw(value, baseWidth)} 0 var(--tw-shadow-color, var(--colorShadowDefault))`,
})

export const vwPlugin = plugin(({ matchUtilities }) => {
    matchUtilities(
        {
            'border-pcvw': createUtility('borderWidth', PC_WIDTH),
            'border-t-pcvw': createUtility('border-top-width', PC_WIDTH),
            'text-pcvw': createUtility('fontSize', PC_WIDTH),
            'gap-pcvw': createUtility('gap', PC_WIDTH),
            'w-pcvw': createUtility('width', PC_WIDTH),
            'h-pcvw': createUtility('height', PC_WIDTH),
            'max-h-pcvw': createUtility('max-height', PC_WIDTH),
            'pt-pcvw': createUtility('padding-top', PC_WIDTH),
            'shadow-pcvw': createShadowUtility(PC_WIDTH),
            'right-pcvw': createUtility('right', PC_WIDTH),

            'border-spvw': createUtility('borderWidth', SP_WIDTH),
            'border-t-spvw': createUtility('border-top-width', SP_WIDTH),
            'text-spvw': createUtility('fontSize', SP_WIDTH),
            'gap-spvw': createUtility('gap', SP_WIDTH),
            'w-spvw': createUtility('width', SP_WIDTH),
            'h-spvw': createUtility('height', SP_WIDTH),
            'max-h-spvw': createUtility('max-height', SP_WIDTH),
            'pt-spvw': createUtility('padding-top', SP_WIDTH),
            'shadow-spvw': createShadowUtility(SP_WIDTH),
            'right-spvw': createUtility('right', SP_WIDTH),
        },
        {
            supportsNegativeValues: false,
        }
    )
})
