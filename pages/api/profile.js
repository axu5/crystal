import auth from "./utils/auth";

export default async function profile(req, res) {
  try {
    const user = await auth(req, res);

    res.status(200).send(user);
  } catch (e) {
    res.status(401).json({ error: e });
  }
}
