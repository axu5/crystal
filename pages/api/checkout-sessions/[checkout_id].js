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
    uuid = await auth(req, res);

    user = await users.findOne({ uuid });
  } catch {}

  const stripe = await getStripe();
  const checkout = await stripe.checkout.sessions.retrieve(
    checkout_id
  );

  console.log("checkout object", checkout);

  if (checkout.payment_status === "paid") {
    const embed = new MessageBuilder()
      .setTitle(`**New Order** (${checkout_id})`)
      .setColor(0x00b0f4)
      // !TODO TAKE THE ADDRESS OF THE USER
      .setDescription(
        `Order to be delivered to: **${JSON.stringify(
          checkout.shipping
        )}**!`
      )
      .setTimestamp();

    for (let i = 0; i < checkout.line_items.length; i++) {
      const item = checkout.line_items[i];
      embed.addField(
        `${item.name}`,
        `${item.quantity} x ${item.price}`
      );
    }

    const id = v4();

    // check if order already exists
    const oldOrder = await orders.findOne({ checkout_id });
    if (oldOrder) {
      return res.end();
    }

    await orders.insert({
      checkout_id,
      id,
      checkout,
      user,
      items: checkout.line_items,
      createdAt: new Date(),
    });

    hook.send(embed);
  }

  return res.end();
}
