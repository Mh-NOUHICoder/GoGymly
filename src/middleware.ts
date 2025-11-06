import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/account(.*)",
  "/admin(.*)",
  "/settings(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL("/", req.url); // Redirect to home or sign-in page
    signInUrl.searchParams.set("redirect_url", req.url);
    signInUrl.searchParams.set("message", "Please sign in to access this page");
    signInUrl.searchParams.set("message_type", "warning");
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};