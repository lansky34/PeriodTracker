export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOfWeek = new Date(firstDay);
  startOfWeek.setDate(firstDay.getDate() - firstDay.getDay());
  
  const days: Date[] = [];
  const currentDate = new Date(startOfWeek);
  
  for (let i = 0; i < 42; i++) { // 6 weeks
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function isSameMonth(date: Date, month: number, year: number): boolean {
  return date.getMonth() === month && date.getFullYear() === year;
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

export function calculateCycleDays(periods: Array<{startDate: string, endDate?: string}>): number[] {
  if (periods.length < 2) return [];
  
  // Sort periods by start date descending (most recent first)
  const sortedPeriods = [...periods].sort((a, b) => 
    parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime()
  );
  
  const cycleLengths: number[] = [];
  for (let i = 1; i < sortedPeriods.length; i++) {
    const current = parseDate(sortedPeriods[i].startDate);
    const previous = parseDate(sortedPeriods[i - 1].startDate);
    const daysDiff = Math.ceil((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 0) {
      cycleLengths.push(daysDiff);
    }
  }
  
  return cycleLengths;
}

export function predictNextPeriod(periods: Array<{startDate: string}>, avgCycleLength: number = 28): Date | null {
  if (periods.length === 0) return null;
  
  // Sort periods by start date descending and get the most recent
  const sortedPeriods = [...periods].sort((a, b) => 
    parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime()
  );
  
  const lastPeriod = sortedPeriods[0];
  const lastStart = parseDate(lastPeriod.startDate);
  return addDays(lastStart, avgCycleLength);
}

// Enhanced fertility and ovulation tracking functions
export function calculateOvulationDate(nextPeriodDate: Date, avgCycleLength: number = 28): Date {
  // Ovulation typically occurs 14 days before next period
  return addDays(nextPeriodDate, -14);
}

export function calculateFertileWindow(ovulationDate: Date): { start: Date; end: Date; peak: Date } {
  // Fertile window: 5 days before ovulation + ovulation day + 1 day after
  // Peak fertility: 2 days before ovulation to ovulation day
  return {
    start: addDays(ovulationDate, -5),
    end: addDays(ovulationDate, 1),
    peak: ovulationDate
  };
}

export function getCyclePhase(currentDay: number, cycleLength: number = 28): {
  name: string;
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  description: string;
} {
  if (currentDay <= 5) {
    return {
      name: 'Menstrual Phase',
      phase: 'menstrual',
      description: 'Your period is active. Focus on rest and self-care.'
    };
  } else if (currentDay <= Math.floor(cycleLength / 2) - 2) {
    return {
      name: 'Follicular Phase',
      phase: 'follicular',
      description: 'Energy levels are rising. Great time for new activities and challenges.'
    };
  } else if (currentDay <= Math.floor(cycleLength / 2) + 2) {
    return {
      name: 'Ovulation Phase',
      phase: 'ovulation',
      description: 'Peak fertility window. Your body is preparing for potential conception.'
    };
  } else {
    return {
      name: 'Luteal Phase',
      phase: 'luteal',
      description: 'Pre-menstrual phase. You may experience PMS symptoms.'
    };
  }
}

export function isInFertileWindow(date: Date, ovulationDate: Date): boolean {
  const fertileWindow = calculateFertileWindow(ovulationDate);
  return date >= fertileWindow.start && date <= fertileWindow.end;
}

export function isOvulationDay(date: Date, ovulationDate: Date): boolean {
  return isSameDay(date, ovulationDate);
}

export function isPeakFertilityDay(date: Date, ovulationDate: Date): boolean {
  const peakStart = addDays(ovulationDate, -2);
  const peakEnd = ovulationDate;
  return date >= peakStart && date <= peakEnd;
}

export function calculateCycleInsights(periods: Array<{startDate: string, endDate?: string}>): {
  avgCycleLength: number;
  avgPeriodLength: number;
  cycleVariation: number;
  regularity: 'regular' | 'irregular' | 'unknown';
  nextOvulation?: Date;
  fertileWindow?: { start: Date; end: Date };
  confidenceLevel: 'high' | 'medium' | 'low';
} {
  if (periods.length === 0) {
    return {
      avgCycleLength: 28,
      avgPeriodLength: 5,
      cycleVariation: 0,
      regularity: 'unknown',
      confidenceLevel: 'low'
    };
  }

  // Sort periods by start date descending for consistent ordering
  const sortedPeriods = [...periods].sort((a, b) => 
    parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime()
  );

  const cycleLengths = calculateCycleDays(sortedPeriods);
  const avgCycleLength = cycleLengths.length > 0 
    ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
    : 28;

  // Calculate average period length using sorted periods
  const periodLengths = sortedPeriods
    .filter(p => p.endDate)
    .map(p => {
      const start = parseDate(p.startDate);
      const end = parseDate(p.endDate!);
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    });
  
  const avgPeriodLength = periodLengths.length > 0
    ? Math.round(periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length)
    : 5;

  // Calculate cycle variation (standard deviation)
  let cycleVariation = 0;
  if (cycleLengths.length > 1) {
    const variance = cycleLengths.reduce((sum, length) => {
      return sum + Math.pow(length - avgCycleLength, 2);
    }, 0) / cycleLengths.length;
    cycleVariation = Math.round(Math.sqrt(variance));
  }

  // Determine regularity and confidence
  let regularity: 'regular' | 'irregular' | 'unknown' = 'unknown';
  let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
  
  if (cycleLengths.length >= 3) {
    regularity = cycleVariation <= 7 ? 'regular' : 'irregular';
    if (cycleLengths.length >= 6) {
      confidenceLevel = regularity === 'regular' ? 'high' : 'medium';
    } else {
      confidenceLevel = 'medium';
    }
  }

  // Calculate next ovulation and fertile window with regularity adjustments
  const nextPeriod = predictNextPeriod(sortedPeriods, avgCycleLength);
  let nextOvulation: Date | undefined;
  let fertileWindow: { start: Date; end: Date } | undefined;

  if (nextPeriod) {
    nextOvulation = calculateOvulationDate(nextPeriod, avgCycleLength);
    const baseWindow = calculateFertileWindow(nextOvulation);
    
    // Adjust fertile window based on regularity for irregular cycles
    if (regularity === 'irregular') {
      fertileWindow = { 
        start: addDays(baseWindow.start, -1), // One extra day before
        end: addDays(baseWindow.end, 1)       // One extra day after
      };
    } else {
      fertileWindow = { start: baseWindow.start, end: baseWindow.end };
    }
  }

  return {
    avgCycleLength,
    avgPeriodLength,
    cycleVariation,
    regularity,
    nextOvulation,
    fertileWindow,
    confidenceLevel
  };
}
