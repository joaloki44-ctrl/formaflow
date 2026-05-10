import { authMiddleware } from "@clerk/nextjs";

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
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
