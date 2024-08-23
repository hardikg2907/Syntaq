"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HackathonPage } from "~/components/component/hackathon-page";
import { getHackathonById } from "~/server/db/queries";
import { BACKEND_API_URL } from "~/utils/constants";

const page = ({ params }: { params: { id: number } }) => {
  const { data: hackathon } = useQuery({
    queryKey: ["hackathon", params.id],
    queryFn: async () => {
      const response = await axios.get(
        `${BACKEND_API_URL}/hackathons/${params.id}/`,
      );
      return response.data;
    },
  });
  return (
    <div>
      {!hackathon ? (
        <div> 404 Not Found </div>
      ) : (
        // @ts-ignore
        <HackathonPage {...hackathon} id={params.id} />
      )}
    </div>
  );
};

export default page;
