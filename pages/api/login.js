import bcrypt from "bcrypt";

import getDb from "./database";
import { createAccessToken, createRefreshToken } from "./tokenUtils";
import middleware from "./utils/middleware";

const genericError = "incorrect username or password";

export default async function login(req, res) {
  try {
    await middleware(req, res);

    const { username, password } = req.body;

    const { users } = await getDb();

    const user = await users.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      // throw "incorrect username";
      throw genericError;
    }

    const { password: userPassword, uuid } = user;

    if (!bcrypt.compare(password, userPassword)) {
      // throw "incorrect password";
      throw genericError;
    }

    await createAccessToken(res, uuid);
    await createRefreshToken(res, uuid);

    res.status(200).send({ success: true });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    } else {
      res.status(418).json({ success: false, error: e });
    }
  }
}
