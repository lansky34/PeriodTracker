import { useState, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Check, Crown, Sparkles } from 'lucide-react';
import { purchasesService } from '@/lib/purchases';
import { adMobService } from '@/lib/admob';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'monthly_pro',
    name: 'Monthly Pro',
    price: '$4.99',
    period: 'per month',
  },
  {
    id: 'annual_pro', 
    name: 'Annual Pro',
    price: '$39.99',
    period: 'per year',
    savings: 'Save 33%',
    popular: true,
  },
];

const proFeatures = [
  'Remove all ads',
  'Advanced cycle analytics',
  'Custom reminder schedules',
  'Export data to CSV',
  'Priority customer support',
  'Unlimited symptom tracking',
  'Personalized insights',
];

interface SubscriptionPaywallProps {
  onClose?: () => void;
  onPurchaseSuccess?: () => void;
  trigger?: ReactNode;
}

export function SubscriptionPaywall({ onClose, onPurchaseSuccess, trigger }: SubscriptionPaywallProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchase = async (planId: string) => {
    setLoading(planId);
    
    try {
      await purchasesService.purchasePackage(planId);
      
      // Refresh ad service to disable ads
      await adMobService.refreshProStatus();
      
      toast({
        title: "Welcome to Pro!",
        description: "Your subscription is now active. Enjoy ad-free tracking with premium features!",
      });
      
      onPurchaseSuccess?.();
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Unable to complete purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRestore = async () => {
    setLoading('restore');
    
    try {
      await purchasesService.restorePurchases();
      
      // Refresh ad service status
      await adMobService.refreshProStatus();
      
      toast({
        title: "Purchases Restored",
        description: "Your subscription has been restored successfully!",
      });
      
      onPurchaseSuccess?.();
    } catch (error) {
      toast({
        title: "Restore Failed",
        description: "No previous purchases found or restore failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const paywallContent = (
    <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Crown className="h-8 w-8 text-amber-500 mr-2" />
            <CardTitle className="text-2xl">Upgrade to Pro</CardTitle>
          </div>
          <CardDescription>
            Get the most out of FlowTracker with premium features and an ad-free experience
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features List */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
              Pro Features
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {proFeatures.map((feature) => (
                <div key={feature} className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border rounded-lg p-4 ${plan.popular ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'border-border'}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-4 bg-amber-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{plan.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                      {plan.savings && (
                        <Badge variant="secondary" className="text-xs">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading !== null}
                    loading={loading === plan.id}
                    variant={plan.popular ? "default" : "outline"}
                    data-testid={`button-purchase-${plan.id}`}
                  >
                    {loading === plan.id ? 'Processing...' : 'Subscribe'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleRestore}
              disabled={loading !== null}
              loading={loading === 'restore'}
              data-testid="button-restore-purchases"
            >
              Restore Purchases
            </Button>
            
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading !== null}
                data-testid="button-close-paywall"
              >
                Maybe Later
              </Button>
            )}
          </div>

          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>Subscriptions auto-renew unless cancelled in your app store account settings.</p>
            <p>Terms of Service and Privacy Policy available at flowtracker.xyz</p>
          </div>
        </CardContent>
      </Card>
  );

  if (trigger) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="p-0 max-w-lg" data-testid="subscription-paywall">
          {paywallContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" data-testid="subscription-paywall">
      {paywallContent}
    </div>
  );
}