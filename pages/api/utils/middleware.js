import cookieParser from "cookie-parser";
import cors from "cors";

import runMiddleware from "./runMiddleware";

export default async function middleware(req, res) {
  await runMiddleware(req, res, cookieParser());
  await runMiddleware(
    req,
    res,
    cors({
      credentials: true,
      origin: process.env.BASE_URI,
    })
  );
}
