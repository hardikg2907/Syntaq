import { NextRequest } from "next/server";
import { getUserByUsername } from "~/server/db/queries";

export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams.get("query");
  console.log(query);

  const users = await getUserByUsername(query);

  return Response.json({ users });
  // const hackathon = await getHackathonById(parseInt(id));
  // return hackathon;
};
