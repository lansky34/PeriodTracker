import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationSettings {
  periodReminders: boolean;
  symptomReminders: boolean;
  reminderTime: string; // HH:MM format
}

class NotificationService {
  private isCapacitor: boolean;

  constructor() {
    // Check if we're running in Capacitor
    this.isCapacitor = !!(window as any).Capacitor;
  }

  async requestPermissions(): Promise<boolean> {
    if (!this.isCapacitor) {
      // Web notification fallback
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }

    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  async schedulePeriodReminder(nextPeriodDate: string, settings: NotificationSettings) {
    if (!settings.periodReminders) return;

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    const reminderDate = new Date(nextPeriodDate);
    reminderDate.setDate(reminderDate.getDate() - 1); // Day before
    
    // Set the time from settings
    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    reminderDate.setHours(hours, minutes, 0, 0);

    // Guard against scheduling in the past
    const now = new Date();
    if (reminderDate <= now) {
      console.warn('Period reminder time is in the past, skipping scheduling');
      throw new Error('Period reminder time has already passed for this cycle. The reminder will be scheduled for your next cycle.');
    }

    if (this.isCapacitor) {
      await LocalNotifications.schedule({
        notifications: [{
          id: 1,
          title: 'Period Reminder',
          body: 'Your period is expected to start tomorrow. Don\'t forget to track your symptoms!',
          schedule: {
            at: reminderDate
          },
          actionTypeId: 'period_reminder',
          extra: {
            type: 'period_reminder'
          }
        }]
      });
    } else {
      // Web notification fallback (immediate for demo)
      const timeUntilReminder = reminderDate.getTime() - Date.now();
      if (timeUntilReminder > 0) {
        setTimeout(() => {
          new Notification('Period Reminder', {
            body: 'Your period is expected to start tomorrow. Don\'t forget to track your symptoms!',
            icon: '/favicon.ico'
          });
        }, Math.min(timeUntilReminder, 2147483647)); // Max timeout value
      }
    }
  }

  async scheduleSymptomReminder(settings: NotificationSettings) {
    if (!settings.symptomReminders) return;

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    const [hours, minutes] = settings.reminderTime.split(':').map(Number);

    if (this.isCapacitor) {
      await LocalNotifications.schedule({
        notifications: [{
          id: 2,
          title: 'Track Your Symptoms',
          body: 'Take a moment to log how you\'re feeling today.',
          schedule: {
            repeats: true,
            on: {
              hour: hours,
              minute: minutes
            }
          },
          actionTypeId: 'symptom_reminder',
          extra: {
            type: 'symptom_reminder'
          }
        }]
      });
    }
  }

  async cancelAllNotifications() {
    if (!this.isCapacitor) return;

    try {
      await LocalNotifications.cancel({
        notifications: [{ id: 1 }, { id: 2 }]
      });
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  }

  async cancelPeriodReminder() {
    if (!this.isCapacitor) return;

    try {
      await LocalNotifications.cancel({
        notifications: [{ id: 1 }]
      });
    } catch (error) {
      console.error('Failed to cancel period reminder:', error);
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    const stored = localStorage.getItem('notificationSettings');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      periodReminders: true,
      symptomReminders: true,
      reminderTime: '09:00'
    };
  }

  async saveNotificationSettings(settings: NotificationSettings, nextPeriodDate?: string) {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    // Reschedule notifications with new settings
    await this.cancelAllNotifications();
    
    // Reschedule both types of reminders
    if (settings.symptomReminders) {
      await this.scheduleSymptomReminder(settings);
    }
    
    // Reschedule period reminder if next period date is available
    if (settings.periodReminders && nextPeriodDate) {
      await this.schedulePeriodReminder(nextPeriodDate, settings);
    }
  }
}

export const notificationService = new NotificationService();