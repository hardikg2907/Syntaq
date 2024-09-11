"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingSpinner from "~/components/LoadingSpinner";
import SignInPrompt from "~/components/SignInPrompt";
import { Button } from "~/components/ui/button";
import { BACKEND_API_URL } from "~/utils/constants";

const AcceptInvitationPage = ({
  params,
}: {
  params: { invitationId: string };
}) => {
  const { data: user } = useSession();
  const invitationId = params.invitationId;
  const router = useRouter();

  const { isPending, isSuccess, isError, error, mutateAsync } = useMutation({
    mutationKey: ["accept-invitation", invitationId],
    mutationFn: async () => {
      const res = await axios.put(
        `${BACKEND_API_URL}/teams/invitations/accept/${invitationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        },
      );
      if (!(res.status === 200)) {
        toast.error("Failed to accept invitation");
        return;
      }
      toast.success("Invitation Accepted");
      router.push(`/register/${invitation.team.hackathon}`);
      return res.data;
    },
  });
  const { data: invitation } = useQuery({
    queryKey: ["invitation", invitationId],
    queryFn: async () => {
      const res = await axios.get(
        `${BACKEND_API_URL}/teams/invitations/${invitationId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        },
      );
      return res.data;
    },
  });

  if (!user)
    return (
      <>
        <SignInPrompt message="Sign In to accept this Invitation" />
      </>
    );
  if (!invitation) return <div>404 Invitation not found</div>;
  return (
    <div className="h-full w-full space-y-8">
      <h1 className="text-xl font-semibold">
        Team name: <span>{invitation?.team?.name}</span>
      </h1>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold underline">Team Members</h3>
        <div>
          {invitation?.team?.members.map((member: any) => (
            <Member member={member} key={member?.id} />
          ))}
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <Button
          onClick={() => mutateAsync()}
          className="rounded-lg bg-blue-500 p-2"
        >
          Accept Invitation
        </Button>
        <Button
          // onClick={() => mutateAsync()}
          className="rounded-lg bg-red-500 p-2"
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;

const Member = ({ member }: { member: any }) => {
  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-gray-800 p-3">
      {member.userFields.first_name} {member.userFields.last_name}{" "}
      <span className="text-gray-500">{member.userFields.email}</span>
    </div>
  );
};
