"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, LogOut, PlusCircle } from "lucide-react";

export const LoginUserButton = () => {
  const { data: session } = useSession();
  return (
    <>
      {!session && (
        <>
          <Button variant="outline" onClick={() => signIn()}>
            Sign in
          </Button>
        </>
      )}
      {session && (
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
              <DropdownMenuItem>
                <Link
                  href="/new-hackathon"
                  className="group flex w-full items-center gap-2 text-sm"
                >
                  <PlusCircle size={16} />
                  <p className="transition-colors duration-150 ease-in-out dark:group-hover:text-gray-100">
                    Create
                  </p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/organized-hackathons"
                  className="group flex w-full items-center gap-2 text-sm"
                >
                  <CalendarDays size={16} />
                  <p className="transition-colors duration-150 ease-in-out dark:group-hover:text-gray-100">
                    Organized
                  </p>
                </Link>
              </DropdownMenuItem>
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
  );
};
