import { NextResponse } from "next/server";
import { auth } from "./services/auth";
import { APP_ROUTES } from "./utils/app_routes";

const PUBLIC_ROUTES = [
  APP_ROUTES.HOME,
  APP_ROUTES.VERIFY_EMAIL,
  '/auth/linkedin',
  APP_ROUTES.RESET_PASSWORD,
  APP_ROUTES.LOGIN,
  APP_ROUTES.SIGNUP_SELECT,
  APP_ROUTES.SIGNUP,
  APP_ROUTES.CONTACT_US,
];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const pathname = nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, nextUrl));
  }

  if (session && isPublicRoute) {
    const role = session.user?.role;

    switch (role) {
      case 1:
        return NextResponse.redirect(
          new URL(APP_ROUTES.CLIENT.DASHBOARD, nextUrl)
        );
      case 2:
        return NextResponse.redirect(
          new URL(APP_ROUTES.CONSULTANT.DASHBOARD, nextUrl)
        );
      case 3:
        return NextResponse.redirect(
          new URL(APP_ROUTES.ADMIN.DASHBOARD, nextUrl)
        );
      default:
        return NextResponse.next(); // ✅ HOME pe loop nahi hoga
    }
}

  if (session) {
    const role = session.user?.role;

    const isConsultantRoute = pathname.startsWith("/consultant");
    const isClientRoute = pathname.startsWith("/client");
    const isAdminRoute = pathname.startsWith("/admin");

    if (isConsultantRoute && role !== 2)
      return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, nextUrl));

    if (isClientRoute && role !== 1)
      return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, nextUrl));

    if (isAdminRoute && role !== 3)
      return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)).*)",
  ],
};
