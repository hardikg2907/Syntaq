import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "./themes/theme-toggle";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between border-b bg-slate-100 p-4 text-xl font-semibold dark:bg-black">
      <Link href="/" className="text-3xl">
        Syntaq
      </Link>

      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton>
            <Button variant="default">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
