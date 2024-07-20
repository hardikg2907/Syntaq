import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent, UserWebhookEvent } from "@clerk/nextjs/server";
import { createNewUser, updateUser } from "~/server/db/queries";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload: UserWebhookEvent = (await req.json()) as UserWebhookEvent;
  const body: string = JSON.stringify(payload);
  //   payload = JSON.parse(body) as UserWebhookEvent;
  //   console.log(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  //   console.log("Webhook body:", payload);

  if (payload.type === "user.created") {
    await createNewUser(payload);
  }
  if (payload.type === "user.updated") {
    // Update user
    await updateUser(payload);
  }

  return new Response("", { status: 200 });
}
