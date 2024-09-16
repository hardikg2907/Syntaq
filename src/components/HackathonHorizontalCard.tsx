import { Hackathon } from "~/utils/types";

interface HackathonHorizontalCardProps {
  hackathon: Hackathon;
}

const HackathonHorizontalCard = ({
  hackathon,
}: HackathonHorizontalCardProps) => {
  return <div>{hackathon?.title}</div>;
};

export default HackathonHorizontalCard;
