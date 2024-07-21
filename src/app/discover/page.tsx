import Link from "next/link";
import HackathonsCarousel from "~/components/HackathonsCarousel";
import { discoverUpcomingHackathons } from "~/server/db/queries";

const Discover = async () => {
  const hackathons = await discoverUpcomingHackathons();

  return (
    <div className="w-full">
      <div className="flex w-full items-end justify-between">
        <h1 className="text-2xl font-bold">Upcoming Hackathons,</h1>
        <Link
          href="/hackathons"
          className="text-sm text-blue-500 hover:underline"
        >
          View all
        </Link>
      </div>
      <HackathonsCarousel hackathons={hackathons || []} />
    </div>
  );
};

export default Discover;
