import getStripe from "../../../utils/getStripe";
import getDb from "../database";
import auth from "../utils/auth";

//! TODO Save order to DB
export default async function checkoutSessions(req, res) {
  const { cart } = req.body; // cart is a list of id's, quantities, and sizes

  const { products, orders, users } = await getDb();

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
      /*
       * Malta
       * Germany
       * Denmark
       * Sweden
       * Finland
       * France
       * Poland
       */
      allowed_countries: [
        "MT",
        "DE",
        "DK",
        "SK",
        "FI",
        "FR",
        "PL",
        // "TR",
        // "AU",
        // "AT",
        // "BE",
        // "BG",
        // "CA",
        // "CY",
        // "CZ",
        // "ES",
        // "EE",
        // "GR",
        // "HR",
        // "HU",
        // "IT",
        // "IN",
        // "IE",
        // "IS",
        // "KR",
        // "LT",
        // "LU",
        // "LV",
        // "NL",
        // "NO",
        // "PT",
        // "RU",
        // "RO",
        // "SE",
        // "US",
      ],
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
      "/" +
      "?status=success&session_id={CHECKOUT_SESSION_ID}",
    cancel_url:
      req.headers.origin +
      "/bag" +
      "?status=cancel&session_id={CHECKOUT_SESSION_ID}",
  });

  const orderObject = {
    order_id: session.id,
    status: "pending",
    checkout: session,
    user: {},
    createdAt: new Date(),
    items: cart,
  };

  try {
    const { uuid } = await auth(req, res);
    const user = await users.findOne({ uuid });

    orderObject.user = {
      username: user.username,
      uuid: user.uuid,
    };

    await orders.insertOne(orderObject);
    await users.updateOne(
      { uuid },
      { $push: { orders: orderObject.order_id } }
    );
    res.json({ id: session.id });
  } catch (e) {
    await orders.insertOne(orderObject);
    res.json({ id: session.id });
  }
}
