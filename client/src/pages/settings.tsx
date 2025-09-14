import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Palette, Bell, Shield, Crown, Sparkles } from 'lucide-react';
import { ThemeSelector } from '@/components/theme-selector';
import { usePro } from '@/hooks/use-pro';
import { SubscriptionPaywall } from '@/components/subscription-paywall';

export default function SettingsPage() {
  const { isPro } = usePro();

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
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <Crown className="w-4 h-4 mr-1" />
            Pro User
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
                    Upgrade to FlowTracker Pro
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    Unlock advanced insights, custom themes, data export, and remove ads
                  </p>
                </div>
              </div>
              <SubscriptionPaywall
                trigger={
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {isPro && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-6">
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