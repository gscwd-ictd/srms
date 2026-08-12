import { NextRequest, NextResponse } from "next/server";
import { RoleAbility } from "./lib/authentication/types";
import { verifyAccessToken } from "./components/functions/verifyAccessToken";

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
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // No tokens → Login
  if (!accessToken && !refreshToken) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  if (!accessToken) {
    // Let refresh-token logic handle this later
    return NextResponse.next();
  }

  const decodedToken = (await verifyAccessToken(accessToken)) as RoleAbility | null;

  if (!decodedToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Already logged in
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const appRole = decodedToken.apps.find((app) => app.name === process.env.NEXT_PUBLIC_APP_NAME);

  if (!appRole) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Superuser bypass
  if (appRole.isSuperuserAdmin) {
    return NextResponse.next();
  }

  // Check permission
  const hasFleetLayerPermission = appRole.roles?.some((role) => role.slug === "fleetLayer");

  if (hasFleetLayerPermission) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
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
