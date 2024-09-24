"use client";

import { useQuery } from "@tanstack/react-query";
import { getHackathonRegistrations } from "~/actions/hackathon";
import { DataTable } from "~/components/ui/data-table"; // Import your DataTable component
import { columns } from "./columns"; // Import your columns definition
import { Skeleton } from "~/components/ui/skeleton";

const RegistrationsTable = ({
  user,
  hackathon_id,
}: {
  user: any;
  hackathon_id: number;
}) => {
  const { data: registrations, isLoading } = useQuery({
    queryKey: ["registrations", hackathon_id],
    queryFn: async () => await getHackathonRegistrations(hackathon_id, user),
  });

  //   if (isLoading) {
  //     return (
  //       <div className="container mx-auto py-10">
  //         <TableSkeleton />
  //       </div>
  //     );
  //   }

  return (
    <div className="container mx-auto py-10">
      {registrations && <DataTable columns={columns} data={registrations} />}
    </div>
  );
};

const TableSkeleton = () => (
  <div className="mt-10 border">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="rounded-t-md bg-gray-50">
        <tr>
          <th className="w-[50px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Sr. No.
          </th>
          <th className="w-[200px] px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
            Team Name
          </th>
          <th className="w-[150px] px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
            Registration Status
          </th>
          <th className="w-[150px] px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
            Registration Date
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {[...Array(5)].map((_, index) => (
          <tr key={index}>
            <td className="w-[50px] px-6 py-4 font-medium">
              <Skeleton className="h-6 w-8" />
            </td>
            <td className="w-[200px] px-6 py-4 text-center">
              <Skeleton className="h-6 w-full" />
            </td>
            <td className="w-[150px] px-6 py-4 text-center">
              <Skeleton className="h-6 w-full" />
            </td>
            <td className="w-[150px] px-6 py-4 text-right">
              <Skeleton className="h-6 w-20" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RegistrationsTable;
