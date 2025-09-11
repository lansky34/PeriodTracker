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
  // Flow and bleeding
  flowIntensity: text("flow_intensity", { enum: ["none", "light", "medium", "heavy"] }),
  // Pain levels
  painLevel: text("pain_level", { enum: ["none", "mild", "moderate", "severe"] }),
  crampingLevel: text("cramping_level", { enum: ["none", "mild", "moderate", "severe"] }),
  // Emotional symptoms
  mood: text("mood", { enum: ["happy", "content", "neutral", "sad", "irritated", "anxious", "depressed", "energetic", "stressed"] }),
  energyLevel: text("energy_level", { enum: ["very_low", "low", "normal", "high", "very_high"] }),
  // Physical symptoms
  physicalSymptoms: text("physical_symptoms").array(),
  // Sleep and lifestyle
  sleepQuality: text("sleep_quality", { enum: ["very_poor", "poor", "fair", "good", "excellent"] }),
  sleepHours: integer("sleep_hours"),
  // Digestive symptoms
  digestiveSymptoms: text("digestive_symptoms").array(),
  // Skin and appearance
  skinCondition: text("skin_condition", { enum: ["clear", "mild_acne", "moderate_acne", "severe_acne", "dry", "oily"] }),
  // Cravings and appetite
  foodCravings: text("food_cravings").array(),
  appetiteLevel: text("appetite_level", { enum: ["very_low", "low", "normal", "high", "very_high"] }),
  // Exercise and activity
  exerciseLevel: text("exercise_level", { enum: ["none", "light", "moderate", "intense"] }),
  exerciseType: text("exercise_type").array(),
  // Legacy field for backward compatibility
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
  crampingLevel: true,
  mood: true,
  energyLevel: true,
  physicalSymptoms: true,
  sleepQuality: true,
  sleepHours: true,
  digestiveSymptoms: true,
  skinCondition: true,
  foodCravings: true,
  appetiteLevel: true,
  exerciseLevel: true,
  exerciseType: true,
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
