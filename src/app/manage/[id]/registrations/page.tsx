import { auth } from "auth";
import Heading from "~/components/Heading";
import RegistrationsTable from "./RegistrationsTable";

const RegistrationsPage = async ({ params }: { params: { id: number } }) => {
  const user = await auth();
  return (
    <div>
      <Heading>Registrations</Heading>
      <RegistrationsTable user={user} hackathon_id={params.id} />
    </div>
  );
};

export default RegistrationsPage;
