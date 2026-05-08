/**
 * Service to handle Web Notifications API
 */

export const notificationService = {
  /**
   * Checks if notifications are supported by the browser
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },

  /**
   * Gets current permission status
   */
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  },

  /**
   * Requests permission to show notifications
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    
    const permission = await Notification.requestPermission();
    return permission;
  },

  /**
   * Shows a notification
   */
  async showNotification(title: string, options?: NotificationOptions) {
    if (!this.isSupported() || this.getPermissionStatus() !== 'granted') {
      return;
    }

    // Try to show via Service Worker if available for better PWA support
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        ...options,
      });
    } catch (err) {
      // Fallback to basic Notification API
      new Notification(title, options);
    }
  },

  /**
   * Calculates time until next daily reminder
   * @param timeStr HH:MM format
   */
  getTimeUntilNext(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const scheduled = new Date();
    
    scheduled.setHours(hours, minutes, 0, 0);
    
    // If time has already passed today, schedule for tomorrow
    if (scheduled.getTime() <= now.getTime()) {
      scheduled.setDate(scheduled.getDate() + 1);
    }
    
    return scheduled.getTime() - now.getTime();
  }
};
