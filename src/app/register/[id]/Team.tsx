import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Send, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
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
import { cn } from "~/lib/utils";
import { BACKEND_API_URL } from "~/utils/constants";

const formSchema = z.object({
  receiver_email: z.string().email("Should be a valid email"),
});

const Team = ({
  members,
  newTeamMember,
  setNewTeamMember,
  team_id,
}: {
  members: any;
  newTeamMember: boolean;
  setNewTeamMember: Dispatch<SetStateAction<boolean>>;
  team_id: number;
}) => {
  const { data: user } = useSession();

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
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );
    // If successful
    setNewTeamMember(false);
  };
  const sendInvite = async () => {
    // Send invite to new team member
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="flex flex-col gap-1">
      {members.map((member: any) => {
        return <Member member={member} key={member.id} />;
      })}
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
    </div>
  );
};

const Member = ({ member }: { member: any }) => {
  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-gray-800 p-3">
      <div>
        {member.userFields.first_name} {member.userFields.last_name}
      </div>
      <div className="text-sm text-gray-600">{member.userFields.email}</div>
      <div>
        <Badge
          className={cn({
            "bg-green-500 hover:bg-green-600": member.is_confirmed,
            "bg-blue-500 hover:bg-blue-600": !member.is_confirmed,
          })}
        >
          {member.is_confirmed ? "Accepted" : "Pending"}
        </Badge>
      </div>
    </div>
  );
};

export default Team;
