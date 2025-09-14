import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Apple, Dumbbell, Moon, Heart } from 'lucide-react';
import { ProFeatureGate } from './pro-feature-gate';

interface HealthRecommendation {
  id: string;
  type: 'nutrition' | 'exercise' | 'sleep' | 'wellness';
  title: string;
  description: string;
  cyclePhase: string;
  priority: 'high' | 'medium' | 'low';
}

export function AIHealthCoach() {
  // Mock AI-generated recommendations based on cycle phase
  const recommendations: HealthRecommendation[] = [
    {
      id: '1',
      type: 'nutrition',
      title: 'Boost Iron Intake',
      description: 'Your period starts in 2 days. Include iron-rich foods like spinach, lean meats, and dark chocolate to combat fatigue.',
      cyclePhase: 'Luteal Phase',
      priority: 'high'
    },
    {
      id: '2', 
      type: 'exercise',
      title: 'Try Gentle Yoga',
      description: 'Based on your PMS symptoms, gentle yoga or stretching can help reduce cramps and improve mood.',
      cyclePhase: 'Luteal Phase',
      priority: 'high'
    },
    {
      id: '3',
      type: 'sleep',
      title: 'Prioritize Sleep Quality', 
      description: 'Your sleep patterns show correlation with cycle regularity. Aim for 7-8 hours tonight for optimal hormone balance.',
      cyclePhase: 'Luteal Phase',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'wellness',
      title: 'Stress Management',
      description: 'High stress during luteal phase can worsen PMS. Try 10 minutes of deep breathing or meditation.',
      cyclePhase: 'Luteal Phase', 
      priority: 'medium'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'nutrition': return <Apple className="w-5 h-5 text-green-600" />;
      case 'exercise': return <Dumbbell className="w-5 h-5 text-blue-600" />;
      case 'sleep': return <Moon className="w-5 h-5 text-purple-600" />;
      case 'wellness': return <Heart className="w-5 h-5 text-pink-600" />;
      default: return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <ProFeatureGate
      feature="AI Health Coach"
      description="Get personalized, cycle-aware health recommendations powered by AI. Optimize your nutrition, exercise, and wellness based on your unique patterns."
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-amber-500" />
            AI Health Coach
            <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Pro
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
            <div className="flex items-center mb-2">
              <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
              <span className="font-medium text-sm">Today's Focus: Luteal Phase Support</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI coach has analyzed your cycle patterns and current symptoms to provide personalized recommendations for optimal health.
            </p>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="mt-0.5">
                  {getIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{rec.cyclePhase}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4 border-t">
            <Button variant="outline" className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              Get More Personalized Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    </ProFeatureGate>
  );
}