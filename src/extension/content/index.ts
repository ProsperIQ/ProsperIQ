import { createOverlay } from './overlay';
import { UIInjector } from './injector';

const injector = new UIInjector();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const currentDex = detectCurrentDex();
  if (currentDex) {
    initializeTokenScanner(currentDex);
  }
});

function detectCurrentDex(): string | null {
  const url = window.location.hostname;
  const DEX_PATTERNS = {
    RAYDIUM: /raydium\.io/,
    ORCA: /orca\.so/,
    JUPITER: /jup\.ag/,
    PUMP_FUN: /pump\.fun/,
    METEORA: /meteora/
  };

  for (const [dex, pattern] of Object.entries(DEX_PATTERNS)) {
    if (pattern.test(url)) return dex;
  }
  return null;
}

function initializeTokenScanner(dex: string) {
  const observer = new MutationObserver(() => {
    const tokenAddress = extractTokenAddress(dex);
    if (tokenAddress) {
      requestAnalysis(tokenAddress);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

async function requestAnalysis(tokenAddress: string) {
  chrome.runtime.sendMessage(
    { type: 'ANALYZE_TOKEN', tokenAddress },
    response => {
      if (response.error) {
        console.error('Analysis failed:', response.error);
        return;
      }
      injector.injectAnalysisUI(response.data);
    }
  );
}

function extractTokenAddress(dex: string): string | null {
  // Implementation for extracting token address based on DEX
  return null;
} 