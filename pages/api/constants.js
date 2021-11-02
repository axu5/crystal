export const Tokens = {
  Access: "accessToken",
  Refresh: "refreshToken",
};

export const TokenExpiration = {
  // seconds
  Access: 5,
  // seconds
  Refresh: 7 * 24 * 60 * 60,
};

export const defaultCookieOptions = {
  httpOnly: true,
  secure: false, // process.env.isProduction, // HTTPS ENABLED
  sameSite: "lax", // process.env.isProduction ? "strict" : "lax",
  // domain: `${process.env.BASE_DOMAIN}:${process.env.PORT}`,
  path: "/",
};
