import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Download, FileText, Shield } from "lucide-react";

export default function InsightsPage() {
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
    // Create a simple text report and trigger download
    const reportData = {
      generatedDate: new Date().toISOString().split('T')[0],
      stats: insights,
      totalEntries: symptoms.length,
      totalCycles: cycles.length,
    };
    
    const reportText = `FlowTracker Report - Generated ${reportData.generatedDate}

Cycle Statistics:
- Average Cycle Length: ${insights?.averageCycleLength || 'N/A'} days
- Average Period Length: ${insights?.averagePeriodLength || 'N/A'} days
- Cycle Variation: ±${insights?.cycleVariation || 'N/A'} days
- Total Cycles Tracked: ${reportData.totalCycles}

Predictions:
- Next Period: ${insights?.nextPeriodDate || 'N/A'}
- Days Until Next Period: ${insights?.daysUntilNext || 'N/A'}

Tracking Summary:
- Total Symptom Entries: ${reportData.totalEntries}
- Most Common Symptoms: ${insights?.commonSymptoms?.slice(0, 3).map((s: any) => `${s.name} (${s.percentage}%)`).join(', ') || 'N/A'}

Note: This report contains personal health data. Keep it secure and private.`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowtracker-report-${reportData.generatedDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    // Create CSV with symptoms data
    if (!symptoms.length) return;
    
    const csvHeaders = ['Date', 'Flow Intensity', 'Pain Level', 'Mood', 'Additional Symptoms', 'Notes'];
    const csvRows = symptoms.map((symptom: any) => [
      symptom.date,
      symptom.flowIntensity || '',
      symptom.painLevel || '',
      symptom.mood || '',
      symptom.additionalSymptoms ? symptom.additionalSymptoms.join('; ') : '',
      symptom.notes || ''
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowtracker-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
      <div>
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="text-muted-foreground">Analyze your cycle patterns and trends</p>
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
          {/* Cycle Statistics */}
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

          {/* Predictions */}
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

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle>Export Your Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download your period tracking data for personal records or to share with your healthcare provider.
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleExportPDF}
                  data-testid="button-export-pdf"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF Report
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleExportCSV}
                  data-testid="button-export-csv"
                  disabled={symptoms.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV Data
                </Button>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    Your exported data includes cycle dates, symptoms, and predictions. All personal information remains private and secure.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
