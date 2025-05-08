import { authMiddleware } from "@clerk/nextjs";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/_next/static/(.*)",
    "/favicon.ico",
  ],
  // Add clock skew tolerance
  clockSkewInSeconds: 30,
  debug: true, // Enable debug mode
});
 
export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your middleware
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // exclude static files
    "/",                           // include root
    "/(api|trpc)(.*)",            // include API routes
  ],
};
