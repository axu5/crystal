import getStripe from "../../../utils/getStripe";
import getDb from "../database";

//! TODO Save order to DB
export default async function checkoutSessions(req, res) {
  const { cart } = req.body; // cart is a list of id's, quantities, and sizes
  console.log(cart);

  const { products } = await getDb();

  // convert list of id's to list of item objects
  const items = await Promise.all(
    cart.map(async ({ id }) => {
      return products.findOne({ id });
    })
  );

  // convert list of item objects to list of item objects with stripe data
  /* FORMAT:
  [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          images: [item.image],
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      description: item.description,
      quantity: item.quantity,
    }
  ] */
  const stripeItems = await Promise.all(
    items.map(async item => {
      const currency = "eur";

      const { name, price, images, description } = item;
      const { quantity, size: _size } = cart.find(
        ({ id }) => id === item.id
      );
      const priceInCents = price;
      return {
        price_data: {
          currency,
          product_data: { name, images },
          unit_amount: priceInCents,
        },
        description: description,
        quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 10,
        },
      };
    })
  );

  const stripe = await getStripe();

  // const params = {
  //   submit_type: "pay",
  //   payment_method_types: ["card"],
  //   line_items: stripeItems,
  //   success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
  // };
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: stripeItems,
    mode: "payment",

    shipping_address_collection: {
      allowed_countries: ["MT", "FI"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "eur",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
    ],

    // success_url: "http://yoursite.com/order/success?session_id={CHECKOUT_SESSION_ID}"
    success_url:
      req.headers.origin +
      "/bag" +
      "?status=success&session_id={CHECKOUT_SESSION_ID}",
    cancel_url:
      req.headers.origin +
      "/bag" +
      "?status=cancel&session_id={CHECKOUT_SESSION_ID}",
  });

  res.json({ id: session.id });
}
