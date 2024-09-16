import { Hackathon } from "~/utils/types";
import HackathonHorizontalCard from "./HackathonHorizontalCard";

interface HackathonCardsSectionProps {
  hackathons: Hackathon[];
  type: "participated" | "organized";
}

const HackathonCardsSection = ({
  hackathons,
  type,
}: HackathonCardsSectionProps) => {
  return (
    <div className="mt-2 flex h-full w-full flex-col gap-3">
      {hackathons.map((hackathon) => {
        return (
          <HackathonHorizontalCard
            type={type}
            key={hackathon.id}
            hackathon={hackathon}
          />
        );
      })}
    </div>
  );
};

export default HackathonCardsSection;
