import Heading from "~/components/Heading";
import HackathonForm from "~/components/HackathonForm";

export const metadata = {
  title: "New Hackathon | Syntaq",
};

const NewHackathon = () => {
  return (
    <div>
      <Heading className="mb-5">Create a new hackathon</Heading>
      <HackathonForm />
    </div>
  );
};

export default NewHackathon;
