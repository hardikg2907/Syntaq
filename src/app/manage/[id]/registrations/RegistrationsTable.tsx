"use client";

import { useQuery } from "@tanstack/react-query";
import { getHackathonRegistrations } from "~/actions/hackathon";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

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

  return (
    <Table className="mt-10 border">
      <TableHeader className="rounded-t-md">
        <TableRow>
          <TableHead className="w-[50px]">Sr. No.</TableHead>
          <TableHead className="w-[200px] text-center">Team Name</TableHead>
          <TableHead className="w-[150px] text-center">
            Registration Status
          </TableHead>
          <TableHead className="w-[150px] text-right">
            Registration Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            {registrations?.map((registration: any, index: number) => (
              <TableRow key={registration.id}>
                <TableCell className="w-[50px] font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="w-[200px] text-center">
                  {registration.name}
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  {registration.registration_complete ? (
                    <Badge variant="green">Registered</Badge>
                  ) : (
                    <Badge variant="default">Incomplete</Badge>
                  )}
                </TableCell>
                <TableCell className="w-[150px] text-right">
                  {new Date(registration.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  );
};

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell className="w-[50px]">
          <Skeleton className="h-6 w-8" />
        </TableCell>
        <TableCell className="w-[200px]">
          <Skeleton className="h-6 w-full" />
        </TableCell>
        <TableCell className="w-[150px]">
          <Skeleton className="h-6 w-full" />
        </TableCell>
        <TableCell className="w-[150px]">
          <div className="flex justify-end">
            <Skeleton className="h-6 w-20" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);

export default RegistrationsTable;
