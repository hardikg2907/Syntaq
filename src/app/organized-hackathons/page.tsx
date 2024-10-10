"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getOrganizedHackathons } from "~/actions/hackathon";
import HackathonCardsSection from "~/components/HackathonCardsSection";
import HackathonCardsSectionSkeleton from "~/components/HackathonCardsSectionSkeleton";
import Heading from "~/components/Heading";

const OrganizedHackathonsPage = () => {
  const { data: user } = useSession();
  const { data: organizedHackathons, isLoading } = useQuery({
    queryKey: ["organized-hackathons"],
    queryFn: () => getOrganizedHackathons(user),
    enabled: !!user,
  });
  //   console.log(organizedHackathons);
  return (
    <div className="h-full w-full">
      <Heading>Organized Hackathons</Heading>
      {isLoading ? (
        <HackathonCardsSectionSkeleton />
      ) : (
        <HackathonCardsSection
          type="organized"
          hackathons={organizedHackathons}
        />
      )}
    </div>
  );
};

export default OrganizedHackathonsPage;
