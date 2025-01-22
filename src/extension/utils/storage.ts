export class StorageManager {
  private defaultSettings = {
    notifications: {
      highRisk: true,
      mediumRisk: true,
      lowRisk: false,
      whaleMovements: true,
      priceAlerts: true
    },
    scanThresholds: {
      minimumLiquidity: 10000,
      minimumHolders: 100,
      suspiciousTransactionSize: 50000
    }
  };

  async initializeDefaults() {
    const settings = await this.getSettings();
    if (!settings) {
      await chrome.storage.local.set({
        settings: this.defaultSettings
      });
    }
  }

  async getSettings() {
    const data = await chrome.storage.local.get('settings');
    return data.settings;
  }

  async updateSettings(newSettings: any) {
    await chrome.storage.local.set({
      settings: { ...this.defaultSettings, ...newSettings }
    });
  }

  async saveAnalysis(tokenAddress: string, analysis: any) {
    const key = `analysis_${tokenAddress}`;
    await chrome.storage.local.set({
      [key]: {
        data: analysis,
        timestamp: Date.now()
      }
    });
  }

  async getAnalysis(tokenAddress: string) {
    const key = `analysis_${tokenAddress}`;
    const data = await chrome.storage.local.get(key);
    return data[key];
  }
} 