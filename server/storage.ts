import { users, cycles, periods, symptoms, type User, type InsertUser, type Cycle, type InsertCycle, type Period, type InsertPeriod, type Symptom, type InsertSymptom } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Cycle operations
  getCyclesByUserId(userId: string): Promise<Cycle[]>;
  getCurrentCycle(userId: string): Promise<Cycle | undefined>;
  createCycle(userId: string, cycle: InsertCycle): Promise<Cycle>;
  updateCycle(id: string, cycle: Partial<Cycle>): Promise<Cycle | undefined>;
  
  // Period operations
  getPeriodsByUserId(userId: string): Promise<Period[]>;
  createPeriod(userId: string, cycleId: string, period: InsertPeriod): Promise<Period>;
  updatePeriod(id: string, period: Partial<Period>): Promise<Period | undefined>;
  
  // Symptom operations
  getSymptomsByUserId(userId: string): Promise<Symptom[]>;
  getSymptomsByDateRange(userId: string, startDate: string, endDate: string): Promise<Symptom[]>;
  createSymptom(userId: string, symptom: InsertSymptom): Promise<Symptom>;
  updateSymptom(id: string, symptom: Partial<Symptom>): Promise<Symptom | undefined>;
  deleteSymptom(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  // Cycle operations
  async getCyclesByUserId(userId: string): Promise<Cycle[]> {
    return await db
      .select()
      .from(cycles)
      .where(eq(cycles.userId, userId))
      .orderBy(desc(cycles.startDate));
  }

  async getCurrentCycle(userId: string): Promise<Cycle | undefined> {
    const userCycles = await this.getCyclesByUserId(userId);
    return userCycles.find(cycle => !cycle.isComplete) || userCycles[0];
  }

  async createCycle(userId: string, insertCycle: InsertCycle): Promise<Cycle> {
    const [cycle] = await db
      .insert(cycles)
      .values({
        ...insertCycle,
        userId,
        endDate: insertCycle.endDate || null,
        cycleLength: insertCycle.cycleLength || null,
        periodLength: insertCycle.periodLength || null,
        isComplete: false,
      })
      .returning();
    return cycle;
  }

  async updateCycle(id: string, updateData: Partial<Cycle>): Promise<Cycle | undefined> {
    const [updatedCycle] = await db
      .update(cycles)
      .set(updateData)
      .where(eq(cycles.id, id))
      .returning();
    return updatedCycle || undefined;
  }

  // Period operations
  async getPeriodsByUserId(userId: string): Promise<Period[]> {
    return await db
      .select()
      .from(periods)
      .where(eq(periods.userId, userId))
      .orderBy(desc(periods.startDate));
  }

  async createPeriod(userId: string, cycleId: string, insertPeriod: InsertPeriod): Promise<Period> {
    const [period] = await db
      .insert(periods)
      .values({
        ...insertPeriod,
        userId,
        cycleId,
        endDate: insertPeriod.endDate || null,
      })
      .returning();
    return period;
  }

  async updatePeriod(id: string, updateData: Partial<Period>): Promise<Period | undefined> {
    const [updatedPeriod] = await db
      .update(periods)
      .set(updateData)
      .where(eq(periods.id, id))
      .returning();
    return updatedPeriod || undefined;
  }

  // Symptom operations
  async getSymptomsByUserId(userId: string): Promise<Symptom[]> {
    return await db
      .select()
      .from(symptoms)
      .where(eq(symptoms.userId, userId))
      .orderBy(desc(symptoms.date));
  }

  async getSymptomsByDateRange(userId: string, startDate: string, endDate: string): Promise<Symptom[]> {
    return await db
      .select()
      .from(symptoms)
      .where(
        and(
          eq(symptoms.userId, userId),
          gte(symptoms.date, startDate),
          lte(symptoms.date, endDate)
        )
      )
      .orderBy(desc(symptoms.date));
  }

  async createSymptom(userId: string, insertSymptom: InsertSymptom): Promise<Symptom> {
    const currentCycle = await this.getCurrentCycle(userId);
    const [symptom] = await db
      .insert(symptoms)
      .values({
        ...insertSymptom,
        userId,
        cycleId: currentCycle?.id || null,
        flowIntensity: insertSymptom.flowIntensity || null,
        painLevel: insertSymptom.painLevel || null,
        mood: insertSymptom.mood || null,
        additionalSymptoms: insertSymptom.additionalSymptoms || null,
        notes: insertSymptom.notes || null,
      })
      .returning();
    return symptom;
  }

  async updateSymptom(id: string, updateData: Partial<Symptom>): Promise<Symptom | undefined> {
    const [updatedSymptom] = await db
      .update(symptoms)
      .set(updateData)
      .where(eq(symptoms.id, id))
      .returning();
    return updatedSymptom || undefined;
  }

  async deleteSymptom(id: string): Promise<boolean> {
    const result = await db
      .delete(symptoms)
      .where(eq(symptoms.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
