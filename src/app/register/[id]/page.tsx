import SignInPrompt from "~/components/SignInPrompt";
import RegisterTeamPage from "./RegisterTeamPage";
import { auth } from "auth";

const RegisterPage = async ({ params }: { params: { id: number } }) => {
  const session = await auth();

  if (!session)
    return (
      <SignInPrompt
        message="You need to be signed in to register for this event."
        redirect={`register/${params.id}`}
      />
    );

  return <RegisterTeamPage hackathon_id={params?.id} user={session} />;
};

export default RegisterPage;
