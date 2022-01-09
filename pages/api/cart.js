import getDb from "./database";
import auth from "./utils/auth";

export default async function authGetUser(req, res) {
  try {
    const user = await auth(req, res);

    switch (req.method) {
      case "POST":
        await postCart(req, res, user);
        break;
    }
  } catch (e) {
    res.status(400).send({ success: false, error: e });
  }
}

// update cart
async function postCart(req, res, { uuid }) {
  const { cart } = JSON.parse(req.body);
  if (!cart) {
    return res.json({ success: false });
  }

  const { users } = await getDb();

  try {
    await users.updateOne({ uuid: uuid }, { $set: { cart } });

    res.json({ success: true });
  } catch (e) {
    // TODO: don't leak error to user
    res.json({ success: false, error: e });
  }
}
