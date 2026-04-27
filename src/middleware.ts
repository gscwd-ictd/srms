import { NextRequest, NextResponse } from "next/server";
import { RefreshTokenBody } from "./components/types";
import { postAuthRefresh } from "./components/helpers/auth-helper";
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

  if (accessToken) {
    const decodedToken = await verifyAccessToken(accessToken);

    if (decodedToken) {
      if (req.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.next();
      }
    }
  }

  if (refreshToken) {
    const data: RefreshTokenBody = {
      accessToken: accessToken!,
      refreshToken: refreshToken!,
    };

    const { error, result } = await postAuthRefresh(data);

    if (error) {
      console.log("error result: ", result);
    } else {
      return NextResponse.next();
    }
  }

  // Redirect to /login if no  access token and refresh token
  if (!accessToken && !refreshToken && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Tracksolid login to set tsAccessToken and tsRefreshToken
  // if (!cookieStore.has("tsAccessToken")) {
  //   const { error, result } = await postTsAuth("/v1/auth", {});

  //   if (error) {
  //     console.log("error result: ", result);
  //   } else {
  //     console.log("TS access and refresh set");
  //   }
  // }

  // try {
  //   const response = await axios.post<TrackSolidAuth>(
  //     `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracksolid/access_token`,
  //   );
  //   cookieStore.set("tsAccessToken", response?.data?.result?.accessToken);
  //   cookieStore.set("refreshToken", response?.data?.result?.refreshToken);

  // } catch (error) {
  //   console.log(error);
  //   throw error;
  // }
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
