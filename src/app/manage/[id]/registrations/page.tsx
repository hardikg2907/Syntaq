import { auth } from "auth";
import { getHackathonRegistrations } from "~/actions/hackathon";
import Heading from "~/components/Heading";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const RegistrationsPage = async ({ params }: { params: { id: number } }) => {
  const user = await auth();
  const registrations = await getHackathonRegistrations(params.id, user);
  return (
    <div>
      <Heading>Registrations</Heading>
      <Table className="mt-10 border">
        <TableHeader className="rounded-t-md">
          <TableRow>
            <TableHead className="w-[100px]">Sr. No.</TableHead>
            <TableHead>Team Name</TableHead>
            <TableHead>Registration Status</TableHead>
            <TableHead className="text-right">Registration Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations?.map((registration: any, index: number) => (
            <TableRow key={registration.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{registration.name}</TableCell>
              <TableCell>
                {registration.registration_complete ? (
                  <Badge variant="green">Registered</Badge>
                ) : (
                  <Badge variant="default">Incomplete</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {new Date(registration.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RegistrationsPage;
