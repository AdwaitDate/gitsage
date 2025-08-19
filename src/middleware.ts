import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/" // Keep homepage public if you want
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      // Redirect unauthenticated users to sign-in with /sync-user as the redirect target
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", "/sync-user");
      return Response.redirect(signInUrl.toString());
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
