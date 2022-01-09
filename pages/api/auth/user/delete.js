import getDb from "../../database";
import { clearTokens } from "../../tokenUtils";
import auth from "../../utils/auth";

export default async function deleteUser(req, res) {
  const { users } = await getDb();
  try {
    const { uuid } = await auth(req, res);
    clearTokens(res);

    const data = await users.deleteOne({ uuid });

    res.status(200).json({ success: data.acknowledged });
  } catch (e) {
    res.status(401).json({ success: false, error: e });
  }
}
