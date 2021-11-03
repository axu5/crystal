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

  setCookie(res, Tokens.Access, accessToken, {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Access,
  });

  return accessToken;
}

/**
 * @param {import("next").NextApiResponse} res
 * @param {string} uuid
 */
export async function createRefreshToken(res, uuid) {
  const { users, sessions } = await getDb();
  const user = await users.findOne({ uuid });

  let session = await sessions.findOne({ uuid });

  if (!session) {
    session = {
      tokenVersion: 0,
      uuid: user.uuid,
    };
    await sessions.insertOne(session);
  }

  const refreshToken = sign(session, REFRESH_TOKEN_SECRET, {
    expiresIn: TokenExpiration.Refresh * 1000,
  });

  setCookie(res, Tokens.Refresh, refreshToken, {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Refresh,
  });

  return refreshToken;
}

export function clearTokens(res) {
  const invalidatedOptions = {
    ...defaultCookieOptions,
    expires: new Date(0),
    token: "deleted",
  };
  setCookie(res, Tokens.Access, "deleted", invalidatedOptions);
  setCookie(res, Tokens.Refresh, "deleted", invalidatedOptions);
}
