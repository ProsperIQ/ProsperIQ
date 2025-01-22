import { Connection, PublicKey } from '@solana/web3.js';
import { SecurityScore, TokenActivity, DexVolume } from '../../types/interfaces';
import { DEXScanner } from '../scanners/dexScanner';
import { SecurityAnalyzer } from '../scanners/securityAnalyzer';
import { WalletAnalyzer } from '../scanners/walletAnalyzer';
import { PatternDetector } from '../analyzers/patternDetector';

export class TokenAnalyzer {
  private connection: Connection;
  private dexScanner: DEXScanner;
  private securityAnalyzer: SecurityAnalyzer;
  private walletAnalyzer: WalletAnalyzer;
  private patternDetector: PatternDetector;

  constructor() {
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
    this.dexScanner = new DEXScanner(this.connection);
    this.securityAnalyzer = new SecurityAnalyzer(this.connection);
    this.walletAnalyzer = new WalletAnalyzer(this.connection);
    this.patternDetector = new PatternDetector(this.connection);
  }

  async analyzeToken(tokenAddress: string): Promise<{
    securityScore: SecurityScore;
    dexActivity: DexVolume[];
    walletActivity: TokenActivity;
    patterns: any;
  }> {
    const [securityData, dexActivity, walletActivity, patterns] = await Promise.all([
      this.securityAnalyzer.analyzeContract(tokenAddress),
      this.dexScanner.getTokenActivity(tokenAddress),
      this.walletAnalyzer.scanWallets(tokenAddress),
      this.patternDetector.detectPatterns(tokenAddress)
    ]);

    return {
      securityScore: {
        overall: this.calculateOverallScore(securityData),
        honeypotRisk: securityData.honeypotRisk,
        rugPullHistory: securityData.rugPullHistory,
        blockZeroBundle: securityData.blockZeroBundle,
        commonFundingSources: securityData.commonFundingSources,
        riskLevel: this.calculateRiskLevel(securityData)
      },
      dexActivity,
      walletActivity,
      patterns
    };
  }

  private calculateOverallScore(data: any): number {
    // Complex scoring algorithm based on multiple factors
    let score = 100;

    // Deduct for risk factors
    if (data.honeypotRisk === 'High') score -= 30;
    if (data.rugPullHistory !== 'Clean') score -= 25;
    if (data.blockZeroBundle) score -= 15;
    if (data.commonFundingSources > 2) score -= 10;

    // Additional deductions based on patterns
    if (data.suspiciousPatterns?.length > 0) {
      score -= data.suspiciousPatterns.length * 5;
    }

    return Math.max(0, score);
  }

  private calculateRiskLevel(data: any): 'Low' | 'Medium' | 'High' {
    const score = this.calculateOverallScore(data);
    if (score >= 80) return 'Low';
    if (score >= 50) return 'Medium';
    return 'High';
  }
}
