import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "auth";
import { getHackathon, getUserTeam } from "~/actions/hackathon";
import { HackathonPage } from "~/components/component/hackathon-page";

const page = async ({ params }: { params: { id: number } }) => {
  const user = await auth();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["hackathon", params.id],
    queryFn: async () => await getHackathon(params.id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["user-team", params.id],
    queryFn: async () => await getUserTeam(params.id, user),
  });

  return (
    <div className="h-full w-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HackathonPage id={params.id} user={user} />
      </HydrationBoundary>
    </div>
  );
};

export default page;
