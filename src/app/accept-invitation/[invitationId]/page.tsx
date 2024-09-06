"use client";
import { useQuery } from "@tanstack/react-query";
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

  const { isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["invitations", invitationId],
    queryFn: async () => {
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
  return (
    <div className="h-full w-full">
      {isLoading ? (
        <LoadingSpinner size={32} />
      ) : (
        <div>
          {isSuccess ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Invitation Accepted</h1>
              <p className="text-lg">
                You have successfully accepted the invitation.
              </p>
            </div>
          ) : (
            isError && (
              <div className="text-center">
                <h1 className="text-2xl font-bold">
                  Failed to Accept Invitation
                </h1>
                <p className="text-lg">
                  {error?.message ||
                    "An error occurred while accepting the invitation."}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AcceptInvitationPage;
