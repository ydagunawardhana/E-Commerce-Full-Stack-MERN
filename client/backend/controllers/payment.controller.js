import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products found in cart" });
    }

    const lineItems = products
      .map((item) => {
        if (!item.productId) return null;

        let images = [];
        if (item.productId.images && item.productId.images.length > 0) {
          const img = item.productId.images[0];

          if (img.startsWith("http")) {
            images.push(img);
          }
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.productId.name || "Product",
              images: images,
            },
            unit_amount: Math.round(parseInt(item.productId.price) * 100),
          },
          quantity: item.quantity,
        };
      })
      .filter((item) => item !== null);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      ui_mode: "embedded",
      return_url: `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
};
