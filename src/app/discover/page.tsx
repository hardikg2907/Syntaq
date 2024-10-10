"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import HackathonsCarousel from "~/components/HackathonsCarousel";
import Heading from "~/components/Heading";
import { env } from "~/env";

const Discover = () => {
  // const { data: session } = useSession();
  const { data: hackathons, isLoading } = useQuery({
    queryKey: ["hackathons"],
    queryFn: async () => {
      const response = await axios.get(
        `${env.NEXT_PUBLIC_BACKEND_URL}/hackathons`,
        {
          headers: {
            // Authorization: `Bearer ${session?.access_token}`,
          },
        },
      );
      return response.data;
    },
  });

  return (
    <div className="w-full">
      <div className="flex w-full items-end justify-between">
        <Heading>Upcoming Hackathons</Heading>
        <Link
          href="/hackathons"
          className="text-sm text-blue-500 hover:underline"
        >
          View all
        </Link>
      </div>
      <HackathonsCarousel isLoading={isLoading} hackathons={hackathons || []} />
    </div>
  );
};

export default Discover;
