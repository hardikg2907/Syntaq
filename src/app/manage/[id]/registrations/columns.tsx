"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { DataTableColumnHeader } from "~/components/ui/data-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { env } from "~/env";
import { cn } from "~/lib/utils";

// This type is used to define the shape of your registration data.
export type Registration = {
  id: number;
  name: string;
  registration_complete: boolean;
  created_at: Date; // ISO string for date
};

// Define your columns for the registration table
export const columns: ColumnDef<Registration>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="overflow-hidden rounded-lg border-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="overflow-hidden rounded-lg border-white"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sr. No." />
    ),
    cell: ({ row }) => row.index + 1,
    size: 50,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Team Name"
        filterVariant="text"
      />
    ),
    cell: ({ row }) => (
      <TeamNameWithSheet
        teamId={row.original.id}
        teamName={row.original.name}
      />
    ),
    size: 150,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "registration_complete",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Registration Status"
        filterVariant="select"
      />
    ),
    cell: ({ row }) => {
      const status = row.original.registration_complete;
      // Render a custom badge or status indicator based on registration status
      return (
        <>
          {status ? (
            <Badge variant="green">Registered</Badge>
          ) : (
            <Badge variant="default">Incomplete</Badge>
          )}{" "}
        </>
      );
    },
    filterFn: (row, id, filterValue) => {
      if (filterValue === "all") return true;
      return (
        row.original.registration_complete === (filterValue === "Registered")
      );
    },
    meta: {
      filterVariant: "select",
    },
    size: 150,
  },
  {
    accessorKey: "registrationDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registration Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleDateString();
    },
    sortingFn: (a, b) => {
      return (
        new Date(a.original.created_at).getTime() -
        new Date(b.original.created_at).getTime()
      );
    },
    size: 150,
  },
];

const TeamNameWithSheet = ({
  teamId,
  teamName,
}: {
  teamId: number;
  teamName: string;
}) => {
  const [opened, setOpened] = useState(false);
  const { data: teamInfo, isLoading } = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const response = await axios.get(
        `${env.NEXT_PUBLIC_BACKEND_URL}/manage/team/${teamId}`,
      );
      return response.data;
    },
    enabled: opened,
  });
  console.log(teamInfo);

  return (
    <Sheet open={opened} onOpenChange={(open) => setOpened(open)}>
      <SheetTrigger>
        <div
          title={teamName}
          className="truncate hover:underline"
          style={{ maxWidth: "150px" }}
        >
          {teamName}
        </div>
      </SheetTrigger>
      <SheetContent className="bg-black fill-transparent">
        <SheetHeader>
          <SheetTitle className="flex w-full justify-between">
            <h1 className="text-2xl font-bold underline">{teamName}</h1>
            {teamInfo && (
              <Badge
                variant={teamInfo.registration_complete ? "green" : "default"}
              >
                {teamInfo.registration_complete ? "Registered" : "Incomplete"}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-10">
          <h2 className="text-lg">Team Members</h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {teamInfo?.members.map((member: any) => {
                const fullName = `${member.userFields.first_name} ${member.userFields.last_name}`;
                return (
                  <div
                    key={member.id}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="truncate">{fullName}</div>
                    {/* <div>{member.userFields.email}</div> */}
                    <Badge variant="green">Confirmed</Badge>
                  </div>
                );
              })}
            </div>
          )}
          {teamInfo?.invitations.map((invitation: any) => {
            return (
              <div
                key={invitation.id}
                className="flex w-full items-center justify-between"
              >
                <div className="truncate">{invitation.receiver_email}</div>
                <Badge variant="default">Invited</Badge>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
