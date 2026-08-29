import Stripe from 'stripe'

export const stripeClient = () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY as string)
}
