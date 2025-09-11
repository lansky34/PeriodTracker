import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDaysInMonth, isSameMonth, isToday, formatDate, getMonthName, isSameDay, parseDate, calculateCycleInsights, isInFertileWindow, isOvulationDay, isPeakFertilityDay } from "../lib/date-utils";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PeriodCalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export default function PeriodCalendar({ onDateSelect, selectedDate }: PeriodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: periods = [] } = useQuery<any[]>({
    queryKey: ["/api/periods"],
  });

  const { data: symptoms = [] } = useQuery<any[]>({
    queryKey: ["/api/symptoms"],
  });

  const { data: insights } = useQuery<any>({
    queryKey: ["/api/insights"],
  });

  const cycleInsights = calculateCycleInsights(periods);

  const createPeriod = useMutation({
    mutationFn: async (data: { startDate: string; endDate?: string }) => {
      const response = await apiRequest("POST", "/api/periods", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/periods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cycles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
      toast({
        title: "Period marked",
        description: "Period has been added to your calendar.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark period. Please try again.",
      });
    },
  });

  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isPeriodDay = (date: Date): boolean => {
    return periods.some(period => {
      const startDate = parseDate(period.startDate);
      const endDate = period.endDate ? parseDate(period.endDate) : startDate;
      return date >= startDate && date <= endDate;
    });
  };

  const isPredictionDay = (date: Date): boolean => {
    if (!insights?.nextPeriodDate) return false;
    
    const predictedStart = parseDate(insights.nextPeriodDate);
    const predictedEnd = new Date(predictedStart.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days
    
    return date >= predictedStart && date <= predictedEnd;
  };

  const isFertileDay = (date: Date): boolean => {
    if (!cycleInsights.nextOvulation) return false;
    return isInFertileWindow(date, cycleInsights.nextOvulation);
  };

  const isOvulationCalendarDay = (date: Date): boolean => {
    if (!cycleInsights.nextOvulation) return false;
    return isOvulationDay(date, cycleInsights.nextOvulation);
  };

  const isPeakFertility = (date: Date): boolean => {
    if (!cycleInsights.nextOvulation) return false;
    return isPeakFertilityDay(date, cycleInsights.nextOvulation);
  };

  const hasSymptoms = (date: Date): boolean => {
    return symptoms.some(symptom => isSameDay(parseDate(symptom.date), date));
  };

  const getSymptomIndicator = (date: Date) => {
    const daySymptoms = symptoms.filter(symptom => isSameDay(parseDate(symptom.date), date));
    if (daySymptoms.length === 0) return null;

    const symptom = daySymptoms[0];
    
    // Priority: flow > pain > mood
    if (symptom.flowIntensity && symptom.flowIntensity !== "none") {
      return `flow-${symptom.flowIntensity}`;
    }
    if (symptom.painLevel && symptom.painLevel !== "none") {
      return `pain-${symptom.painLevel === "mild" ? "low" : symptom.painLevel === "moderate" ? "medium" : "high"}`;
    }
    if (symptom.mood) {
      return symptom.mood === "happy" || symptom.mood === "energetic" ? "mood-good" : 
             symptom.mood === "neutral" ? "mood-neutral" : "mood-bad";
    }
    
    return "mood-neutral";
  };

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    } else {
      // Default behavior: mark as period start
      const dateStr = formatDate(date);
      createPeriod.mutate({ startDate: dateStr });
    }
  };

  const getDayClassName = (date: Date): string => {
    let className = "relative p-2 text-center cursor-pointer rounded-md transition-colors ";
    
    if (!isSameMonth(date, currentMonth.getMonth(), currentMonth.getFullYear())) {
      className += "text-muted-foreground ";
    }

    if (isPeriodDay(date)) {
      className += "period-day ";
    } else if (isPredictionDay(date)) {
      className += "prediction-day ";
    } else if (isOvulationCalendarDay(date)) {
      className += "ovulation-day ";
    } else if (isPeakFertility(date)) {
      className += "peak-fertility-day ";
    } else if (isFertileDay(date)) {
      className += "fertile-day ";
    } else {
      className += "hover:bg-muted ";
    }

    if (isToday(date)) {
      className += "ring-2 ring-primary ";
    }

    if (selectedDate && isSameDay(date, selectedDate)) {
      className += "ring-2 ring-accent ";
    }

    return className;
  };

  return (
    <Card>
      <CardContent className="p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            data-testid="button-previous-month"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold" data-testid="text-current-month">
            {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            data-testid="button-next-month"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const symptomIndicator = getSymptomIndicator(date);
            
            return (
              <div
                key={index}
                className={getDayClassName(date)}
                onClick={() => handleDateClick(date)}
                data-testid={`calendar-day-${date.getDate()}`}
              >
                <span className="text-sm">{date.getDate()}</span>
                {symptomIndicator && (
                  <div className={`symptom-indicator ${symptomIndicator}`} data-testid="symptom-indicator" />
                )}
              </div>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium mb-3">Legend</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 period-day rounded"></div>
              <span>Period days</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 ovulation-day rounded"></div>
              <span>Ovulation day</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 peak-fertility-day rounded"></div>
              <span>Peak fertility</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 fertile-day rounded"></div>
              <span>Fertile window</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 prediction-day rounded"></div>
              <span>Predicted period</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-muted rounded relative">
                <div className="symptom-indicator mood-good"></div>
              </div>
              <span>Symptoms logged</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
