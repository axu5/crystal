import { v4 } from "uuid";
import { Webhook, MessageBuilder } from "discord-webhook-node";

import getStripe from "../../../utils/getStripe";
import getDb from "../database";
import auth from "../utils/auth";

const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL);

//! TODO: make sure order is valid before sending message
export default async function success(req, res) {
  const { checkout_id } = req.query;
  const { orders, users } = await getDb();

  let uuid = null;
  let user = null;
  try {
    const { uuid: _tmp } = await auth(req, res);
    uuid = _tmp;
    user = await users.findOne({ uuid });
  } catch (e) {
    console.log("not logged in");
  }

  const stripe = await getStripe();
  const checkout = await stripe.checkout.sessions.retrieve(
    checkout_id
  );

  if (checkout.payment_status === "paid") {
    // check if order already exists return {success:false}
    const oldOrder = await orders.findOne({ checkout_id });
    if (oldOrder && oldOrder.payment_status === "paid") {
      return res.send({ success: false });
    }

    console.log("checkout", checkout);

    let embed = new MessageBuilder()
      .setTitle(`**New Order** (${checkout_id})`)
      .setText(
        `https://dashboard.stripe.com/test/payment/${checkout.payment_intent}`
      )
      .setColor(0x00b0f4)
      .addField(`name`, checkout.shipping.name)
      .addField(`email`, checkout.customer_details.email)
      .setTimestamp();

    for (const [title, value] of Object.entries(
      checkout.shipping.address
    )) {
      embed = embed.addField(`${title}`, `${value}`, true);
    }

    if (user) {
      await users.updateOne(
        { uuid },
        { $push: { orders: checkout_id } }
      );
      await users.updateOne({ uuid }, { $set: { cart: [] } });
    }

    console.log("sending...");
    await hook.send(embed);
  }

  return res.send({ success: checkout.payment_status === "paid" });
}
