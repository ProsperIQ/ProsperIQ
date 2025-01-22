export interface SecurityScore {
  overall: number;
  honeypotRisk: 'Low' | 'Medium' | 'High';
  rugPullHistory: 'Clean' | 'Suspicious' | 'Dangerous';
  blockZeroBundle: boolean;
  commonFundingSources: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface TokenHistory {
  incidents: string[];
  lastIncident?: Date;
  recoveryPattern?: boolean;
}

export interface SecurityAlert {
  type: 'honeypot' | 'rugpull' | 'suspicious_activity' | 'whale_movement';
  severity: 'Low' | 'Medium' | 'High';
  message: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface ContractAnalysis {
  verified: boolean;
  sourceCode?: string;
  maliciousPatterns: string[];
  ownerPrivileges: string[];
  securityScore: number;
} 