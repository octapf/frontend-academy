import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/jwt";
import { parseTrackParam } from "@/lib/track";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return redirectToLogin(request);
  }
  try {
    await verifySessionToken(token);
    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  const track = parseTrackParam(request.nextUrl.searchParams.get("track"));
  if (track) {
    url.searchParams.set("track", track);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/learn/:path*", "/reference/:path*"],
};
