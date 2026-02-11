import { NextRequest, NextResponse } from "next/server";
import { TrackSolidAuth } from "./lib/tracksolid/types";
import axios from "axios";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Regex to match Next.js static files (chunks, scripts, styles)
  const staticFileRegex = /^\/docs\/_next\/static\/chunks\/.+/;

  // If the request matches the static file pattern, allow it to pass through
  if (staticFileRegex.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/legacy")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Your other middleware logic here...

  // Tracksolid login to set accessToken and refreshToken
  const cookieStore = await cookies();

  if (!cookieStore.has("accessToken")) {
    try {
      const response = await axios.post<TrackSolidAuth>(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracksolid/access_token`,
      );

      cookieStore.set("accessToken", response?.data?.result?.accessToken);
      // cookieStore.set("refreshToken", response?.data?.result?.refreshToken);

      return NextResponse.redirect(new URL("/fleet", req.url));

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/docs/:path*",
  ],
};
