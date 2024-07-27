"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "./themes/theme-toggle";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between border-b border-gray-300 bg-slate-100 p-3 pl-5 text-xl font-semibold dark:border-gray-700 dark:bg-black">
      <div className="flex h-full items-center justify-between gap-3">
        <Link href="/" className="text-2xl">
          Syntaq
        </Link>
        <Link
          href="/discover"
          className="group flex w-full items-center gap-2 text-sm"
        >
          {/* <Button variant="ghost" className="group flex w-full gap-2"> */}
          <p className="text-gray-500 transition-colors duration-150 ease-in-out group-hover:text-gray-900 dark:group-hover:text-gray-100">
            Discover
          </p>
          {/* <ChevronRight
            size={16}
            color="white"
            className="opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
          /> */}
          {/* </Button> */}
        </Link>
        <Link
          href="/new-hackathon"
          className="group flex w-full items-center gap-2 text-sm"
        >
          {/* <Button variant="ghost" className="group flex w-full gap-2"> */}
          <p className="text-gray-500 transition-colors duration-150 ease-in-out group-hover:text-gray-900 dark:group-hover:text-gray-100">
            Create
          </p>
          {/* <ChevronRight
            size={16}
            color="white"
            className="opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
          /> */}
          {/* </Button> */}
        </Link>
      </div>

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
