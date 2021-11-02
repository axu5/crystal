import { verify } from "jsonwebtoken";

import middleware from "./middleware";
import getDb from "../database";
import { createAccessToken } from "../tokenUtils";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

/**
 * @param {{ cookies: { accessToken: any; refreshToken: any; }; }} req
 * @param {import("next").NextApiResponse<any>} res
 */
export default async function auth(req, res) {
  await middleware(req, res);
  const { accessToken, refreshToken } = req.cookies;
  const { sessions } = await getDb();

  console.log(`accessToken`, '"' + accessToken + '"');
  console.log(`refreshToken`, '"' + refreshToken + '"');

  try {
    const accessTokenPayload = verify(
      accessToken,
      ACCESS_TOKEN_SECRET
    );

    return accessTokenPayload;
  } catch (e) {
    try {
      const refreshTokenPayload = verify(
        refreshToken,
        REFRESH_TOKEN_SECRET
      );

      const session = await sessions.findOne({
        // @ts-ignore
        uuid: refreshTokenPayload.uuid,
      });

      // @ts-ignore
      if (refreshTokenPayload.tokenVersion !== session.tokenVersion)
        throw "invalid token version";

      const user = await createAccessToken(res, session.uuid);

      return user;
    } catch (e) {
      // res.status(401).json({ error: e });
      throw "not logged in";
    }
  }
}
