import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { CalendarPlus, NotebookPen, Calendar, TrendingUp, Sprout } from "lucide-react";

export default function DashboardPage() {
  const [, setLocation] = useLocation();

  const { data: currentCycle, isLoading: cycleLoading } = useQuery<any>({
    queryKey: ["/api/cycles/current"],
  });

  const { data: insights, isLoading: insightsLoading } = useQuery<any>({
    queryKey: ["/api/insights"],
  });

  const { data: symptoms } = useQuery<any[]>({
    queryKey: ["/api/symptoms"],
  });

  const recentSymptoms = symptoms?.slice(0, 3) || [];

  const calculateCurrentCycleDay = () => {
    if (!currentCycle?.startDate) return 1;
    
    const startDate = new Date(currentCycle.startDate);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(1, diffDays);
  };

  const getCurrentPhase = (cycleDay: number) => {
    if (cycleDay <= 5) {
      return {
        name: "Menstrual Phase",
        description: "Period is active. Track symptoms for better insights.",
        icon: <i className="fas fa-tint text-2xl text-primary"></i>,
        color: "primary"
      };
    } else if (cycleDay <= 13) {
      return {
        name: "Follicular Phase",
        description: "Energy levels are rising. Great time for new activities.",
        icon: <i className="fas fa-leaf text-2xl text-secondary"></i>,
        color: "secondary"
      };
    } else if (cycleDay <= 16) {
      return {
        name: "Ovulation Phase",
        description: "Your fertility is at its peak. Track symptoms for better insights.",
        icon: <Sprout className="w-8 h-8 text-accent" />,
        color: "accent"
      };
    } else {
      return {
        name: "Luteal Phase",
        description: "Pre-period phase. Watch for PMS symptoms.",
        icon: <i className="fas fa-moon text-2xl text-muted-foreground"></i>,
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

      {/* Current Status */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Current Status</h2>
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-${currentPhase.color} rounded-full flex items-center justify-center`}>
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
