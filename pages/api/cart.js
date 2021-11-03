import getDb from "./database";
import auth from "./utils/auth";

export default async function authGetUser(req, res) {
  try {
    const user = await auth(req, res);

    switch (req.method) {
      case "GET":
        await getCart(req, res, user);
        break;
      case "POST":
        await postCart(req, res, user);
        break;
    }
  } catch (e) {
    res.status(400).send({ success: false, error: e });
  }
}

async function getCart(req, res, user) {
  const returnPayload = {
    // @ts-ignore
    username: user.username,
    // @ts-ignore
    cart: user.cart,
  };

  res.status(200).send(returnPayload);
}
async function postCart(req, res, user) {
  const { cart } = req.body;

  const { users } = await getDb();

  await users.updateOne({ uuid: user.uuid }, { $set: { cart } });

  res.json({ success: true });
}
