import bcrypt from "bcrypt";

import getDb from "../database";
import auth from "../utils/auth";
import { validatePassword } from "./validators";
import { saltRounds } from "../constants";
import { createRefreshToken } from "../tokenUtils";
import { fail, test } from "../utils/spamProtection";

export default async function changePass(req, res) {
  let uuid;
  try {
    let { uuid: _uuid } = await auth(req, res);
    uuid = _uuid;
  } catch (e) {
    res.status(401).json({ success: false, error: "not logged in" });
    return;
  }

  try {
    test(uuid);

    const { oldPass, newPass } = req.body;

    const { users, sessions } = await getDb();
    const user = await users.findOne({ uuid });

    if (!bcrypt.compareSync(oldPass, user.password))
      throw "old password is incorrect";

    validatePassword(newPass);

    if (oldPass === newPass)
      throw "new password cannot be same as old password";

    await users.updateOne(
      { uuid },
      {
        $set: {
          password: await bcrypt.hash(newPass, saltRounds),
        },
      }
    );

    await sessions.updateOne({ uuid }, { $inc: { tokenVersion: 1 } });
    await createRefreshToken(res, uuid);

    res.status(200).json({ success: true });
  } catch (e) {
    fail(uuid);
    res.status(200).json({ success: false, error: e });
  }
}
