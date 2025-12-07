import Stripe from "stripe";

// Stripeクライアントを作成
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export async function getCheckoutUrl(priceID: string, customerID: string) {
  // 決算を作成
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceID,
        quantity: 1,
      },
    ],
    customer: customerID,
    mode: "subscription",
    success_url:
      "http://localhost:3000/sucsses/?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/pricing/",
  });

  return session.url;
}
