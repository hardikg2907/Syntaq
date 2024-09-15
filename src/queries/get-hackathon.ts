import { useQuery } from "@tanstack/react-query";
import { getHackathon, getUserTeam } from "~/actions/hackathon";

export const useGetHackathon = (id: number) => {
  return useQuery({
    queryKey: ["hackathon", id],
    queryFn: async () => await getHackathon(id),
  });
};

export const useGetUserTeam = (id: number, user: any) => {
  return useQuery({
    queryKey: ["user-team", id],
    queryFn: async () => await getUserTeam(id, user),
    enabled: !!user,
  });
};
