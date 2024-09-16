import { auth } from "auth";
import { getOrganizedHackathons } from "~/actions/hackathon";
import HackathonCardsSection from "~/components/HackathonCardsSection";
import Heading from "~/components/Heading";

const OrganizedHackathonsPage = async () => {
  const user = await auth();
  const organizedHackathons = await getOrganizedHackathons(user);
  //   console.log(organizedHackathons);
  return (
    <div className="h-full w-full">
      <Heading>Organized Hackathons</Heading>
      <HackathonCardsSection hackathons={organizedHackathons} />
    </div>
  );
};

export default OrganizedHackathonsPage;
