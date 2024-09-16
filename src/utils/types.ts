// import type { Session } from "next-auth";

import { z } from "zod";

export interface User {
  first_name: string;
  last_name: string;
  pk: string;
  username: string;
}

export interface Session {
  access_token: string;
  email: string;
  exp: number;
  iat: number;
  jti: string;
  name: string;
  picture: string;
  ref: number;
  refresh_token: string;
  sub: string;
  user: User;
}

// export type Session = Token;

const hackathonSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(1, "Required Field")
    .max(256, "Name must be less than 256 characters"),
  subtitle: z
    .string()
    .max(256, "Subtitle must be less than 256 characters")
    .optional(),
  description: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  location: z.string().max(256, "Location must be less than 256 characters"),
  registrationOpen: z.date(),
  registrationClose: z.date(),
  maxTeamSize: z.coerce.number().min(1, "Max team size must be at least 1"),
  minTeamSize: z.coerce.number().min(1, "Min team size must be at least 1"),
  photo: z.string().default("").optional(),
});
console.log(typeof hackathonSchema);
export type Hackathon = z.infer<typeof hackathonSchema>;
