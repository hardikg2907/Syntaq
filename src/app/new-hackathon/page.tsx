import Heading from "~/components/Heading";
import NewHackathonForm from "~/components/NewHackathonForm";

const NewHackathon = () => {
  return (
    <div>
      <Heading className="mb-5">Create a new hackathon</Heading>
      <NewHackathonForm />
    </div>
  );
};

export default NewHackathon;
