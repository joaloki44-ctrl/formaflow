import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Routes accessibles sans authentification
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/courses",
    "/courses/(.*)", // Matches all course detail pages
  ],
  // Routes ignorées par Clerk (ex: webhooks)
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
  ],
  afterAuth(auth, req) {
    // Si l'utilisateur est déjà connecté et tente d'aller sur /sign-in ou /sign-up
    // le rediriger vers /dashboard
    if (auth.userId && (req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/sign-up")) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
