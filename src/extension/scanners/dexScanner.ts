import { Connection } from '@solana/web3.js';
import { DexVolume, DexScanResult } from '../../types/dex';
import { RaydiumScanner } from '../../dex/raydium/scanner';
import { OrcaScanner } from '../../dex/orca/scanner';
import { JupiterScanner } from '../../dex/jupiter/scanner';

export class DEXScanner {
  private connection: Connection;
  private raydium: RaydiumScanner;
  private orca: OrcaScanner;
  private jupiter: JupiterScanner;

  constructor(connection: Connection) {
    this.connection = connection;
    this.raydium = new RaydiumScanner(connection);
    this.orca = new OrcaScanner(connection);
    this.jupiter = new JupiterScanner(connection);
  }

  async getTokenActivity(tokenAddress: string): Promise<DexVolume[]> {
    const [raydium, orca, jupiter] = await Promise.all([
      this.raydium.scanPool(tokenAddress),
      this.orca.scanPool(tokenAddress),
      this.jupiter.scanPool(tokenAddress)
    ]);

    return [
      {
        dex: 'Raydium',
        volume24h: raydium.volume24h,
        trades24h: raydium.swapCount,
        priceChange24h: this.calculatePriceChange(raydium)
      },
      {
        dex: 'Orca',
        volume24h: orca.volume24h,
        trades24h: orca.swapCount,
        priceChange24h: this.calculatePriceChange(orca)
      },
      {
        dex: 'Jupiter',
        volume24h: jupiter.volume24h,
        trades24h: jupiter.swapCount,
        priceChange24h: this.calculatePriceChange(jupiter)
      }
    ];
  }

  private calculatePriceChange(data: DexScanResult): number {
    // Price change calculation implementation
    return 0;
  }
} 