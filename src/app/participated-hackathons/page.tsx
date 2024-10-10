"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getParticipatedHackathons } from "~/actions/hackathon";
import HackathonCardsSection from "~/components/HackathonCardsSection";
import HackathonCardsSectionSkeleton from "~/components/HackathonCardsSectionSkeleton";
import Heading from "~/components/Heading";

const ParticipatedHackathonsPage = () => {
  const { data: user } = useSession();
  const { data: participatedHackathons, isLoading } = useQuery({
    queryKey: ["participated-hackathons"],
    queryFn: () => getParticipatedHackathons(user),
    enabled: !!user,
  });
  //   console.log(organizedHackathons);
  return (
    <div className="h-full w-full">
      <Heading>Participated Hackathons</Heading>
      {isLoading ? (
        <HackathonCardsSectionSkeleton />
      ) : (
        <HackathonCardsSection
          type="participated"
          hackathons={participatedHackathons}
        />
      )}
    </div>
  );
};

export default ParticipatedHackathonsPage;
