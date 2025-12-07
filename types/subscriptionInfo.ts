import type { Stripe } from "stripe";

export interface SubscriptionInfo {
  price_id: string;
  prod_id: string | Stripe.Product | Stripe.DeletedProduct;
  name: string;
  interval: Stripe.PriceListParams.Recurring.Interval;
  price: number;
}
