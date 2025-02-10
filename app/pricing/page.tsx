'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";



import Stripe from 'stripe'
// Stripeクライアントを作成
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)



export default async function Pricing() {
    /**
     * Setting
     */
    const { push } = useRouter()

    // useEffect(() => {
    //     (async () => {
            const prices = await stripe.prices.list({
                limit: 3,
              });
        
            console.log(prices);
    //     })
    // }, [])


    /**
     * Functions
     */
    // サブスクリプションの支払画面へ遷移
    const onClickCheckout = async () => {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceID: "price_1Qpms9ClMx9BUZ3JQxVAlPkW", // priceIDを渡す price_ から始まるID
            }),
        }).then((data) => data.json())

        push(response.checkout_url)
    }
    
    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
            <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Base</h2>
                <p className="text-4xl font-medium text-gray-900 mb-6">¥500<span className="text-xl font-normal text-gray-600">per user / month</span></p>
                <form action="/create-checkout-session" method="POST">
                    <input type="hidden" name="lookup_key" value="price_1QpmrVClMx9BUZ3JExMMOzIk" />
                    <Button id="checkout-and-portal-button" type="submit">
                        Checkout
                    </Button>
                </form>
            </div>
            <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Puls</h2>
                <p className="text-4xl font-medium text-gray-900 mb-6">¥1000<span className="text-xl font-normal text-gray-600">per user / month</span></p>
                <form action="./api/checkout" method="POST">
                    <input type="hidden" name="lookup_key" value="price_1Qpms9ClMx9BUZ3JQxVAlPkW" />
                    <Button id="checkout-and-portal-button" type="submit">
                        Checkout
                    </Button>
                </form>
                <Button id="checkout-and-portal-button" type="submit" onClick={onClickCheckout}>
                    Checkout
                </Button>
            </div>
        </div>
    )
}