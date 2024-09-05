"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { BACKEND_API_URL } from "~/utils/constants";
import LoadingSpinner from "~/components/LoadingSpinner";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface RegisterTeamPageProps {
  hackathon_id: number;
  user: any;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Required Field")
    .max(256, "Name must be less than 256 characters"),
  hackathon_id: z.number().default(0),
});

const RegisterTeamPage = ({ hackathon_id, user }: RegisterTeamPageProps) => {
  const { mutate: createTeamMutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axios.post(
        `${BACKEND_API_URL}/teams/create/`,
        {
          ...values,
          hackathon_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        },
      );

      return response.data;
    },
  });

  const { mutate: updateTeamMutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axios.put(
        `${BACKEND_API_URL}/teams/update/${existingTeam?.id}/`,
        {
          ...values,
          hackathon_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        },
      );
      // console.log(response.data);
      return response.data;
    },
  });
  //   console.log(user);

  const { data: existingTeam, isLoading } = useQuery({
    queryKey: ["team", hackathon_id, user?.user?.pk],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/teams/${hackathon_id}/`,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          },
        );
        form.setValue("name", response.data.name);
        console.log(response.data);
        return response.data;
      } catch (e) {
        return null;
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res;
    if (existingTeam) {
      res = updateTeamMutate(values);
      toast.success("Team updated successfully");
    } else {
      res = createTeamMutate(values);
      toast.success("Team created successfully");
    }
    // console.log(res);
    // if (res) {
    //   router.push(`/hackathons/${params.id}`);
    // }
  }

  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Team members={existingTeam?.members || []} />
            <Button type="submit">
              {existingTeam ? "Save" : "Create Team"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

const Team = ({ members }: { members: any }) => {
  return (
    <div className="flex flex-col gap-1">
      {[...members, ...members].map((member: any) => {
        return <Member member={member} key={member.id} />;
      })}
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

export default RegisterTeamPage;
