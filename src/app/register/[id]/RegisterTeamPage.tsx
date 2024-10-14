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
    retry: false,
  });

  const { data: hackathon } = useQuery({
    queryKey: ["hackathon", hackathon_id],
    queryFn: async () =>
      getHackathonWithParams(hackathon_id, "fields=maxTeamSize,minTeamSize"),
  });

  const { mutateAsync: createTeamMutate, isPending: createIsPending } =
    useMutation({
      mutationFn: async (values: z.infer<typeof formSchema>) =>
        createTeam(values, user, hackathon_id),
      onSuccess: async () => {
        await refetch();
      },
      onError: (error) => {
        console.log(error);
        toast.error(error?.response?.data?.detail);
      },
    });

  const { mutateAsync: updateTeamMutate, isPending: updateIsPending } =
    useMutation({
      mutationFn: async (values: z.infer<typeof formSchema>) =>
        updateTeam(values, user, hackathon_id, existingTeam?.id),
      onSuccess: async () => {
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
      toast.promise(updateTeamMutate(values), {
        loading: "Updating Team...",
        success: "Team updated successfully",
        error: "Error updating team",
      });
    } else {
      toast.promise(createTeamMutate(values), {
        loading: "Creating Team...",
        success: "Team created successfully",
        error: "Error creating team",
      });
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
                    maxTeamSize={hackathon?.maxTeamSize}
                  />
                )}
              </>
            </div>
            <div className="flex w-full justify-between">
              <Button
                disabled={
                  isLoading || !showForm || createIsPending || updateIsPending
                }
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
