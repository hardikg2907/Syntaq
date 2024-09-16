import { Hackathon } from "~/utils/types";
import HackathonHorizontalCard from "./HackathonHorizontalCard";

interface HackathonCardsSectionProps {
  hackathons: Hackathon[];
}

const HackathonCardsSection = ({ hackathons }: HackathonCardsSectionProps) => {
  return (
    <div className="mt-2 flex h-full w-full flex-col gap-3">
      {hackathons.map((hackathon) => {
        return (
          <HackathonHorizontalCard key={hackathon.id} hackathon={hackathon} />
        );
      })}
    </div>
  );
};

export default HackathonCardsSection;
