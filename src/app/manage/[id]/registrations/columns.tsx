"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import { DataTableColumnHeader } from "~/components/ui/data-table";

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
    accessorKey: "id",
    header: "Sr. No.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Team Name",
  },
  {
    accessorKey: "registration_complete",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registration Status" />
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
  },
  {
    accessorKey: "registrationDate",
    header: "Registration Date",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleDateString();
    },
  },
];
