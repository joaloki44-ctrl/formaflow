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
    "/courses/(.*)", // Toutes les pages de détails de cours
  ],
  // Routes ignorées par Clerk
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
