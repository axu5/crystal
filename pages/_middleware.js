// pages/_middleware.js

import { NextResponse } from "next/server";

export function middleware(request, _response) {
  const shouldRedirect = request.url.includes("/catalogue");

  return shouldRedirect
    ? NextResponse.redirect("/catalogue")
    : NextResponse.next();
}
