import { NextResponse } from "next/server";
import { auth } from "./auth";
import { APP_ROUTES } from "./utils/app_routes";

const PUBLIC_ROUTES = [APP_ROUTES.LOGIN, APP_ROUTES.SIGNUP, APP_ROUTES.HOME];

export default auth((req) => {
  const { nextUrl } = req;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const session = req.auth;

  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, nextUrl));
  } else if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, nextUrl));
  } else return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)).*)",
  ],
};
