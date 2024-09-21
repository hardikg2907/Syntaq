"use client";

import { LineChart, PencilLine, Settings, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { LoginUserButton } from "./navbar/login-user-button";
import { auth } from "auth";
import { useSession } from "next-auth/react";

const pages = [
  {
    icon: PencilLine,
    label: "Edit",
    path: "edit",
  },
  {
    icon: LineChart,
    label: "Analytics",
    path: "analytics",
  },
  {
    icon: Users2,
    label: "Participants",
  },
];

const ManageSidebar = () => {
  const path = usePathname();
  const pathEnd = path.split("/").pop();
  const { data: user } = useSession();
  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r transition-all">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <Link
            href="/"
            className="group flex shrink-0 items-center justify-center gap-2 rounded-full bg-white p-2 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <div className="flex h-4 w-4 items-center justify-center transition-all group-hover:scale-110">
              S
            </div>
            <span className="sr-only">Syntaq</span>
          </Link>
          {pages.map((page, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <Link
                  href={
                    page.path
                      ? `${path.replace(/\/[^\/]*$/, "")}/${page.path}`
                      : "#"
                  }
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    {
                      "bg-muted text-foreground": pathEnd === page.path,
                    },
                  )}
                >
                  <page.icon className="h-5 w-5" />
                  <span className="sr-only">{page.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{page.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center px-2 py-5">
          {/* <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              > */}
          <LoginUserButton session={user} />
          <span className="sr-only">Profile</span>
          {/* </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Profile</TooltipContent>
          </Tooltip> */}
        </nav>
      </aside>
    </TooltipProvider>
  );
};

export default ManageSidebar;
