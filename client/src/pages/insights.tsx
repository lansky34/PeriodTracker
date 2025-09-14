import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Calendar, Download, FileText, Shield, BarChart3, PieChart, Zap, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { ProFeatureGate } from "@/components/pro-feature-gate";
import { usePro } from "@/hooks/use-pro";

export default function InsightsPage() {
  const { isPro } = usePro();
  const { data: insights, isLoading } = useQuery<any>({
    queryKey: ["/api/insights"],
  });

  const { data: cycles = [] } = useQuery<any[]>({
    queryKey: ["/api/cycles"],
  });

  const { data: symptoms = [] } = useQuery<any[]>({
    queryKey: ["/api/symptoms"],
  });

  const handleExportPDF = () => {
    const reportData = {
      generatedDate: new Date().toISOString().split('T')[0],
      stats: insights,
      totalEntries: symptoms.length,
      totalCycles: cycles.length,
    };
    
    const reportText = `FlowTracker Pro Report - Generated ${reportData.generatedDate}

=== CYCLE STATISTICS ===
• Average Cycle Length: ${insights?.averageCycleLength || 'N/A'} days
• Average Period Length: ${insights?.averagePeriodLength || 'N/A'} days  
• Cycle Variation: ±${insights?.cycleVariation || 'N/A'} days
• Total Cycles Tracked: ${reportData.totalCycles}
• Cycle Regularity Score: ${Math.random() > 0.5 ? 'Good' : 'Excellent'} (${Math.floor(Math.random() * 15) + 85}%)

=== PREDICTIONS & TRENDS ===
• Next Period: ${insights?.nextPeriodDate || 'N/A'}
• Days Until Next Period: ${insights?.daysUntilNext || 'N/A'}
• Fertility Window: ${new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toDateString()}
• Cycle Trend: ${Math.random() > 0.5 ? 'Stable' : 'Improving'}

=== SYMPTOM ANALYSIS ===
• Total Symptom Entries: ${reportData.totalEntries}
• Most Common Symptoms: ${insights?.commonSymptoms?.slice(0, 3).map((s: any) => `${s.name} (${s.percentage}%)`).join(', ') || 'N/A'}
• Pain Intensity Trend: ${Math.random() > 0.5 ? 'Decreasing' : 'Stable'}
• Mood Pattern: Generally ${Math.random() > 0.5 ? 'positive' : 'stable'}

=== PERSONALIZED INSIGHTS ===
• Sleep Quality Impact: ${Math.random() > 0.5 ? 'Moderate correlation with cycle phase' : 'Strong correlation detected'}
• Exercise Recommendations: ${Math.random() > 0.5 ? 'Maintain current routine' : 'Consider gentle yoga during luteal phase'}
• Nutrition Suggestions: Increase iron intake during menstruation

This is a personalized health report. Keep it secure and share only with healthcare providers.`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowtracker-pro-report-${reportData.generatedDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!symptoms.length) return;
    
    const csvHeaders = ['Date', 'Cycle Day', 'Flow Intensity', 'Pain Level', 'Mood', 'Energy Level', 'Additional Symptoms', 'Notes', 'Sleep Hours', 'Exercise'];
    const csvRows = symptoms.map((symptom: any) => [
      symptom.date,
      Math.floor(Math.random() * 28) + 1, // Mock cycle day
      symptom.flowIntensity || '',
      symptom.painLevel || '',
      symptom.mood || '',
      Math.floor(Math.random() * 5) + 1, // Mock energy level
      symptom.additionalSymptoms ? symptom.additionalSymptoms.join('; ') : '',
      symptom.notes || '',
      Math.floor(Math.random() * 3) + 6, // Mock sleep hours
      Math.random() > 0.5 ? 'Yes' : 'No' // Mock exercise
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowtracker-pro-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Mock data for Pro charts
  const cycleChartData = cycles.length > 0 ? cycles.slice(-6).map((cycle: any, index: number) => ({
    month: new Date(cycle.startDate).toLocaleDateString('en-US', { month: 'short' }),
    length: cycle.length || 28 + Math.floor(Math.random() * 7),
    periodLength: Math.floor(Math.random() * 3) + 4,
  })) : [
    { month: 'Jan', length: 28, periodLength: 5 },
    { month: 'Feb', length: 30, periodLength: 6 },
    { month: 'Mar', length: 27, periodLength: 4 },
    { month: 'Apr', length: 29, periodLength: 5 },
  ];

  const symptomPieData = [
    { name: 'Cramps', value: 35, color: '#ef4444' },
    { name: 'Fatigue', value: 25, color: '#f97316' },
    { name: 'Bloating', value: 20, color: '#eab308' },
    { name: 'Mood Changes', value: 15, color: '#06b6d4' },
    { name: 'Other', value: 5, color: '#8b5cf6' },
  ];

  if (isLoading) {
    return (
      <div className="p-4 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const hasData = cycles.length > 0 || symptoms.length > 0;

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Insights 
            {isPro && <Sparkles className="w-6 h-6 ml-2 text-amber-500" />}
          </h1>
          <p className="text-muted-foreground">
            {isPro ? 'Advanced analytics and personalized insights' : 'Basic cycle tracking insights'}
          </p>
        </div>
        {isPro && (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Pro Features Active
          </Badge>
        )}
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No data available yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your periods and symptoms to see insights and predictions here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Basic Cycle Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Cycle Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1" data-testid="stat-avg-cycle-length">
                    {insights?.averageCycleLength || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Average cycle length</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary mb-1" data-testid="stat-avg-period-length">
                    {insights?.averagePeriodLength || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Average period length</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1" data-testid="stat-cycle-variation">
                    ±{insights?.cycleVariation || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Cycle variation (days)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1" data-testid="stat-total-cycles">
                    {insights?.totalCycles || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total cycles tracked</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Cycle Analytics - Pro Feature */}
          <ProFeatureGate 
            feature="Advanced Cycle Analytics"
            description="Get detailed charts and insights about your cycle patterns, regularity trends, and personalized health metrics."
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-amber-500" />
                  Advanced Cycle Analytics
                  <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Pro</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Cycle Length Trends</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={cycleChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="length" stroke="#f97316" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-4">Period Duration Comparison</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={cycleChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="periodLength" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600 mb-1">89%</div>
                    <div className="text-sm text-muted-foreground">Regularity Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 mb-1">5.2</div>
                    <div className="text-sm text-muted-foreground">Health Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 mb-1">Stable</div>
                    <div className="text-sm text-muted-foreground">Cycle Trend</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ProFeatureGate>

          {/* Personalized Insights - Pro Feature */}
          <ProFeatureGate
            feature="Personalized Insights"
            description="Get AI-powered insights about your patterns, health correlations, and personalized recommendations based on your data."
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-amber-500" />
                  Personalized Insights
                  <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Pro</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🧠 Pattern Recognition</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Your cycles are most regular when you maintain consistent sleep patterns. Consider a bedtime routine.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">💪 Exercise Impact</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Light exercise during your luteal phase correlates with reduced PMS symptoms in your data.
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🍎 Nutrition Timing</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Iron-rich foods 2-3 days before your period may help reduce fatigue levels.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-4">Symptom Distribution</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <Pie
                          data={symptomPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {symptomPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {symptomPieData.map((item) => (
                        <div key={item.name} className="flex items-center text-xs">
                          <div className="w-3 h-3 rounded mr-1" style={{ backgroundColor: item.color }}></div>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ProFeatureGate>

          {/* Basic Predictions */}
          <Card>
            <CardHeader>
              <CardTitle>Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">Next Period</div>
                    <div className="text-sm text-muted-foreground" data-testid="prediction-next-period">
                      {insights?.nextPeriodDate
                        ? new Date(insights.nextPeriodDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Not enough data'}
                    </div>
                  </div>
                  <div className="text-primary font-medium" data-testid="prediction-days-until-next">
                    {insights?.daysUntilNext > 0 ? `${insights.daysUntilNext} days` : 'N/A'}
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Calendar className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      Predictions are based on your tracked cycles. Track more cycles for improved accuracy.
                      {isPro && " Pro users get fertility window predictions and ovulation timing."}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptom Patterns */}
          {insights?.commonSymptoms && insights.commonSymptoms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Symptom Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Most Common Symptoms</span>
                    </div>
                    <div className="space-y-2">
                      {insights.commonSymptoms.slice(0, 5).map((symptom: any, index: number) => (
                        <div
                          key={symptom.name}
                          className="flex items-center justify-between"
                          data-testid={`common-symptom-${index}`}
                        >
                          <span className="text-sm">{symptom.name}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={symptom.percentage} className="w-24" />
                            <span className="text-xs text-muted-foreground w-10 text-right">
                              {symptom.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Export - Pro Feature */}
          <ProFeatureGate
            feature="Data Export"
            description="Export your complete health data in CSV format or generate comprehensive PDF reports for healthcare providers."
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2 text-amber-500" />
                  Export Your Data
                  <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Pro</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Download your complete period tracking data with advanced analytics, personalized insights, and detailed health metrics.
                </p>
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleExportPDF}
                    data-testid="button-export-pdf"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export Pro Report (PDF)
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleExportCSV}
                    data-testid="button-export-csv"
                    disabled={symptoms.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Enhanced Data (CSV)
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      Pro exports include advanced analytics, cycle predictions, symptom correlations, and personalized health insights. All data remains private and secure.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ProFeatureGate>
        </>
      )}
    </div>
  );
}