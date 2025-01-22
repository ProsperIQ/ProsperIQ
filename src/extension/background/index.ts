import { TokenAnalyzer } from './tokenAnalyzer';
import { StorageManager } from '../utils/storage';
import { NotificationService } from '../utils/notifications';

// Initialize services
const storage = new StorageManager();
const notifications = new NotificationService();

// Handle extension installation
chrome.runtime.onInstalled.addListener(async () => {
  console.log('ProsperIQ Extension installed');
  await storage.initializeDefaults();
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'ANALYZE_TOKEN':
      handleTokenAnalysis(message.tokenAddress, sendResponse);
      break;
    case 'SCAN_WALLET':
      handleWalletScan(message.walletAddress, sendResponse);
      break;
    case 'UPDATE_SETTINGS':
      handleSettingsUpdate(message.settings, sendResponse);
      break;
  }
  return true; // Keep channel open for async response
});

async function handleTokenAnalysis(tokenAddress: string, sendResponse: Function) {
  try {
    const analyzer = new TokenAnalyzer();
    const analysis = await analyzer.analyzeToken(tokenAddress);
    
    // Check for high-risk indicators
    if (analysis.securityScore.riskLevel === 'High') {
      notifications.showAlert({
        title: 'High Risk Token Detected',
        message: 'This token shows multiple risk indicators. Trade with caution.',
        type: 'warning'
      });
    }

    sendResponse({ success: true, data: analysis });
  } catch (error) {
    console.error('Analysis failed:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleWalletScan(walletAddress: string, sendResponse: Function) {
  // Wallet scanning implementation
}

async function handleSettingsUpdate(settings: any, sendResponse: Function) {
  // Settings update implementation
}
