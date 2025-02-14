'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

import type { SubscriptionInfo } from '@/app/types';


export default function Pricing() {
    /**
     * Setting
     */
    const [ subscriptionInfo, setSubscriptionInfo ] = useState<any>([]) // Subscription情報を保存
    const { push } = useRouter()

    useEffect(() => {
        // サブスクリプションの情報を取得
        ;(async () => {
            const response = await fetch('/api/getSubscriptionInfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }).then((data) => data.json())

            setSubscriptionInfo(response.subscriptionInfo)
        })()
    }, [])

    /**
     * Functions
     */
    // サブスクリプションの支払画面へ遷移
    const onClickCheckout = async (priceId: SubscriptionInfo["price_id"]) => {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceID: priceId, // priceIDを渡す price_ から始まるID
            }),
        }).then((data) => data.json())

        push(response.checkout_url)
    }
    
    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
            {
                subscriptionInfo.map((item: SubscriptionInfo, index: number) => {
                    return(
                        <div key={index}>
                            <h2 className="text-2xl font-medium text-gray-900 mb-2">{item.name}</h2>
                            <p className="text-4xl font-medium text-gray-900 mb-6">¥{item.price}<span className="text-xl font-normal text-gray-600">per user / month</span></p>
                            <Button id="checkout-and-portal-button" type="submit" onClick={() => onClickCheckout(item.price_id)}>Checkout</Button>
                        </div>
                    )
                })
            }
        </div>
    )
}