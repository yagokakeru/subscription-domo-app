export type subData = {
    id: string
    stripe_customer_id: string
    stripe_subscription_id: string
    price_id: string
    status: string
    current_period_end: string
    cancel_at_period_end: boolean
    created_at: string
    updated_at: string
    user_id: string
    max_scripts: number
}

export type planData = {
    id: string
    stripe_price_id: string
    name: string
    description: string
    is_active: boolean
    sort_order: number
    is_recommended: boolean
    created_at: string
    updated_at: string
}

export type userPlan = subData & planData & { script_count: number }
