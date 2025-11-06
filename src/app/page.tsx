"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronsDown } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignIn, SignUp, UserButton } from "@clerk/nextjs";
import { useUser, useClerk } from "@clerk/nextjs";
import { getCurrentUserFromSupabase } from "@/actions/users";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // sheet open state and auth mode
  const [openSheet, setOpenSheet] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  // small UI notice message (can be swapped to a toast library)
  const [notice, setNotice] = useState<string | null>(null);

  // Clerk hooks
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // focus the first control in sheet for keyboard users
  const firstControlRef = useRef<HTMLButtonElement | null>(null);


  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // if sheet is open, close it
      if (openSheet) setOpenSheet(false);

      // optional friendly notice
      setNotice("Signed in successfully — redirecting to your account…");
      setTimeout(() => setNotice(null), 2500);

      // Redirect to /account
      router.push("/account");
    }
  }, [isLoaded, isSignedIn, openSheet, router]);

  // read query message once (same as your previous code)
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setNotice(message);
      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, "", cleanUrl);
      // hide after a few seconds
      setTimeout(() => setNotice(null), 4000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user becomes signed in while the sheet is open, close it and show notice
  useEffect(() => {
    if (isLoaded && isSignedIn && openSheet) {
      setOpenSheet(false);
      setNotice("Signed in successfully — welcome back!");
      setTimeout(() => setNotice(null), 3500);
    }
  }, [isLoaded, isSignedIn, openSheet]);

  // focus management when opening the sheet
  useEffect(() => {
    if (openSheet) {
      // small timeout to wait for sheet render
      const t = setTimeout(() => {
        firstControlRef.current?.focus();
      }, 80);
      return () => clearTimeout(t);
    }
  }, [openSheet]);

  // open sheet only after Clerk finished loading to avoid flicker
  const handleOpenSheet = () => {
    if (!isLoaded) {
      setNotice("Please wait — loading authentication...");
      setTimeout(() => setNotice(null), 2500);
      return;
    }
    setOpenSheet(true);
  };

  // friendly sign out function
  const handleSignOut = async () => {
    try {
      await signOut();
      setNotice("Signed out");
      setTimeout(() => setNotice(null), 2000);
    } catch (err) {
      console.error("Sign out failed", err);
      setNotice("Sign out failed — try again");
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <>
      <div className="home-page py-10 px-6 md:px-20">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="go-gym text-2xl md:text-3xl text-white/90 font-bold tracking-widest uppercase">
              Go.Gym
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* If user is signed in show quick account actions */}
            {isLoaded && isSignedIn ? (
              <>
                <UserButton />
                <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out">
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                variant={"default"}
                size={"lg"}
                onClick={handleOpenSheet}
                aria-expanded={openSheet}
                aria-controls="auth-sheet"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>

        {/* Main hero */}
        <div className="flex flex-col justify-center items-center h-[70vh] md:h-[80vh] gap-6">
          <h1 className="text-6xl md:text-8xl tracking-widest font-extrabold text-center">
            <span className="text-white">Go.</span>
            <span className="text-blue-500">Gym</span>
          </h1>

          <p className="text-sm md:text-base tracking-wide font-medium text-gray-700/70 max-w-2xl text-center px-4">
            A perfect gym for you to get fit and healthy with the best trainers and equipment.
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant={"default"}
              size={"lg"}
              className="bg-transparent border-2 border-zinc-600 text-black tracking-wide hover:bg-primary hover:text-white"
            >
              Explore Plans
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                // friendly behavior: open auth sheet for quick checkout/signup
                handleOpenSheet();
                setAuthMode("signup");
              }}
            >
              Join Now
            </Button>
          </div>

          <ChevronsDown size={30} className="animate-bounce text-gray-600 cursor-pointer mt-6" />
        </div>

        {/* Notification area */}
        <div aria-live="polite" className="fixed top-6 right-6 z-50">
          {notice && (
            <div className="rounded-md bg-gray-900/95 text-white px-4 py-2 shadow">
              {notice}
            </div>
          )}
        </div>

        {/* Auth sheet */}
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent id="auth-sheet" className="lg:max-w-[560px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-center mt-6 text-2xl font-bold">
                {authMode === "signin" ? "Sign In to Your Account" : "Create New Account"}
              </SheetTitle>
              <p className="text-center text-sm text-muted-foreground mt-1">
                {authMode === "signin"
                  ? "Welcome back — sign in to continue."
                  : "Create an account to save your progress."}
              </p>
            </SheetHeader>

            <div className="mt-6 space-y-6 mx-6 md:mx-12 pb-8">
              {/* mode toggle */}
              <div className="flex justify-center mb-2">
                <div className="bg-muted p-1 rounded-lg inline-flex">
                  <Button
                    ref={firstControlRef}
                    variant={authMode === "signin" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setAuthMode("signin")}
                    className="rounded-md"
                    aria-pressed={authMode === "signin"}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant={authMode === "signup" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setAuthMode("signup")}
                    className="rounded-md"
                    aria-pressed={authMode === "signup"}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>

              {/* Main auth area - guarded with Clerk loading state */}
              {!isLoaded ? (
                <div className="py-10 text-center">Loading authentication…</div>
              ) : isSignedIn ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">You are already signed in</p>
                  <div className="flex justify-center gap-3 items-center">
                    <UserButton />
                    <SheetClose asChild>
                      <Button variant="outline">Close</Button>
                    </SheetClose>
                    <Button variant="ghost" onClick={handleSignOut}>
                      Sign out
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {authMode === "signin" ? (
                    <SignIn
                      routing="virtual"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "shadow-none w-full",
                        },
                      }}
                      fallbackRedirectUrl={"/account"}// fallbackRedirectUrl optional — Clerk handles redirect after session creation normally
                    />
                  ) : (
                    <SignUp
                      routing="virtual"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "shadow-none w-full",
                        },
                      }}
                    />
                  )}
                </>
              )}
            </div>

            <SheetFooter className="px-6 pb-6">
              <div className="flex justify-between w-full">
                <div className="text-xs text-muted-foreground">
                  By continuing you agree to our Terms & Privacy.
                </div>

                <div className="flex items-center gap-2">
                  <SheetClose asChild>
                    <Button variant="ghost" size="sm">
                      Close
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
