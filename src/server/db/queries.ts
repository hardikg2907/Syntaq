import type { UserJSON, UserWebhookEvent } from "@clerk/nextjs/server";
import { db } from ".";
import { hackathons, users } from "./schema";
import { and, eq, gte } from "drizzle-orm";

// users

export const createNewUser = async (payload: UserWebhookEvent) => {
  try {
    const data = payload.data as UserJSON;
    // console.log(data);
    await db.insert(users).values({
      id: data.id,
      email: data.email_addresses[0]!.email_address,
      firstName: data.first_name!,
      lastName: data.last_name!,
    });
  } catch (err) {
    console.error(err);
  }
};
export const updateUser = async (payload: UserWebhookEvent) => {
  try {
    const data = payload.data as UserJSON;
    // console.log(data);
    await db
      .update(users)
      .set({
        firstName: data.first_name!,
        lastName: data.last_name!,
      })
      .where(eq(users.id, data.id));
  } catch (err) {
    console.error(err);
  }
};

// hackathons

export const discoverUpcomingHackathons = async () => {
  try {
    const res = await db
      .select({
        id: hackathons.id,
        name: hackathons.name,
        startDate: hackathons.startDate,
        photo: hackathons.photo,
      })
      .from(hackathons)
      .where(gte(hackathons.registrationClose, new Date()));
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
