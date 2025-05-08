import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/about",
  ],
  
  // Routes that can be accessed while loading the auth state
  ignoredRoutes: [
    "/api/webhook",
    "/api/webhook/clerk",
  ],

  // Add more tolerance for clock skew
  clockSkewInSeconds: 60,
  
  // Keep debug mode on to track issues
  debug: true,
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
