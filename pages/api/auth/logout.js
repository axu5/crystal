import { clearTokens } from "../tokenUtils";
import auth from "../utils/auth";

export default async function login(req, res) {
  try {
    await auth(req, res);
    clearTokens(res);

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(401).json({ success: false, error: e });
  }
}
