import HackathonsCarousel from "~/components/HackathonsCarousel";
import { discoverUpcomingHackathons } from "~/server/db/queries";

const Discover = async () => {
  const hackathons = await discoverUpcomingHackathons();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Upcoming Hackathons,</h1>
      <HackathonsCarousel hackathons={hackathons || []} />
    </div>
  );
};

export default Discover;
