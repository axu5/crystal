// pages/_middleware.js

import { NextResponse } from "next/server";

export function middleware(request, _response) {
  if (request.url.includes("/api")) return NextResponse.next();

  const shouldRedirect =
    request.url.includes("/catalogue/") &&
    !request.url.startsWith("/catalogue");
  console.log(
    `request.url: ${request.url} ${
      shouldRedirect ? "redirecting..." : ""
    }`
  );

  const lastPart = request.url.split("/").pop();

  // return shouldRedirect
  //   ? NextResponse.redirect("/catalogue/" + lastPart)
  //   : NextResponse.next();
  return NextResponse.next();
}
