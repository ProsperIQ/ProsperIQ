export class AlertService {
  private alerts: Alert[] = [];

  async addAlert(alert: Alert) {
    this.alerts.push(alert);
    await this.notifyUser(alert);
  }

  private async notifyUser(alert: Alert) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: alert.title,
      message: alert.message
    });
  }
}
