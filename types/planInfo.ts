import Stripe from 'stripe'

export type planInfo = {
    id: number
    name: string
    description: string
    isRecommended: boolean
    priceId: string | null
    amount: number
    currency: string
    interval: Stripe.Price.Recurring.Interval
}
