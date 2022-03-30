// pages/_middleware.js

import { NextResponse } from "next/server";

export function middleware(_request, _response) {
  return NextResponse.next();
}
