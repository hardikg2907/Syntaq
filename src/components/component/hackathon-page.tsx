"use client";
import { format } from "date-fns";
import { Calendar, ChevronRight, MapPin, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import LoadingSpinner from "../LoadingSpinner";
import { Skeleton } from "../ui/skeleton";
import { useGetHackathon, useGetUserTeam } from "~/queries/get-hackathon";
import { useRouter } from "next/navigation";
import type { Session } from "~/utils/types";
import { generateHTML } from "~/lib/tiptap";
import "~/styles/editor.css";
import { useEffect } from "react";
import posthog from "posthog-js";

interface HackathonPageProps {
  id: number;
  user: Session | null;
}

export function HackathonPage({ id, user }: HackathonPageProps) {
  const { data, isLoading } = useGetHackathon(id);
  const { data: teamData, isLoading: isTeamLoading } = useGetUserTeam(id, user);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && data)
      posthog.capture("hackathon_view", {
        id: id,
      });
  }, [id]);

  if (isLoading || isTeamLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return <div>Hackathon not found</div>;
  }

  const {
    title,
    subtitle,
    description,
    start_date,
    end_date,
    registrationOpen,
    registrationClose,
    location,
    organizer,
    minTeamSize,
    maxTeamSize,
    photo,
  } = data;

  const startYear = new Date(start_date).getFullYear();
  const endYear = new Date(end_date).getFullYear();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <section className="w-full border-b border-gray-300 text-primary dark:border-gray-800 dark:bg-black">
        <div className="flex flex-col justify-center space-y-6 py-12 md:py-24 lg:py-32">
          <div className="space-y-4">
            <h1 className="text-wrap text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
              {title}
            </h1>
            <p className="max-w-[600px] text-primary/80 md:text-xl">
              {subtitle}
            </p>
            <div className="flex flex-col items-center gap-4 min-[400px]:flex-row">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <div>
                  <div className="font-medium">
                    {startYear !== endYear ? (
                      <>
                        {format(
                          new Date(start_date).toISOString(),
                          "MMMM d, yyyy",
                        )}{" "}
                        -{" "}
                        {format(
                          new Date(end_date).toISOString(),
                          "MMMM d, yyyy",
                        )}
                      </>
                    ) : (
                      <>
                        {format(new Date(start_date).toISOString(), "MMMM d")} -{" "}
                        {format(
                          new Date(end_date).toISOString(),
                          "MMMM d, yyyy",
                        )}
                      </>
                    )}
                    <div className="text-sm text-primary/80">
                      {/* Start and end dates */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <div>
                  <div className="text-sm text-primary/80">Organized by</div>
                  <div className="font-medium">
                    {organizer.first_name} {organizer.last_name}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 min-[400px]:flex-row">
              {isTeamLoading ? (
                <Skeleton
                  className={cn(
                    "h-10 w-24",
                    buttonVariants({
                      variant: "ghost",
                    }),
                  )}
                />
              ) : (
                // <Link className="h-full w-full" href={`/register/${id}`}>
                <Button
                  className={cn("group w-full min-[400px]:w-auto", {
                    "bg-red-500":
                      new Date().getTime() >
                      new Date(registrationClose).getTime(),
                    "bg-green-600 hover:bg-green-700": teamData,
                  })}
                  onClick={() => {
                    router.push(`/register/${id}`);
                  }}
                  disabled={
                    new Date().getTime() >
                      new Date(registrationClose).getTime() || isTeamLoading
                  }
                >
                  <>
                    {teamData
                      ? "View Registration"
                      : new Date().getTime() >
                          new Date(registrationClose).getTime()
                        ? "Registration Closed"
                        : "Register"}
                  </>

                  <ChevronRight className="ml-2 h-5 w-0 opacity-0 transition-all duration-150 group-hover:w-5 group-hover:opacity-100" />
                </Button>
                // </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* <section className="w-full border-b bg-black text-primary">
        <Image
          src={photo}
          alt={title}
          layout="responsive"
          width={1920}
          height={1080}
        />
      </section> */}
      <section className="w-full pt-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8">
            <div>
              <h2 className="text-2xl font-bold">About</h2>
              <div
                dangerouslySetInnerHTML={{ __html: generateHTML(description) }}
                id="hackathon-description"
                className="ProseMirror"
              ></div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8">
            <div>
              <h2 className="text-2xl font-bold">Registration Details</h2>
              <div className="mt-4 grid gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Registration Opens</div>
                    <div className="text-muted-foreground">
                      {format(
                        new Date(registrationOpen).toISOString(),
                        "MMMM d, yyyy",
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Registration Closes</div>
                    <div className="text-muted-foreground">
                      {format(
                        new Date(registrationClose).toISOString(),
                        "MMMM d, yyyy",
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Location</h2>
              <div className="mt-4 grid gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{location}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Team Size</h2>
              <div className="mt-4 grid gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Team Size</div>
                    <div className="text-muted-foreground">
                      {minTeamSize == maxTeamSize
                        ? minTeamSize
                        : `${minTeamSize} - ${maxTeamSize}`}{" "}
                      members
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
