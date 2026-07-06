import { NextRequest, NextResponse } from "next/server";
// import { RefreshTokenBody } from "./components/types";
// import { postAuthRefresh } from "./components/helpers/auth-helper";
import { verifyAccessToken } from "./components/functions/verifyAccessToken";
// import { getUserRoles } from "./app/helpers/roles-helper";
import { ApplicationRole, RoleAbility, RoleDetail } from "./lib/authentication/types";
import { isEmpty } from "./utils/isEmpty";

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

  // Redirect to /login if no  access token and refresh token
  if (!accessToken && !refreshToken && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken) {
    const decodedToken = (await verifyAccessToken(accessToken)) as RoleAbility;

    if (decodedToken) {
      if (req.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        const applicationRole = decodedToken.apps.filter(
          (app: ApplicationRole) => app.name === process.env.NEXT_PUBLIC_APP_NAME,
        );

        const appRoles = applicationRole[0] || ({} as ApplicationRole);

        // console.log("appRoles: ", appRoles);

        if (appRoles.isSuperuserAdmin || !isEmpty(appRoles.roles)) {
          appRoles.roles.map((permission: RoleDetail) => {
            if (permission.slug === "fleetLayer") {
              console.log("BOOM: ", permission.slug);
              return NextResponse.next();
            }
          });
        }
      }
    }
  }
}
// try {
// const response = await getUserRoles();
// return NextResponse.next();
// console.log("user roles: waw");

//  const applicationRole = response.apps.filter(
//       (app: ApplicationRole) => app.name === process.env.NEXT_PUBLIC_APP_NAME,
//     );

//     const appRoles = applicationRole[0] || ({} as ApplicationRole);

//   cookieStore.set("tsAccessToken", response?.data?.result?.accessToken);
// cookieStore.set("refreshToken", response?.data?.result?.refreshToken);
//   } catch (error) {
//     console.log("error", error);
//     throw error;
//   }
// }

// const tsAccessToken = req.cookies.get("tsAccessToken")?.value;
// const tsRefreshToken = req.cookies.get("tsRefreshToken")?.value;

// PARK SA KAY UNAHON ANG AT
// if (refreshToken) {
//   const data: RefreshTokenBody = {
//     accessToken: accessToken!,
//     refreshToken: refreshToken!,
//   };

//   const { error, result } = await postAuthRefresh(data);

//   if (error) {
//     console.log("error result: ", result);
//   } else {
//     return NextResponse.next();
//   }
// }

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
//

// } catch (error) {
//   console.log(error);
//   throw error;
// }

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
