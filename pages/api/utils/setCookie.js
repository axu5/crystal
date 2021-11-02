import { serialize } from "cookie";

export default function setCookie(
  res,
  token,
  tokenValue,
  options = { path: "/" }
) {
  // ...
  // setHeader(headerName: string, cookies: string | string[])
  // can use array for multiple cookies
  res.setHeader("Set-Cookie", serialize(token, tokenValue, options));

  return res;
}
