import getDb from "../database";
import auth from "../utils/auth";

export async function validateEmail(req, res) {
  let tokenUUID;
  try {
    const { uuid: _uuid } = await auth(req, res);
    tokenUUID = _uuid;
  } catch {
    res.status(401).json({ success: false });
    return;
  }

  try {
    const { uuid, token } = req.body;
    if (tokenUUID !== uuid) throw "you cannot verify this account";

    const { users } = await getDb();
    const user = await users.findOne({ uuid });
    if (!user) throw "invalid uuid";
    if (user.emailToken !== token) throw "invalid token";

    await users.updateOne({ uuid }, { $set: { activated: true } });
  } catch (e) {
    res.status(200).json({ success: false, error: e });
  }
}
