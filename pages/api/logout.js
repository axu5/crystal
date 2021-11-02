import { Tokens } from "./constants";
import auth from "./utils/auth";
import setCookie from "./utils/setCookie";

export default async function login(req, res) {
  try {
    await auth(req, res);
    setCookie(res, Tokens.Access, "");
    setCookie(res, Tokens.Refresh, "");

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(401).json({ success: false, error: e });
  }
}
