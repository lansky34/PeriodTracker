import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { notificationService, type NotificationSettings } from "@/lib/notifications";
import { Bell, Clock, Calendar } from "lucide-react";

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Get insights to pass next period date for rescheduling
  const { data: insights } = useQuery<any>({
    queryKey: ["/api/insights"],
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await notificationService.getNotificationSettings();
      setSettings(currentSettings);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      // Pass next period date for proper rescheduling
      await notificationService.saveNotificationSettings(settings, insights?.nextPeriodDate);
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to save notification settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testNotifications = async () => {
    try {
      const hasPermission = await notificationService.requestPermissions();
      if (hasPermission) {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive period and symptom reminders based on your settings",
        });
      } else {
        toast({
          title: "Permissions Required",
          description: "Please enable notifications in your device settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive"
      });
    }
  };

  if (isLoading || !settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            Loading settings...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-notification-settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Manage your period and symptom tracking reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Period Reminders</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Get notified the day before your expected period
            </p>
          </div>
          <Switch
            data-testid="switch-period-reminders"
            checked={settings.periodReminders}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, periodReminders: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Daily Symptom Reminders</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Daily reminders to track your symptoms
            </p>
          </div>
          <Switch
            data-testid="switch-symptom-reminders"
            checked={settings.symptomReminders}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, symptomReminders: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="reminder-time" className="font-medium">
              Reminder Time
            </Label>
          </div>
          <Input
            id="reminder-time"
            data-testid="input-reminder-time"
            type="time"
            value={settings.reminderTime}
            onChange={(e) =>
              setSettings({ ...settings, reminderTime: e.target.value })
            }
            className="w-32"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={saveSettings} 
            disabled={isSaving}
            data-testid="button-save-settings"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
          <Button 
            variant="outline" 
            onClick={testNotifications}
            data-testid="button-test-notifications"
          >
            Test Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}