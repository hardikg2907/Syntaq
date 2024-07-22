import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { hackathons } from "~/server/db/schema";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // console.log(data);
    const user = auth().userId;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }
    // console.log(user);

    await db.insert(hackathons).values({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      registrationOpen: new Date(data.registrationOpen),
      registrationClose: new Date(data.registrationClose),
      organizerId: user,
    });
    console.log("done");

    return Response.json({ message: "Success" });
  } catch (e: any) {
    console.error(e);
    return new Response(e.message, { status: 500 });
  }
}
