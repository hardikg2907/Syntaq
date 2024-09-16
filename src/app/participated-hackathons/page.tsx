import { auth } from "auth";
import { getParticipatedHackathons } from "~/actions/hackathon";
import HackathonCardsSection from "~/components/HackathonCardsSection";
import Heading from "~/components/Heading";

const ParticipatedHackathonsPage = async () => {
  const user = await auth();
  const participatedHackathons = await getParticipatedHackathons(user);
  return (
    <div>
      <Heading>Participated Hackathons</Heading>
      <HackathonCardsSection
        type="participated"
        hackathons={participatedHackathons}
      />
    </div>
  );
};

export default ParticipatedHackathonsPage;
