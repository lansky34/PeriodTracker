import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginUserSchema, insertCycleSchema, insertPeriodSchema, insertSymptomSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreConstructor = MemoryStore(session);

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreConstructor({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Cycle routes
  app.get("/api/cycles", requireAuth, async (req, res) => {
    const cycles = await storage.getCyclesByUserId(req.session.userId!);
    res.json(cycles);
  });

  app.get("/api/cycles/current", requireAuth, async (req, res) => {
    const cycle = await storage.getCurrentCycle(req.session.userId!);
    res.json(cycle);
  });

  app.post("/api/cycles", requireAuth, async (req, res) => {
    try {
      const cycleData = insertCycleSchema.parse(req.body);
      const cycle = await storage.createCycle(req.session.userId!, cycleData);
      res.json(cycle);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Period routes
  app.get("/api/periods", requireAuth, async (req, res) => {
    const periods = await storage.getPeriodsByUserId(req.session.userId!);
    res.json(periods);
  });

  app.post("/api/periods", requireAuth, async (req, res) => {
    try {
      const periodData = insertPeriodSchema.parse(req.body);
      const currentCycle = await storage.getCurrentCycle(req.session.userId!);
      
      if (!currentCycle) {
        // Create a new cycle if none exists
        const newCycle = await storage.createCycle(req.session.userId!, {
          startDate: periodData.startDate,
          endDate: null,
          cycleLength: null,
          periodLength: null,
        });
        const period = await storage.createPeriod(req.session.userId!, newCycle.id, periodData);
        return res.json(period);
      }

      const period = await storage.createPeriod(req.session.userId!, currentCycle.id, periodData);
      res.json(period);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Symptom routes
  app.get("/api/symptoms", requireAuth, async (req, res) => {
    const { startDate, endDate } = req.query;
    
    if (startDate && endDate) {
      const symptoms = await storage.getSymptomsByDateRange(
        req.session.userId!,
        startDate as string,
        endDate as string
      );
      return res.json(symptoms);
    }
    
    const symptoms = await storage.getSymptomsByUserId(req.session.userId!);
    res.json(symptoms);
  });

  app.post("/api/symptoms", requireAuth, async (req, res) => {
    try {
      const symptomData = insertSymptomSchema.parse(req.body);
      const symptom = await storage.createSymptom(req.session.userId!, symptomData);
      res.json(symptom);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put("/api/symptoms/:id", requireAuth, async (req, res) => {
    try {
      const symptomData = insertSymptomSchema.parse(req.body);
      const symptom = await storage.updateSymptom(req.params.id, symptomData);
      
      if (!symptom) {
        return res.status(404).json({ message: "Symptom not found" });
      }
      
      res.json(symptom);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete("/api/symptoms/:id", requireAuth, async (req, res) => {
    const success = await storage.deleteSymptom(req.params.id);
    
    if (!success) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    
    res.json({ message: "Symptom deleted successfully" });
  });

  // Statistics/Insights route
  app.get("/api/insights", requireAuth, async (req, res) => {
    const cycles = await storage.getCyclesByUserId(req.session.userId!);
    const periods = await storage.getPeriodsByUserId(req.session.userId!);
    const symptoms = await storage.getSymptomsByUserId(req.session.userId!);

    const completedCycles = cycles.filter(c => c.isComplete && c.cycleLength);
    const avgCycleLength = completedCycles.length > 0 
      ? Math.round(completedCycles.reduce((sum, c) => sum + (c.cycleLength || 0), 0) / completedCycles.length)
      : 28;

    const avgPeriodLength = periods.length > 0
      ? Math.round(periods.filter(p => p.endDate).reduce((sum, p) => {
          const start = new Date(p.startDate);
          const end = new Date(p.endDate!);
          return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / periods.filter(p => p.endDate).length)
      : 5;

    // Calculate cycle variation
    const cycleLengths = completedCycles.map(c => c.cycleLength || 0).filter(l => l > 0);
    const cycleVariation = cycleLengths.length > 1 
      ? Math.round(Math.sqrt(cycleLengths.reduce((sum, length) => sum + Math.pow(length - avgCycleLength, 2), 0) / cycleLengths.length))
      : 0;

    // Predict next period
    const lastPeriod = periods[0];
    let nextPeriodDate = null;
    let daysUntilNext = 0;

    if (lastPeriod) {
      const lastStart = new Date(lastPeriod.startDate);
      const nextStart = new Date(lastStart.getTime() + avgCycleLength * 24 * 60 * 60 * 1000);
      nextPeriodDate = nextStart.toISOString().split('T')[0];
      
      const today = new Date();
      daysUntilNext = Math.ceil((nextStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Common symptoms analysis
    const symptomCounts: Record<string, number> = {};
    symptoms.forEach(symptom => {
      if (symptom.additionalSymptoms) {
        symptom.additionalSymptoms.forEach(s => {
          symptomCounts[s] = (symptomCounts[s] || 0) + 1;
        });
      }
    });

    const commonSymptoms = Object.entries(symptomCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / symptoms.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      averageCycleLength: avgCycleLength,
      averagePeriodLength: avgPeriodLength,
      cycleVariation: cycleVariation,
      totalCycles: cycles.length,
      nextPeriodDate,
      daysUntilNext: Math.max(0, daysUntilNext),
      commonSymptoms
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
