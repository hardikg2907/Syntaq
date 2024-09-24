import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { Hackathon } from "~/utils/types";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { ArrowUpRightIcon, PenBoxIcon } from "lucide-react";

interface HackathonHorizontalCardProps {
  hackathon: Hackathon;
  type: "participated" | "organized";
}

const HackathonHorizontalCard = ({
  hackathon,
  type,
}: HackathonHorizontalCardProps) => {
  return (
    <Card className="flex flex-row items-center rounded-xl p-4 py-2 transition-shadow duration-150 ease-in-out hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-slate-900">
      <div className="mr-4 flex-shrink-0">
        <Image
          src={hackathon?.photo || "/default_hackathon_image.png"}
          alt={hackathon?.title}
          className="h-16 w-16 rounded-md"
          width={64}
          height={64}
        />
      </div>
      <div className="flex w-full justify-between">
        <CardHeader className="w-56 px-1">
          <CardTitle className="truncate" title={hackathon?.title}>
            {hackathon?.title}
          </CardTitle>
          <CardDescription className="truncate" title={hackathon?.subtitle}>
            {hackathon?.subtitle}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-row items-end gap-2 p-1">
          <Link
            href={`/hackathons/${hackathon.id}`}
            target="_blank"
            className={buttonVariants({
              className:
                "group flex w-fit items-center justify-between gap-2 p-2",
            })}
          >
            View
            <ArrowUpRightIcon
              size={16}
              className="w-0 transition-all duration-150 ease-in-out group-hover:w-4"
            />
          </Link>
          {type == "organized" && (
            <Link
              href={`/manage/${hackathon.id}/edit`}
              className={buttonVariants({
                variant: "red",
                className:
                  "group flex w-fit items-center justify-between gap-2 p-2",
              })}
            >
              Manage
              <PenBoxIcon
                size={16}
                className="w-0 transition-all duration-150 ease-in-out group-hover:w-4"
              />
            </Link>
          )}
          {type == "participated" && (
            <Link
              href={`/register/${hackathon.id}`}
              className={buttonVariants({
                variant: "green",
                className:
                  "group flex w-fit items-center justify-between gap-2 p-2",
              })}
            >
              View Registration
              <ArrowUpRightIcon
                size={16}
                className="w-0 transition-all duration-150 ease-in-out group-hover:w-4"
              />
            </Link>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default HackathonHorizontalCard;
