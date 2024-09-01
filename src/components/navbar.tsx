"use client";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./themes/theme-toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { data: session, status } = useSession();

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
        <>
          {!(status === "loading") && !session && (
            <>
              <Button variant="outline" onClick={() => signIn()}>
                Sign in
              </Button>
            </>
          )}
          {!(status === "loading") && session && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Image
                      src={session?.picture as string}
                      alt="User Image"
                      width={36}
                      height={36}
                      className="overflow-hidden rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="pl-2 text-sm">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-2 text-red-500"
                    onClick={() => signOut({ redirect: true })}
                  >
                    Sign Out
                    <LogOut size={14} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
