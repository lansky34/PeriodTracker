export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
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
  
  const cycleLengths: number[] = [];
  for (let i = 1; i < periods.length; i++) {
    const current = new Date(periods[i].startDate);
    const previous = new Date(periods[i - 1].startDate);
    const daysDiff = Math.ceil((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 0) {
      cycleLengths.push(daysDiff);
    }
  }
  
  return cycleLengths;
}

export function predictNextPeriod(periods: Array<{startDate: string}>, avgCycleLength: number = 28): Date | null {
  if (periods.length === 0) return null;
  
  const lastPeriod = periods[0];
  const lastStart = new Date(lastPeriod.startDate);
  return addDays(lastStart, avgCycleLength);
}
