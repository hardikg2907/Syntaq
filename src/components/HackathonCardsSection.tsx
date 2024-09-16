import { Hackathon } from "~/utils/types";
import HackathonHorizontalCard from "./HackathonHorizontalCard";

interface HackathonCardsSectionProps {
  hackathons: Hackathon[];
}

const HackathonCardsSection = ({ hackathons }: HackathonCardsSectionProps) => {
  return (
    <div className="h-full w-full">
      {hackathons.map((hackathon) => {
        return <HackathonHorizontalCard hackathon={hackathon} />;
      })}
    </div>
  );
};

export default HackathonCardsSection;
