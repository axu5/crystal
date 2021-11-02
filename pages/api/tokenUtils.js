import { sign, verify } from "jsonwebtoken";
import {
  defaultCookieOptions,
  TokenExpiration,
  Tokens,
} from "./constants";
import getDb from "./database";
import setCookie from "./utils/setCookie";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

/**
 * @param {import("next").NextApiResponse} res
 * @param {string} uuid
 */
export async function createAccessToken(res, uuid) {
  const { users } = await getDb();

  const user = await users.findOne({
    uuid,
  });

  const accessTokenPayload = {
    username: user.username,
    uuid: user.uuid,
  };

  const accessToken = sign(accessTokenPayload, ACCESS_TOKEN_SECRET, {
    expiresIn: TokenExpiration.Access * 1000,
  });

  try {
    const at = verify(accessToken, ACCESS_TOKEN_SECRET);
    console.log("at :>> ", at);
  } catch (error) {
    console.log("error :>> ", error);
  }

  res = setCookie(res, Tokens.Access, accessToken, {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Access * 1000,
  });

  return res;
}

/**
 * @param {import("next").NextApiResponse} res
 * @param {string} uuid
 */
export async function createRefreshToken(res, uuid) {
  const { users, sessions } = await getDb();
  const user = await users.findOne({ uuid });

  const refreshTokenPayload = {
    tokenVersion: 0,
    uuid: user.uuid,
  };
  await sessions.insertOne(refreshTokenPayload);

  const refreshToken = sign(
    refreshTokenPayload,
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: TokenExpiration.Refresh * 1000,
    }
  );
  res = setCookie(res, Tokens.Refresh, refreshToken, {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Refresh * 1000,
  });

  return res;
}
