import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, Target, Thermometer, Calendar, TrendingUp, Heart } from 'lucide-react';
import { ProFeatureGate } from './pro-feature-gate';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function FertilityMode() {
  // Mock BBT and fertility data
  const bbtData = [
    { day: 1, temp: 97.2, phase: 'menstrual' },
    { day: 5, temp: 97.1, phase: 'follicular' },
    { day: 10, temp: 97.3, phase: 'follicular' },
    { day: 14, temp: 98.1, phase: 'ovulation' },
    { day: 18, temp: 98.3, phase: 'luteal' },
    { day: 22, temp: 98.2, phase: 'luteal' },
    { day: 26, temp: 97.8, phase: 'luteal' },
  ];

  const fertilityScore = 87;
  const daysToOvulation = 3;
  const conceptionProbability = 23;

  return (
    <ProFeatureGate
      feature="Advanced Fertility Tracking"
      description="Optimize your conception chances with BBT tracking, ovulation prediction, and fertility analysis. Perfect for family planning."
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Baby className="w-6 h-6 mr-2 text-blue-500" />
            Advanced Fertility Mode
            <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Pro
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bbt">BBT Tracking</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Fertility Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {fertilityScore}%
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Fertility Score</div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 rounded-lg text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {daysToOvulation}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Days to Ovulation</div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg text-center">
                  <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {conceptionProbability}%
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Conception Chance</div>
                </div>
              </div>

              {/* Current Status */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Current Fertility Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fertility Window Progress</span>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fertile window:</span>
                      <span className="ml-1 font-medium">Today - 5 days</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peak fertility:</span>
                      <span className="ml-1 font-medium">In 2-3 days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Recommendations */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Today's Fertility Tips</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Take your BBT measurement first thing tomorrow morning</li>
                  <li>• Optimal time for conception attempts: next 48-72 hours</li>
                  <li>• Consider tracking cervical mucus for better prediction</li>
                  <li>• Stay hydrated and maintain healthy nutrition</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="bbt" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center">
                  <Thermometer className="w-4 h-4 mr-2" />
                  Basal Body Temperature
                </h4>
                <Button size="sm">Add Today's BBT</Button>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bbtData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <Tooltip 
                      formatter={(value) => [`${value}°F`, 'Temperature']}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 border rounded">
                  <div className="font-medium">Average Follicular</div>
                  <div className="text-muted-foreground">97.2°F</div>
                </div>
                <div className="p-3 border rounded">
                  <div className="font-medium">Average Luteal</div>
                  <div className="text-muted-foreground">98.1°F</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                    Fertility Insights
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium">Ovulation Pattern Recognition</div>
                        <div className="text-muted-foreground">Your ovulation typically occurs on day 14-15, with a clear BBT rise.</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium">Luteal Phase Length</div>
                        <div className="text-muted-foreground">Consistent 12-14 day luteal phase indicates healthy progesterone levels.</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium">Cycle Regularity</div>
                        <div className="text-muted-foreground">28-30 day cycles with minimal variation - excellent for family planning.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Conception Optimization</h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Your most fertile days this cycle: Day 12-16</li>
                    <li>• Best times for conception attempts: Evening and early morning</li>
                    <li>• Consider tracking additional fertility signs for higher accuracy</li>
                    <li>• Your fertility score has improved 15% over the last 3 months</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold text-green-600">92%</div>
                    <div className="text-sm text-muted-foreground">Ovulation Detection Accuracy</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold text-blue-600">6 mo</div>
                    <div className="text-sm text-muted-foreground">Average Time to Conception*</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  *Based on users with similar cycle patterns. Individual results may vary.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ProFeatureGate>
  );
}