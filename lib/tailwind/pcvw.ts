import plugin from 'tailwindcss/plugin'

const PC_WIDTH = 1440

const toMinVw = (value: string) => {
    const px = Number(value)

    return `min(${(px / PC_WIDTH) * 100}vw, ${px}px)`
}

const createUtility = (property: string) => {
    return (value: string) => ({
        [property]: toMinVw(value),
    })
}

const createShadowUtility = (value: string) => ({
    boxShadow: `0 0 ${toMinVw(value)} 0 var(--tw-shadow-color, var(--colorShadowDefault))`,
})

export const pcvwPlugin = plugin(({ matchUtilities }) => {
    matchUtilities(
        {
            'text-pcvw': createUtility('fontSize'),

            'gap-pcvw': createUtility('gap'),

            'w-pcvw': createUtility('width'),

            'h-pcvw': createUtility('height'),
            'max-h-pcvw': createUtility('max-height'),

            'shadow-pcvw': createShadowUtility,
        },
        {
            supportsNegativeValues: false,
        }
    )
})
