// // import type { UserJSON, UserWebhookEvent } from "@clerk/nextjs/server";
// import { eq, gte, like } from "drizzle-orm";
// import { db } from ".";
// import { hackathons, users } from "./schema";

// // users

// export const createNewUser = async (payload: UserWebhookEvent) => {
//   try {
//     const data = payload.data as UserJSON;
//     // console.log(data);
//     await db.insert(users).values({
//       id: data.id,
//       email: data.email_addresses[0]!.email_address,
//       firstName: data.first_name!,
//       lastName: data.last_name!,
//       username: data.username! || data.email_addresses[0]!.email_address,
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };
// export const updateUser = async (payload: UserWebhookEvent) => {
//   try {
//     const data = payload.data as UserJSON;
//     // console.log(data);
//     await db
//       .update(users)
//       .set({
//         firstName: data.first_name!,
//         lastName: data.last_name!,
//         username: data.username!,
//       })
//       .where(eq(users.id, data.id));
//   } catch (err) {
//     console.error(err);
//   }
// };

// export const getUserByUsername = async (username: string | null) => {
//   try {
//     const res = await db
//       .select()
//       .from(users)
//       .where(like(users.username, `${username || ""}%`));
//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// };

// // hackathons

// export const discoverUpcomingHackathons = async () => {
//   try {
//     const res = await db
//       .select({
//         id: hackathons.id,
//         name: hackathons.name,
//         startDate: hackathons.startDate,
//         photo: hackathons.photo,
//       })
//       .from(hackathons)
//       .where(gte(hackathons.registrationClose, new Date()));
//     // console.log(res);
//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getHackathonById = async (id: number) => {
//   try {
//     const res = await db
//       .select({
//         name: hackathons.name,
//         subtitle: hackathons.subtitle,
//         startDate: hackathons.startDate,
//         endDate: hackathons.endDate,
//         description: hackathons.description,
//         location: hackathons.location,
//         registrationOpen: hackathons.registrationOpen,
//         registrationClose: hackathons.registrationClose,
//         photo: hackathons.photo,
//         organizer: {
//           firstName: users.firstName,
//           lastName: users.lastName,
//         },
//         minTeamSize: hackathons.minTeamSize,
//         maxTeamSize: hackathons.maxTeamSize,
//       })
//       .from(hackathons)
//       .leftJoin(users, eq(hackathons.organizerId, users.id))
//       .where(eq(hackathons.id, id));
//     // console.log(res);
//     return res[0];
//   } catch (error) {
//     console.log(error);
//   }
// };

// // export const checkIfAlreadyRegistered = async (userId: string, hackathonId: number) => {
// //   try {
// //     const res = await db
// //       .select()
// //       .from(teamHackathon)
// //       .where(and(eq(teamHackathon.teamId, userId), eq(teamHackathon.hackathonId, hackathonId)));
// //     return res.length > 0;
// //   } catch (error) {
// //     console.log(error);
// //   }
// // };

// // export const registerForHackathon = async (hackathonId: number, userId: string) => {
