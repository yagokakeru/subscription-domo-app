export type planInfo = {
    id: number
    name: string
    description: string
    isRecommended: boolean
    planFeatures: planFeature[]
    priceId: string | null
    amount: number
    currency: string
    interval: string
}

export type planFeature = {
    enabled: boolean
    text: string
}
