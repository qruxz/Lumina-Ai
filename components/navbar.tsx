import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-background h-[60px] fixed top-0 w-full z-50 flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Lumina
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
