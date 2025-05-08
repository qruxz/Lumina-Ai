import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  ignoredRoutes: ["/api/webhook/clerk"],
  debug: true,
  clockSkewInSeconds: 30  // Add tolerance for clock skew
});
