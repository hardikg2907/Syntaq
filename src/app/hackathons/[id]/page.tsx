"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HackathonPage } from "~/components/component/hackathon-page";
import LoadingSpinner from "~/components/LoadingSpinner";
import { BACKEND_API_URL } from "~/utils/constants";

const page = ({ params }: { params: { id: number } }) => {
  const { data: hackathon, isLoading } = useQuery({
    queryKey: ["hackathon", params.id],
    queryFn: async () => {
      const response = await axios.get(
        `${BACKEND_API_URL}/hackathons/${params.id}/`,
      );
      return response.data;
    },
  });
  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !hackathon ? (
        <div> 404 Not Found </div>
      ) : (
        // @ts-ignore
        <HackathonPage {...hackathon} id={params.id} />
      )}
    </div>
  );
};

export default page;
