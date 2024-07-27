import { HackathonPage } from "~/components/component/hackathon-page";
import { getHackathonById } from "~/server/db/queries";

const page = async ({ params }: { params: { id: number } }) => {
  const hackathon = await getHackathonById(params.id);
  return (
    <div>
      {!hackathon ? (
        <div> 404 Not Found </div>
      ) : (
        // @ts-ignore
        <HackathonPage {...hackathon} />
      )}
    </div>
  );
};

export default page;
