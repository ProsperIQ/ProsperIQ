import { Connection } from '@solana/web3.js';
import { RugPullDetector } from '../../src/analyzers/rugpull';

describe('RugPullDetector', () => {
  let detector: RugPullDetector;
  let connection: Connection;

  beforeEach(() => {
    connection = new Connection('http://localhost:8899');
    detector = new RugPullDetector(connection);
  });

  test('should detect high risk for unlocked liquidity', async () => {
    const analysis = await detector.analyzeRisk('mock-token-address');
    expect(analysis.riskLevel).toBe('High');
    expect(analysis.liquidityLocked).toBe(false);
  });

  test('should detect low risk for locked liquidity and renounced ownership', async () => {
    const analysis = await detector.analyzeRisk('safe-token-address');
    expect(analysis.riskLevel).toBe('Low');
    expect(analysis.liquidityLocked).toBe(true);
    expect(analysis.ownershipRenounced).toBe(true);
  });
}); 