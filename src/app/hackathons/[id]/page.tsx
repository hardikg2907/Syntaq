import { HackathonPage } from "~/components/component/hackathon-page";
import { getHackathonById } from "~/server/db/queries";

const page = async ({ params }: { params: { id: number } }) => {
  const hackathon = await getHackathonById(params.id);
  console.log(hackathon);
  return (
    <div>
      <HackathonPage />
    </div>
  );
};

export default page;
