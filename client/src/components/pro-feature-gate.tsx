import { ReactNode } from 'react';
import { usePro } from '@/hooks/use-pro';
import { SubscriptionPaywall } from '@/components/subscription-paywall';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProFeatureGateProps {
  children: ReactNode;
  feature: string;
  description?: string;
  fallback?: ReactNode;
}

export function ProFeatureGate({ 
  children, 
  feature, 
  description, 
  fallback 
}: ProFeatureGateProps) {
  const { isPro, loading } = usePro();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (isPro) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <ProUpgradePrompt feature={feature} description={description} />;
}

function ProUpgradePrompt({ feature, description }: { feature: string; description?: string }) {
  return (
    <Card className="border-dashed border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <CardContent className="p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Lock className="h-8 w-8 text-amber-600" />
            <Sparkles className="h-4 w-4 text-amber-400 absolute -top-1 -right-1" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-2">
          {feature}
        </h3>
        
        {description && (
          <p className="text-amber-700 dark:text-amber-300 mb-6">
            {description}
          </p>
        )}
        
        <SubscriptionPaywall
          trigger={
            <Button 
              variant="default" 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              data-testid="button-upgrade-pro"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Free Trial
            </Button>
          }
        />
        
        <div className="mt-3 text-xs text-amber-600 dark:text-amber-400">
          7 days free, then $4.99/month • Cancel anytime
        </div>
      </CardContent>
    </Card>
  );
}