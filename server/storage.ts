import { type User, type InsertUser, type Cycle, type InsertCycle, type Period, type InsertPeriod, type Symptom, type InsertSymptom } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cycles: Map<string, Cycle>;
  private periods: Map<string, Period>;
  private symptoms: Map<string, Symptom>;

  constructor() {
    this.users = new Map();
    this.cycles = new Map();
    this.periods = new Map();
    this.symptoms = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Cycle operations
  async getCyclesByUserId(userId: string): Promise<Cycle[]> {
    return Array.from(this.cycles.values())
      .filter(cycle => cycle.userId === userId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  async getCurrentCycle(userId: string): Promise<Cycle | undefined> {
    const cycles = await this.getCyclesByUserId(userId);
    return cycles.find(cycle => !cycle.isComplete) || cycles[0];
  }

  async createCycle(userId: string, insertCycle: InsertCycle): Promise<Cycle> {
    const id = randomUUID();
    const cycle: Cycle = {
      ...insertCycle,
      id,
      userId,
      endDate: insertCycle.endDate || null,
      cycleLength: insertCycle.cycleLength || null,
      periodLength: insertCycle.periodLength || null,
      isComplete: false,
      createdAt: new Date(),
    };
    this.cycles.set(id, cycle);
    return cycle;
  }

  async updateCycle(id: string, updateData: Partial<Cycle>): Promise<Cycle | undefined> {
    const cycle = this.cycles.get(id);
    if (!cycle) return undefined;
    
    const updatedCycle = { ...cycle, ...updateData };
    this.cycles.set(id, updatedCycle);
    return updatedCycle;
  }

  // Period operations
  async getPeriodsByUserId(userId: string): Promise<Period[]> {
    return Array.from(this.periods.values())
      .filter(period => period.userId === userId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  async createPeriod(userId: string, cycleId: string, insertPeriod: InsertPeriod): Promise<Period> {
    const id = randomUUID();
    const period: Period = {
      ...insertPeriod,
      id,
      userId,
      cycleId,
      endDate: insertPeriod.endDate || null,
      createdAt: new Date(),
    };
    this.periods.set(id, period);
    return period;
  }

  async updatePeriod(id: string, updateData: Partial<Period>): Promise<Period | undefined> {
    const period = this.periods.get(id);
    if (!period) return undefined;
    
    const updatedPeriod = { ...period, ...updateData };
    this.periods.set(id, updatedPeriod);
    return updatedPeriod;
  }

  // Symptom operations
  async getSymptomsByUserId(userId: string): Promise<Symptom[]> {
    return Array.from(this.symptoms.values())
      .filter(symptom => symptom.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getSymptomsByDateRange(userId: string, startDate: string, endDate: string): Promise<Symptom[]> {
    return Array.from(this.symptoms.values())
      .filter(symptom => 
        symptom.userId === userId &&
        symptom.date >= startDate &&
        symptom.date <= endDate
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createSymptom(userId: string, insertSymptom: InsertSymptom): Promise<Symptom> {
    const id = randomUUID();
    const currentCycle = await this.getCurrentCycle(userId);
    const symptom: Symptom = {
      ...insertSymptom,
      id,
      userId,
      cycleId: currentCycle?.id || null,
      flowIntensity: insertSymptom.flowIntensity || null,
      painLevel: insertSymptom.painLevel || null,
      mood: insertSymptom.mood || null,
      additionalSymptoms: insertSymptom.additionalSymptoms || null,
      notes: insertSymptom.notes || null,
      createdAt: new Date(),
    };
    this.symptoms.set(id, symptom);
    return symptom;
  }

  async updateSymptom(id: string, updateData: Partial<Symptom>): Promise<Symptom | undefined> {
    const symptom = this.symptoms.get(id);
    if (!symptom) return undefined;
    
    const updatedSymptom = { ...symptom, ...updateData };
    this.symptoms.set(id, updatedSymptom);
    return updatedSymptom;
  }

  async deleteSymptom(id: string): Promise<boolean> {
    return this.symptoms.delete(id);
  }
}

export const storage = new MemStorage();
