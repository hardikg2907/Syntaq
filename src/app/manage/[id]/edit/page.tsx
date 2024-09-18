"use client";

import HackathonForm from "~/components/HackathonForm";
import Heading from "~/components/Heading";
import LoadingSpinner from "~/components/LoadingSpinner";
import { useGetHackathon } from "~/queries/get-hackathon";

const EditHackathonPage = ({ params }: { params: { id: number } }) => {
  const {
    data: hackathon,
    isLoading,
    isFetching,
  } = useGetHackathon(params.id, false);
  return (
    <div className="min-h-screen w-full">
      <Heading>Edit Hackathon</Heading>
      {isLoading ? <LoadingSpinner /> : <HackathonForm hackathon={hackathon} />}
    </div>
  );
};

export default EditHackathonPage;
