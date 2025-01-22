export class NotificationService {
  private notificationDefaults = {
    iconUrl: 'icons/icon128.png',
    type: 'basic' as chrome.notifications.TemplateType
  };

  async showAlert(alert: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error';
  }) {
    const notificationId = `prosperiq_${Date.now()}`;
    
    await chrome.notifications.create(notificationId, {
      ...this.notificationDefaults,
      title: alert.title,
      message: alert.message,
      priority: alert.type === 'error' ? 2 : 1
    });

    // Auto-clear non-error notifications
    if (alert.type !== 'error') {
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
      }, 5000);
    }
  }

  async showPriceAlert(token: string, change: number) {
    await this.showAlert({
      title: 'Price Alert',
      message: `${token} price has changed by ${change}% in the last hour`,
      type: 'info'
    });
  }

  async showSecurityAlert(risk: string, details: string) {
    await this.showAlert({
      title: 'Security Risk Detected',
      message: `${risk} risk level: ${details}`,
      type: 'warning'
    });
  }
} 