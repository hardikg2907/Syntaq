"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import LoadingSpinner from "~/components/LoadingSpinner";
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
import Team from "./Team";
import { createTeam, getTeam, updateTeam } from "~/actions/team";
import Heading from "~/components/Heading";
import { getHackathonWithParams } from "~/actions/hackathon";

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
  const {
    data: existingTeam,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["team", hackathon_id],
    queryFn: async () => getTeam({ hackathon_id, user }),
  });

  const { data: hackathon } = useQuery({
    queryKey: ["hackathon", hackathon_id],
    queryFn: async () =>
      getHackathonWithParams(hackathon_id, "fields=maxTeamSize,minTeamSize"),
  });

  const { mutateAsync: createTeamMutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      createTeam(values, user, hackathon_id),
    onSuccess: async () => {
      toast.success("Team Created successfully!");
      await refetch();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.detail);
    },
  });

  const { mutateAsync: updateTeamMutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      updateTeam(values, user, hackathon_id, existingTeam?.id),
    onSuccess: async () => {
      toast.success("Team Updated successfully!");
      await refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res;
    if (existingTeam) {
      res = await updateTeamMutate(values);
      toast.success("Team updated successfully");
    } else {
      res = await createTeamMutate(values);
      toast.success("Team created successfully");
    }
  }
  const isLeader = existingTeam?.leader === user?.user?.pk;
  const showForm =
    (isLeader && !existingTeam?.registration_complete) || !existingTeam;

  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Form {...form}>
          <Heading className="mb-5">
            {existingTeam ? "Edit Team" : "Register Team"}
          </Heading>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col gap-5"
          >
            <div className="space-y-8">
              {showForm ? (
                <FormField
                  control={form.control}
                  name="name"
                  defaultValue={existingTeam?.name}
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
              ) : (
                <h1 className="text-xl font-semibold">{existingTeam?.name}</h1>
              )}
              <>
                {existingTeam && (
                  <Team
                    team_id={existingTeam?.id}
                    isLeader={isLeader}
                    registration_complete={existingTeam?.registration_complete}
                  />
                )}
              </>
            </div>
            <div className="flex w-full justify-between">
              <Button
                disabled={isLoading || !showForm}
                className="w-fit"
                type="submit"
              >
                {existingTeam ? "Save" : "Create Team"}
              </Button>
              <p className="text-sm text-gray-500">
                (Min: {hackathon?.minTeamSize}, Max: {hackathon?.maxTeamSize})
              </p>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default RegisterTeamPage;
