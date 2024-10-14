import { useQuery } from "@tanstack/react-query";
import { getHackathon, getUserTeam } from "~/actions/hackathon";

export const useGetHackathon = (id: number, expand: boolean = true) => {
  return useQuery({
    queryKey: ["hackathon", id],
    queryFn: async () => await getHackathon(id, expand),
  });
};

export const useGetUserTeam = (id: number, user: any) => {
  // console.log(user);
  return useQuery({
    queryKey: ["user-team", id],
    queryFn: async () => await getUserTeam(id, user),
    retry: 1,
  });
};
