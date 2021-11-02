import auth from "./utils/auth";

export default async function authGetUser(req, res) {
  try {
    const user = await auth(req, res);

    const returnPayload = {
      // @ts-ignore
      username: user.username,
      // @ts-ignore
      cart: user.cart,
    };

    res.status(200).send({ user: returnPayload });
  } catch (e) {
    res.status(401).send({ user: null });
  }
}
