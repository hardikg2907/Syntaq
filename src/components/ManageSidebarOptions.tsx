"use client";
import { usePathname } from "next/navigation";

import { LineChart, PencilLine, Settings, Users2 } from "lucide-react";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
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
    label: "Registrations",
    path: "registrations",
  },
];

const ManageSidebarOptions = () => {
  const path = usePathname();

  const pathEnd = path.split("/").pop();
  return (
    <TooltipProvider delayDuration={300}>
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
    </TooltipProvider>
  );
};

export default ManageSidebarOptions;
