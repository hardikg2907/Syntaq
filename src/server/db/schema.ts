// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { InferInsertModel, sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { TEAMNAMESIZE } from "~/utils/constants";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `syntaq_${name}`);

export const users = createTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  username: varchar("username", { length: 256 }).unique(),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const teams = createTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: TEAMNAMESIZE }).notNull(),
  members: varchar("members", { length: 36 })
    .array()
    .notNull()
    .default(sql`ARRAY[]::varchar[]`),
  leaderId: varchar("leader_id", { length: 36 }).references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const hackathons = createTable("hackathons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  subtitle: varchar("subtitle", { length: 256 }),
  description: text("description"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  organizerId: varchar("organizer_id", { length: 36 }).references(
    () => users.id,
  ),
  registrationOpen: timestamp("registration_open").notNull(),
  registrationClose: timestamp("registration_close").notNull(),
  location: varchar("location", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  photo: text("photo"),
  maxTeamSize: integer("max_team_size").notNull().default(4),
  minTeamSize: integer("min_team_size").notNull().default(1),
});

export const teamHackathon = createTable("team_hackathon", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  hackathonId: integer("hackathon_id").references(() => hackathons.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type InsertHackathon = InferInsertModel<typeof hackathons>;
