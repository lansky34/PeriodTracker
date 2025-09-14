import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Heart, AlertTriangle, TrendingDown, Calendar, Activity, Brain } from 'lucide-react';
import { ProFeatureGate } from './pro-feature-gate';

export function ConditionSupport() {
  // Mock condition-specific data
  const pcosMetrics = {
    symptomSeverity: 65,
    cycleIrregularity: 78,
    managementScore: 82,
    currentPhase: 'Follicular Extended'
  };

  const endoMetrics = {
    painLevel: 6.2,
    symptomDays: 8,
    managementEffectiveness: 74,
    flareRisk: 'Moderate'
  };

  return (
    <ProFeatureGate
      feature="PCOS & Endometriosis Support"
      description="Specialized tracking and insights for PCOS, endometriosis, and other reproductive health conditions. Get condition-specific recommendations."
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-6 h-6 mr-2 text-pink-500" />
            Condition Support
            <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Pro
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pcos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pcos">PCOS Support</TabsTrigger>
              <TabsTrigger value="endometriosis">Endometriosis</TabsTrigger>
            </TabsList>

            <TabsContent value="pcos" className="space-y-4 mt-4">
              {/* PCOS Overview */}
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-teal-600 mr-2" />
                  <span className="font-medium text-sm">PCOS Management Dashboard</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tracking specialized metrics to help manage PCOS symptoms and improve cycle regularity.
                </p>
              </div>

              {/* PCOS Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Symptom Management</span>
                    <span className="text-sm text-green-600">{pcosMetrics.managementScore}%</span>
                  </div>
                  <Progress value={pcosMetrics.managementScore} className="mb-2" />
                  <p className="text-xs text-muted-foreground">Excellent progress with lifestyle interventions</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cycle Irregularity</span>
                    <span className="text-sm text-orange-600">{pcosMetrics.cycleIrregularity}%</span>
                  </div>
                  <Progress value={pcosMetrics.cycleIrregularity} className="mb-2" />
                  <p className="text-xs text-muted-foreground">Improving with tracking and treatment</p>
                </div>
              </div>

              {/* Current Status */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Current Cycle Phase</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{pcosMetrics.currentPhase}</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Day 45
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Extended follicular phase is common with PCOS</p>
                  <p>• Focus on insulin management and anti-inflammatory foods</p>
                  <p>• Consider inositol supplementation as discussed with healthcare provider</p>
                </div>
              </div>

              {/* PCOS-Specific Recommendations */}
              <div className="space-y-3">
                <h4 className="font-semibold">Today's PCOS Management Tips</h4>
                <div className="space-y-2">
                  <div className="flex items-start p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-sm text-green-800 dark:text-green-200">Nutrition Focus</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Low-GI meals today to support insulin sensitivity</div>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-sm text-blue-800 dark:text-blue-200">Exercise</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Strength training can help improve insulin resistance</div>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-sm text-purple-800 dark:text-purple-200">Supplements</div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Track your vitamin D and omega-3 intake</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="endometriosis" className="space-y-4 mt-4">
              {/* Endo Overview */}
              <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 mr-2" />
                  <span className="font-medium text-sm">Endometriosis Management</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Specialized tracking for endometriosis symptoms, pain patterns, and treatment effectiveness.
                </p>
              </div>

              {/* Endo Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">{endoMetrics.painLevel}/10</div>
                  <div className="text-sm text-muted-foreground">Average Pain Level</div>
                  <div className="text-xs text-green-600 mt-1">↓ 15% this month</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{endoMetrics.symptomDays}</div>
                  <div className="text-sm text-muted-foreground">Symptom Days</div>
                  <div className="text-xs text-muted-foreground mt-1">Last cycle</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{endoMetrics.managementEffectiveness}%</div>
                  <div className="text-sm text-muted-foreground">Treatment Response</div>
                  <div className="text-xs text-green-600 mt-1">Improving</div>
                </div>
              </div>

              {/* Pain Tracking */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Pain Pattern Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pelvic Pain Severity</span>
                    <Badge variant={endoMetrics.flareRisk === 'High' ? 'destructive' : 'secondary'}>
                      {endoMetrics.flareRisk} Risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Peak pain phase:</span>
                      <span className="ml-1 font-medium">Day 1-3 of cycle</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Best management:</span>
                      <span className="ml-1 font-medium">Heat therapy + rest</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endo-Specific Recommendations */}
              <div className="space-y-3">
                <h4 className="font-semibold">Endometriosis Management Today</h4>
                <div className="space-y-2">
                  <div className="flex items-start p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-sm text-red-800 dark:text-red-200">Pain Management</div>
                      <div className="text-sm text-red-700 dark:text-red-300">Pre-menstrual phase - prepare heat pack and pain relief plan</div>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-sm text-green-800 dark:text-green-200">Anti-inflammatory</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Focus on omega-3 rich foods and avoid inflammatory triggers</div>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-sm text-blue-800 dark:text-blue-200">Gentle Movement</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Pelvic floor exercises and gentle stretching recommended</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ProFeatureGate>
  );
}