import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { CalendarPlus, NotebookPen, Calendar, TrendingUp, Sprout, Heart, Flower } from "lucide-react";
import { getCyclePhase, calculateCycleInsights, formatDate, calculateCycleDays } from "../lib/date-utils";
import { NotificationSettings } from "@/components/notification-settings";
import { notificationService } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: currentCycle, isLoading: cycleLoading } = useQuery<any>({
    queryKey: ["/api/cycles/current"],
  });

  const { data: insights, isLoading: insightsLoading } = useQuery<any>({
    queryKey: ["/api/insights"],
  });

  const { data: symptoms } = useQuery<any[]>({
    queryKey: ["/api/symptoms"],
  });

  const { data: periods = [] } = useQuery<any[]>({
    queryKey: ["/api/periods"],
  });

  const recentSymptoms = symptoms?.slice(0, 3) || [];
  const cycleInsights = calculateCycleInsights(periods);

  // Schedule period reminders when insights are available  
  useEffect(() => {
    const scheduleNotifications = async () => {
      if (insights?.nextPeriodDate && insights.daysUntilNext > 0) {
        try {
          const settings = await notificationService.getNotificationSettings();
          if (settings.periodReminders) {
            // Cancel existing period reminder before scheduling new one to prevent duplicates
            await notificationService.cancelPeriodReminder();
            await notificationService.schedulePeriodReminder(insights.nextPeriodDate, settings);
          }
        } catch (error) {
          console.error('Failed to schedule period reminder:', error);
          toast({
            title: "Period Reminder",
            description: (error as Error).message || "Failed to schedule period reminder",
            variant: "destructive"
          });
        }
      }
    };

    scheduleNotifications();
  }, [insights?.nextPeriodDate, insights?.daysUntilNext]);

  const calculateCurrentCycleDay = () => {
    if (!currentCycle?.startDate) return 1;
    
    const startDate = new Date(currentCycle.startDate);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(1, diffDays);
  };

  const getCurrentPhase = (cycleDay: number) => {
    const phase = getCyclePhase(cycleDay, cycleInsights.avgCycleLength);
    
    switch (phase.phase) {
      case 'menstrual':
        return {
          ...phase,
          icon: <i className="fas fa-tint text-2xl text-primary"></i>,
          color: "primary"
        };
      case 'follicular':
        return {
          ...phase,
          icon: <Flower className="w-8 h-8 text-secondary" />,
          color: "secondary"
        };
      case 'ovulation':
        return {
          ...phase,
          icon: <Sprout className="w-8 h-8 text-accent" />,
          color: "accent"
        };
      case 'luteal':
        return {
          ...phase,
          icon: <Heart className="w-8 h-8 text-muted-foreground" />,
          color: "muted"
        };
      default:
        return {
          ...phase,
          icon: <Calendar className="w-8 h-8 text-muted-foreground" />,
          color: "muted"
        };
    }
  };

  const currentCycleDay = calculateCurrentCycleDay();
  const currentPhase = getCurrentPhase(currentCycleDay);
  const daysUntilNext = insights?.daysUntilNext || 0;

  if (cycleLoading || insightsLoading) {
    return (
      <div className="p-4 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary mb-1" data-testid="text-cycle-day">
              Day {currentCycleDay}
            </div>
            <div className="text-sm text-muted-foreground">Current cycle day</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary mb-1" data-testid="text-days-until-next">
              {daysUntilNext}
            </div>
            <div className="text-sm text-muted-foreground">Days until next period</div>
          </CardContent>
        </Card>
      </div>

      {/* Cycle Insights */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Cycle Insights</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-sm text-muted-foreground">Cycle Regularity</div>
                <Badge 
                  variant={cycleInsights.regularity === 'regular' ? 'default' : 
                         cycleInsights.regularity === 'irregular' ? 'destructive' : 'secondary'}
                  data-testid="badge-regularity"
                >
                  {cycleInsights.regularity === 'unknown' ? 'Need more data' : cycleInsights.regularity}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Prediction Confidence</div>
                <Badge 
                  variant={cycleInsights.confidenceLevel === 'high' ? 'default' : 
                         cycleInsights.confidenceLevel === 'medium' ? 'secondary' : 'outline'}
                  data-testid="badge-confidence"
                >
                  {cycleInsights.confidenceLevel} confidence
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Average cycle</div>
              <div className="font-medium">{cycleInsights.avgCycleLength} days</div>
            </div>
          </div>
          {cycleInsights.nextOvulation && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium text-accent">Next fertile window</div>
              <div className="text-sm text-muted-foreground">
                {cycleInsights.fertileWindow && (
                  <>
                    {formatDate(cycleInsights.fertileWindow.start)} - {formatDate(cycleInsights.fertileWindow.end)}
                  </>
                )}
                <span className="ml-2">
                  (Ovulation: {formatDate(cycleInsights.nextOvulation)})
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analytics Dashboard */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            <TrendingUp className="w-5 h-5 inline mr-2" />
            Cycle Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cycle Length Trends */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">Cycle Length Patterns</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Length</span>
                  <span className="font-bold text-primary">{cycleInsights.avgCycleLength} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Variation</span>
                  <span className="font-medium text-muted-foreground">±{cycleInsights.cycleVariation} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Period Length</span>
                  <span className="font-medium text-secondary">{cycleInsights.avgPeriodLength} days</span>
                </div>
              </div>
              
              {/* Recent Cycles Visual */}
              {periods.length > 1 && (
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">Last 6 Cycles</div>
                  <div className="flex items-end space-x-1 h-16">
                    {calculateCycleDays(periods).slice(0, 6).map((days, index) => {
                      const height = Math.min((days / 35) * 100, 100);
                      const isNormal = Math.abs(days - cycleInsights.avgCycleLength) <= 3;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t ${
                              isNormal ? 'bg-primary' : 'bg-amber-500'
                            } opacity-80`}
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs text-muted-foreground mt-1">{days}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Cycle Regularity Analysis */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">Regularity Analysis</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge 
                    variant={cycleInsights.regularity === 'regular' ? 'default' : 
                           cycleInsights.regularity === 'irregular' ? 'destructive' : 'secondary'}
                  >
                    {cycleInsights.regularity === 'unknown' ? 'Need more data' : cycleInsights.regularity}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confidence</span>
                  <Badge 
                    variant={cycleInsights.confidenceLevel === 'high' ? 'default' : 
                           cycleInsights.confidenceLevel === 'medium' ? 'secondary' : 'outline'}
                  >
                    {cycleInsights.confidenceLevel}
                  </Badge>
                </div>
                
                {/* Regularity Score Visual */}
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1">Consistency Score</div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        cycleInsights.regularity === 'regular' 
                          ? 'bg-green-500' 
                          : cycleInsights.regularity === 'irregular'
                          ? 'bg-amber-500'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: cycleInsights.regularity === 'regular' 
                          ? '90%' 
                          : cycleInsights.regularity === 'irregular'
                          ? '50%'
                          : '20%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fertility Window Tracking */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">Fertility Tracking</h3>
              {cycleInsights.nextOvulation && cycleInsights.fertileWindow ? (
                <div className="space-y-3">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <div className="text-sm font-medium text-accent mb-1">Next Ovulation</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(cycleInsights.nextOvulation)}
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <div className="text-sm font-medium text-secondary mb-1">Fertile Window</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(cycleInsights.fertileWindow.start)} - {formatDate(cycleInsights.fertileWindow.end)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ({Math.ceil((cycleInsights.fertileWindow.end.getTime() - cycleInsights.fertileWindow.start.getTime()) / (1000 * 60 * 60 * 24)) + 1} days)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Track more cycles for fertility predictions
                </div>
              )}
            </div>
          </div>

          {/* Symptom Pattern Analysis */}
          {symptoms && symptoms.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-sm text-muted-foreground mb-4">Symptom Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Most Common Mood</div>
                  <div className="text-sm font-medium">
                    {(() => {
                      const moods = symptoms.filter(s => s.mood).map(s => s.mood);
                      if (moods.length === 0) return 'No data';
                      const moodCounts = moods.reduce((acc: any, mood) => {
                        acc[mood] = (acc[mood] || 0) + 1;
                        return acc;
                      }, {});
                      const mostCommon = Object.keys(moodCounts).reduce((a, b) => 
                        moodCounts[a] > moodCounts[b] ? a : b
                      );
                      return mostCommon;
                    })()}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Average Pain Level</div>
                  <div className="text-sm font-medium">
                    {(() => {
                      const painLevels = symptoms
                        .filter(s => s.painLevel)
                        .map(s => parseInt(s.painLevel));
                      if (painLevels.length === 0) return 'No data';
                      const avg = painLevels.reduce((a, b) => a + b, 0) / painLevels.length;
                      return `${avg.toFixed(1)}/10`;
                    })()}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Flow Intensity</div>
                  <div className="text-sm font-medium">
                    {(() => {
                      const flows = symptoms.filter(s => s.flowIntensity).map(s => s.flowIntensity);
                      if (flows.length === 0) return 'No data';
                      const flowCounts = flows.reduce((acc: any, flow) => {
                        acc[flow] = (acc[flow] || 0) + 1;
                        return acc;
                      }, {});
                      const mostCommon = Object.keys(flowCounts).reduce((a, b) => 
                        flowCounts[a] > flowCounts[b] ? a : b
                      );
                      return mostCommon;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Current Status</h2>
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              currentPhase.color === 'primary' ? 'bg-primary' :
              currentPhase.color === 'secondary' ? 'bg-secondary' :
              currentPhase.color === 'accent' ? 'bg-accent' :
              'bg-muted'
            }`}>
              {currentPhase.icon}
            </div>
            <div>
              <h3 className="font-medium text-lg" data-testid="text-current-phase">
                {currentPhase.name}
              </h3>
              <p className="text-muted-foreground" data-testid="text-phase-description">
                {currentPhase.description}
              </p>
              <div className="mt-2">
                <Badge variant="secondary" data-testid="badge-phase-status">
                  {currentPhase.name.split(" ")[0].toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center p-6 h-auto bg-muted hover:bg-border"
              onClick={() => setLocation("/symptoms")}
              data-testid="button-log-symptoms"
            >
              <NotebookPen className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">Log Symptoms</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center p-6 h-auto bg-muted hover:bg-border"
              onClick={() => setLocation("/calendar")}
              data-testid="button-mark-period"
            >
              <CalendarPlus className="w-8 h-8 text-secondary mb-2" />
              <span className="text-sm font-medium">Mark Period</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <NotificationSettings />

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {recentSymptoms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <NotebookPen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start tracking your symptoms to see activity here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSymptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center space-x-3" data-testid={`activity-${symptom.id}`}>
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <NotebookPen className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Symptoms logged</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(symptom.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {symptom.flowIntensity && (
                      <Badge variant="outline" className="mr-1">
                        {symptom.flowIntensity}
                      </Badge>
                    )}
                    {symptom.mood && (
                      <Badge variant="outline">
                        {symptom.mood}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button - Mobile */}
      <div className="fixed bottom-20 right-6 md:hidden">
        <Button
          size="icon"
          className="w-14 h-14 rounded-full shadow-lg"
          onClick={() => setLocation("/symptoms")}
          data-testid="button-fab-quick-add"
        >
          <i className="fas fa-plus text-xl"></i>
        </Button>
      </div>
    </div>
  );
}
