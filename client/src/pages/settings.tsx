import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Palette, Bell, Shield, Crown, Sparkles, Calendar, Clock, ExternalLink } from 'lucide-react';
import { ThemeSelector } from '@/components/theme-selector';
import { usePro } from '@/hooks/use-pro';
import { SubscriptionPaywall } from '@/components/subscription-paywall';

export default function SettingsPage() {
  const { isPro, isTrialActive, trialDaysRemaining, activeUntil, refreshProStatus } = usePro();

  const handleManageSubscription = () => {
    // Deep link to platform subscription management
    if (typeof window !== 'undefined') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        window.open('https://apps.apple.com/account/subscriptions', '_blank');
      } else if (isAndroid) {
        window.open('https://play.google.com/store/account/subscriptions', '_blank');
      }
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Settings
          </h1>
          <p className="text-muted-foreground">Customize your FlowTracker experience</p>
        </div>
        {isPro && (
          <Badge className={`text-white ${isTrialActive 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
            : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
            <Crown className="w-4 h-4 mr-1" />
            {isTrialActive ? `Pro Trial (${trialDaysRemaining} days)` : 'Pro User'}
          </Badge>
        )}
      </div>

      {/* Pro Status Card */}
      {!isPro && (
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="w-8 h-8 text-amber-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Start Your Free Trial
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    7 days free, then unlock all premium features for just $4.99/month
                  </p>
                </div>
              </div>
              <SubscriptionPaywall
                trigger={
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                    <Crown className="w-4 h-4 mr-2" />
                    Start Free Trial
                  </Button>
                }
                onPurchaseSuccess={refreshProStatus}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trial Status Card */}
      {isPro && isTrialActive && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center">
                      Pro Trial Active
                      <Sparkles className="w-4 h-4 ml-2 text-amber-500" />
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      {trialDaysRemaining > 1 
                        ? `${trialDaysRemaining} days remaining in your free trial`
                        : trialDaysRemaining === 1 
                          ? 'Last day of your free trial' 
                          : 'Trial ends today'
                      }
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <Calendar className="w-3 h-3 mr-1" />
                  {trialDaysRemaining} days left
                </Badge>
              </div>

              {trialDaysRemaining <= 3 && (
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    🎯 Trial ending soon! Keep enjoying Pro features by continuing your subscription.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleManageSubscription} variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paid Pro Status Card */}
      {isPro && !isTrialActive && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Crown className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200 flex items-center">
                      FlowTracker Pro Active
                      <Sparkles className="w-4 h-4 ml-2 text-amber-500" />
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Thank you for supporting FlowTracker! Enjoy all premium features.
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Subscriber
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleManageSubscription} variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Information</p>
              <p className="text-sm text-muted-foreground">Manage your account details</p>
            </div>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data & Privacy</p>
              <p className="text-sm text-muted-foreground">Control your data and privacy settings</p>
            </div>
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSelector />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Period Reminders</p>
              <p className="text-sm text-muted-foreground">Get notified about upcoming periods</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Symptom Tracking Reminders</p>
              <p className="text-sm text-muted-foreground">Reminders to log daily symptoms</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          {isPro && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center">
                    Custom Reminder Schedules
                    <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs">
                      Pro
                    </Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">Set personalized reminder times and frequencies</p>
                </div>
                <Button variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  Customize
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Support & Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Support & Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Help Center</p>
              <p className="text-sm text-muted-foreground">Find answers and get support</p>
            </div>
            <Button variant="outline" size="sm">
              Get Help
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Send Feedback</p>
              <p className="text-sm text-muted-foreground">Help us improve FlowTracker</p>
            </div>
            <Button variant="outline" size="sm">
              Feedback
            </Button>
          </div>

          {isPro && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center">
                    Priority Support
                    <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs">
                      Pro
                    </Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">Get faster support response times</p>
                </div>
                <Button variant="outline" size="sm">
                  <Crown className="w-4 h-4 mr-2 text-amber-500" />
                  Contact
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Version Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>FlowTracker v1.0.0</p>
        <p>Made with ❤️ for reproductive health</p>
      </div>
    </div>
  );
}