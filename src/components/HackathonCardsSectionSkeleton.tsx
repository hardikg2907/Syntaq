import { Skeleton } from "./ui/skeleton";

const HackathonCardsSectionSkeleton = () => {
  return (
    <div className="mt-2 flex h-full w-full flex-col gap-3">
      {/* {Array(4)?.map((hackathon) => { */}
      <HackathonHorizontalCard />
      <HackathonHorizontalCard />
      <HackathonHorizontalCard />
      {/* })} */}
    </div>
  );
};
const HackathonHorizontalCard = () => {
  return (
    <Skeleton className="flex h-28 w-full flex-row items-center rounded-xl p-4 py-2"></Skeleton>
  );
};

export default HackathonCardsSectionSkeleton;
