import React, { useEffect, useState } from 'react';
import { SecurityScore } from '../../types/security';
import { DexVolume } from '../../types/dex';

export function Popup() {
  const [analysis, setAnalysis] = useState<{
    securityScore: SecurityScore;
    dexActivity: DexVolume[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentTabAnalysis();
  }, []);

  async function getCurrentTabAnalysis() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.url) return;

      const tokenAddress = extractTokenAddress(tab.url);
      if (!tokenAddress) {
        setError('No token address found on current page');
        setLoading(false);
        return;
      }

      const response = await chrome.runtime.sendMessage({
        type: 'ANALYZE_TOKEN',
        tokenAddress
      });

      if (response.success) {
        setAnalysis(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to analyze token');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading-spinner">Analyzing...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>ProsperIQ Analysis</h1>
      </header>

      {analysis && (
        <div className="analysis-content">
          <SecurityScoreCard score={analysis.securityScore} />
          <DexActivityList volumes={analysis.dexActivity} />
          <RiskIndicators score={analysis.securityScore} />
        </div>
      )}
    </div>
  );
}

function SecurityScoreCard({ score }: { score: SecurityScore }) {
  return (
    <div className="security-score-card">
      <div className="score-header">
        <h2>Security Score</h2>
        <div className={`score-badge ${score.riskLevel.toLowerCase()}`}>
          {score.overall}/100
        </div>
      </div>
      <div className="risk-indicators">
        {/* Risk indicators implementation */}
      </div>
    </div>
  );
}

function DexActivityList({ volumes }: { volumes: DexVolume[] }) {
  return (
    <div className="dex-activity">
      <h2>DEX Activity</h2>
      <div className="dex-list">
        {volumes.map((volume) => (
          <div key={volume.dex} className="dex-item">
            <img src={`/logos/${volume.dex.toLowerCase()}.png`} alt={volume.dex} />
            <span className="dex-name">{volume.dex}</span>
            <span className="volume">${formatNumber(volume.volume24h)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
} 