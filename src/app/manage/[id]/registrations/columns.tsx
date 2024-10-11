"use client";

import { ColumnDef } from "@tanstack/react-table";
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
  return (
    <Sheet>
      <SheetTrigger>
        <div
          title={teamName}
          className="truncate hover:underline"
          style={{ maxWidth: "150px" }}
        >
          {teamName}
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{teamName}</SheetTitle>
          <SheetDescription>Team Members</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
