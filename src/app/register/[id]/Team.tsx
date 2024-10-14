import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Send, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getInvitationsAndMembers } from "~/actions/team";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { BACKEND_API_URL } from "~/utils/constants";

const formSchema = z.object({
  receiver_email: z.string().email("Should be a valid email"),
});

const Team = ({
  team_id,
  isLeader,
  registration_complete,
  maxTeamSize,
}: {
  team_id: number;
  isLeader: boolean;
  registration_complete: boolean;
  maxTeamSize: number;
}) => {
  const { data: user } = useSession();
  const [newTeamMember, setNewTeamMember] = useState<boolean>(false);

  const {
    data: members,
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["team_members", team_id],
    queryFn: async () => await getInvitationsAndMembers(team_id, user),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(
        `${BACKEND_API_URL}/teams/invitations/${team_id}/`,
        {
          ...values,
        },
        {
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${user?.access_token}`,
          },
        },
      );
      // If successful
      toast.success("Invitation sent successfully");
      form.reset();
      refetch();
      setNewTeamMember(false);
    } catch (error) {
      console.log(error);
      toast.error(JSON.stringify(error?.response?.data));
    }
  };
  const sendInvite = async () => {
    // Send invite to new team member
    form.handleSubmit(onSubmit)();
  };

  if (isLoading && isFetching) {
    return (
      <div className="flex flex-col gap-1">
        <h1 className="border-b text-lg font-bold">Team Members</h1>
        <Skeleton className="h-10 w-full rounded-lg border border-gray-800" />
        <Skeleton className="h-10 w-full rounded-lg border border-gray-800" />
        <Skeleton className="h-10 w-full rounded-lg border border-gray-800" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <h1 className="border-b text-lg font-bold">Team Members</h1>
      {members && (
        <>
          {(members?.accepted || []).map((member: any) => {
            return (
              <Member
                accepted={true}
                member={member}
                isLeader={isLeader}
                key={member.id}
                refetch={refetch}
              />
            );
          })}
          {(members?.pending || []).map((member: any) => {
            return (
              <Member
                accepted={false}
                member={member}
                isLeader={isLeader}
                key={member.id}
                refetch={refetch}
              />
            );
          })}
        </>
      )}
      {newTeamMember && (
        <Form {...form}>
          <form className="flex w-full items-center justify-between rounded-lg border border-gray-800 p-3">
            <FormField
              name="receiver_email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      className="w-1/3"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                className="flex gap-1 bg-transparent"
                onClick={() => sendInvite()}
              >
                Send Invite <Send size={20} />
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex gap-1 bg-transparent"
                onClick={() => setNewTeamMember(false)}
              >
                <XIcon size={20} />
              </Button>
            </div>
          </form>
        </Form>
      )}
      {isLeader &&
        !registration_complete &&
        members &&
        Array.isArray(members.accepted) &&
        Array.isArray(members.pending) &&
        members.accepted.length + members.pending.length < maxTeamSize && (
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl bg-transparent"
            onClick={() => setNewTeamMember(true)}
          >
            + Add Team member
          </Button>
        )}
    </div>
  );
};

const Member = ({
  member,
  accepted,
  isLeader,
  refetch,
}: {
  member: any;
  accepted: boolean;
  isLeader?: boolean;
  refetch?: () => void;
}) => {
  const { data: user } = useSession();

  const { mutateAsync: deleteMember } = useMutation({
    mutationKey: ["delete-member", member.id],
    mutationFn: async (id: number) => {
      const res = await axios.delete(
        `${BACKEND_API_URL}/teams/members/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        },
      );
      return res.data;
    },
  });

  const { mutateAsync: deleteInvitation } = useMutation({
    mutationKey: ["delete-invitation", member.id],
    mutationFn: async (id: number) => {
      const res = await axios.delete(
        `${BACKEND_API_URL}/teams/invitations/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        },
      );
      return res.data;
    },
  });

  const deleteHandler = async () => {
    if (accepted) {
      await deleteMember(member.id);
    } else {
      await deleteInvitation(member.id);
    }
    refetch && refetch();
  };

  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-gray-800 p-3">
      {accepted && (
        <div>
          {member.userFields.first_name} {member.userFields.last_name}{" "}
          <span className="text-gray-500">
            {/* @ts-ignore */}
            {member.userFields.email === user?.email && "(You)"}
          </span>
        </div>
      )}
      <div className="text-sm text-gray-600">
        {member?.userFields?.email || member?.receiver_email}
      </div>
      <div className="flex items-center justify-between gap-1">
        <Badge
          className={cn("", {
            "bg-green-500 hover:bg-green-600": accepted,
            "bg-blue-500 hover:bg-blue-600": !accepted,
          })}
        >
          {accepted ? "Accepted" : "Pending"}
        </Badge>
        {isLeader && member?.userFields?.email !== user?.email && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="flex gap-1 bg-transparent"
              >
                <XIcon size={10} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-bold">Are you sure?</h1>
                <p className="text-gray-600">
                  Do you really want to remove {member.userFields?.first_name}{" "}
                  {member.userFields?.last_name} from the team?
                </p>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex gap-1 bg-transparent"
                    onClick={() => deleteHandler()}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex gap-1 bg-transparent"
                  >
                    No
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Team;
