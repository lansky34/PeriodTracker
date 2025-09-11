import { sql } from "drizzle-orm";
import { pgTable, text, varchar, date, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cycles = pgTable("cycles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  cycleLength: integer("cycle_length"),
  periodLength: integer("period_length"),
  isComplete: boolean("is_complete").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const periods = pgTable("periods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cycleId: varchar("cycle_id").notNull().references(() => cycles.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const symptoms = pgTable("symptoms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cycleId: varchar("cycle_id").references(() => cycles.id),
  date: date("date").notNull(),
  flowIntensity: text("flow_intensity", { enum: ["none", "light", "medium", "heavy"] }),
  painLevel: text("pain_level", { enum: ["none", "mild", "moderate", "severe"] }),
  mood: text("mood", { enum: ["happy", "neutral", "sad", "irritated", "anxious", "energetic"] }),
  additionalSymptoms: text("additional_symptoms").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export const loginUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertCycleSchema = createInsertSchema(cycles).pick({
  startDate: true,
  endDate: true,
  cycleLength: true,
  periodLength: true,
});

export const insertPeriodSchema = createInsertSchema(periods).pick({
  startDate: true,
  endDate: true,
});

export const insertSymptomSchema = createInsertSchema(symptoms).pick({
  date: true,
  flowIntensity: true,
  painLevel: true,
  mood: true,
  additionalSymptoms: true,
  notes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCycle = z.infer<typeof insertCycleSchema>;
export type Cycle = typeof cycles.$inferSelect;
export type InsertPeriod = z.infer<typeof insertPeriodSchema>;
export type Period = typeof periods.$inferSelect;
export type InsertSymptom = z.infer<typeof insertSymptomSchema>;
export type Symptom = typeof symptoms.$inferSelect;
