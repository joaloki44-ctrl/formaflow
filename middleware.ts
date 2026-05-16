import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/stripe/connect/return",
    "/api/stripe/connect/refresh",
    "/courses",
    "/courses/(.*)",
  ],
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
  ],
  afterAuth(auth, req) {
    const path = req.nextUrl.pathname;

    // Redirect signed-in users away from auth pages to onboarding
    if (auth.userId && (path === "/sign-in" || path === "/sign-up")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Protect all private sections
    const privateRoutes = ["/dashboard", "/org-admin", "/learn", "/my-courses", "/onboarding", "/org"];
    const isPrivate = privateRoutes.some((r) => path === r || path.startsWith(r + "/"));

    if (!auth.userId && isPrivate) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
