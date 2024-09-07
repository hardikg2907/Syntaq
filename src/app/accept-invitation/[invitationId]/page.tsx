"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import LoadingSpinner from "~/components/LoadingSpinner";
import SignInPrompt from "~/components/SignInPrompt";
import { BACKEND_API_URL } from "~/utils/constants";

const AcceptInvitationPage = ({
  params,
}: {
  params: { invitationId: string };
}) => {
  const { data: user } = useSession();
  const invitationId = params.invitationId;

  const { isPending, isSuccess, isError, error } = useMutation({
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
      return res.data;
    },
  });

  if (!user)
    return (
      <>
        <SignInPrompt message="Sign In to accept this Invitation" />
      </>
    );
  return <div className="h-full w-full"></div>;
};

export default AcceptInvitationPage;
