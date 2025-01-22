import { Connection } from '@solana/web3.js';
import { RaydiumScanner } from '../../src/dex/raydium/scanner';

describe('RaydiumScanner', () => {
  let scanner: RaydiumScanner;
  let connection: Connection;

  beforeEach(() => {
    connection = new Connection('http://localhost:8899');
    scanner = new RaydiumScanner(connection);
  });

  test('should scan pool data correctly', async () => {
    const result = await scanner.scanPool('mock-pool-address');
    expect(result.volume24h).toBeGreaterThan(0);
    expect(result.liquidity).toBeGreaterThan(0);
    expect(result.swapCount).toBeGreaterThan(0);
  });

  test('should handle invalid pool addresses', async () => {
    await expect(scanner.scanPool('invalid-address')).rejects.toThrow();
  });
}); 