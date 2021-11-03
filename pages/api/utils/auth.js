import { decode, verify } from "jsonwebtoken";

import middleware from "./middleware";
import getDb from "../database";
import { clearTokens, createAccessToken } from "../tokenUtils";
import setCookie from "./setCookie";
import { Tokens } from "../constants";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

/**
 * @param {{ cookies: { accessToken: any; refreshToken: any; }; }} req
 * @param {import("next").NextApiResponse<any>} res
 *
 * @return {Promise} user
 */
export default async function auth(req, res, makeAccessToken = true) {
  await middleware(req, res);
  const { accessToken, refreshToken } = req.cookies;

  const validAt = await verifyAccess(accessToken);
  const validRt = await verifyRefresh(refreshToken);

  if (validRt) {
    if (!validAt) {
      const at =
        // @ts-ignore
        await createAccessToken(res, validRt.uuid);
      console.log("at :>> ", at);
      return decode(at);
    }

    // @ts-ignore
    return validAt;
  } else {
    clearTokens(res);
    throw "not logged in";
  }
}

async function verifyAccess(at) {
  try {
    const accessTokenPayload = verify(at, ACCESS_TOKEN_SECRET);

    return accessTokenPayload;
  } catch {
    return null;
  }
}

async function verifyRefresh(rt) {
  try {
    const { sessions } = await getDb();
    const refreshTokenPayload = verify(rt, REFRESH_TOKEN_SECRET);

    const session = await sessions.findOne({
      // @ts-ignore
      uuid: refreshTokenPayload.uuid,
    });

    if (!session) throw "session does not exist";

    // @ts-ignore
    if (refreshTokenPayload.tokenVersion !== session.tokenVersion)
      throw "invalid token version";

    return session;
  } catch (e) {
    return null;
  }
}
