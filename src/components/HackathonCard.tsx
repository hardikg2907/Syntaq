import { Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface HackathonCardProps {
  id: number;
  title: string;
  start_date: Date;
  photo?: string;
}

const HackathonCard = ({
  id,
  title,
  start_date,
  photo,
}: HackathonCardProps) => {
  const router = useRouter();
  const currentDate = new Date();
  const timeLeft = new Date(start_date)?.getTime() - currentDate.getTime();

  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const weeksLeft = Math.floor(daysLeft / 7);

  return (
    <div
      onClick={() => router.push(`/hackathons/${id}`)}
      className="group h-60 w-[250px] cursor-pointer rounded-xl border border-gray-300 bg-gray-50 transition-shadow duration-200 hover:shadow-md dark:border-0 dark:bg-gray-900/40 dark:hover:shadow-slate-900"
    >
      <Image
        src={photo || ""}
        alt={title}
        width={200}
        height={150}
        className="h-40 w-full rounded-t-xl object-contain"
      />
      <div className="p-3">
        <h1 className="text-xl font-semibold transition-colors duration-150 group-hover:text-blue-500">
          {title}
        </h1>
        <p className="gap-1/2 flex items-center text-sm text-black dark:text-gray-500">
          <Clock size={13} className="mr-1 inline text-black dark:text-white" />
          <span className="font-medium">
            {weeksLeft > 0
              ? `${weeksLeft} weeks`
              : daysLeft > 0
                ? `${daysLeft} days`
                : `${hoursLeft} hours`}
          </span>
          {"  "}
          left
        </p>
      </div>
    </div>
  );
};

export default HackathonCard;
