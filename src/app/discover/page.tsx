"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import HackathonsCarousel from "~/components/HackathonsCarousel";
import { BACKEND_API_URL } from "~/utils/constants";
import { useSession } from "next-auth/react";

const Discover = () => {
  const { data: session } = useSession();
  const { data: hackathons } = useQuery({
    queryKey: ["hackathons"],
    queryFn: async () => {
      const response = await axios.get(`${BACKEND_API_URL}/hackathons`, {
        headers: {
          // Authorization: `Bearer ${session?.access_token}`,
        },
      });
      return response.data;
    },
  });

  return (
    <div className="w-full">
      <div className="flex w-full items-end justify-between">
        <h1 className="text-2xl font-bold">Upcoming Hackathons,</h1>
        <Link
          href="/hackathons"
          className="text-sm text-blue-500 hover:underline"
        >
          View all
        </Link>
      </div>
      <HackathonsCarousel hackathons={hackathons || []} />
    </div>
  );
};

export default Discover;
