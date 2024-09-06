import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Send, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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

const Team = ({ team_id }: { team_id: number }) => {
  const { data: user } = useSession();
  const [newTeamMember, setNewTeamMember] = useState<boolean>(false);

  const {
    data: members,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["team_members", team_id],
    queryFn: async () => {
      const res = await axios.get(
        `${BACKEND_API_URL}/teams/members/${team_id}/`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        },
      );

      return res.data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axios.post(
      `${BACKEND_API_URL}/teams/${team_id}/invite/`,
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
    refetch();
    setNewTeamMember(false);
  };
  const sendInvite = async () => {
    // Send invite to new team member
    form.handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1">
        <Skeleton className="h-10 w-full rounded-lg border border-gray-800" />
        <Skeleton className="h-10 w-full rounded-lg border border-gray-800" />
        <Skeleton className="h-10 w-full rounded-lg border border-gray-800" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      {members && (
        <>
          {(members?.accepted || []).map((member: any) => {
            return <Member accepted={true} member={member} key={member.id} />;
          })}
          {(members?.pending || []).map((member: any) => {
            return <Member accepted={false} member={member} key={member.id} />;
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
      <Button
        type="button"
        variant="outline"
        className="rounded-2xl bg-transparent"
        onClick={() => setNewTeamMember(true)}
      >
        + Add Team member
      </Button>
    </div>
  );
};

const Member = ({ member, accepted }: { member: any; accepted: boolean }) => {
  const { data: user } = useSession();

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
      <div>
        <Badge
          className={cn({
            "bg-green-500 hover:bg-green-600": accepted,
            "bg-blue-500 hover:bg-blue-600": !accepted,
          })}
        >
          {accepted ? "Accepted" : "Pending"}
        </Badge>
      </div>
    </div>
  );
};

export default Team;
