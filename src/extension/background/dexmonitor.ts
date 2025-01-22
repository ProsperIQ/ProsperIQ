import { Connection } from '@solana/web3.js';
import { RaydiumScanner } from '../../dex/raydium/scanner';
import { OrcaScanner } from '../../dex/orca/scanner';
import { JupiterScanner } from '../../dex/jupiter/scanner';

export class DexMonitor {
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

  async monitorToken(tokenAddress: string) {
    const volumes = await Promise.all([
      this.raydium.getVolume(tokenAddress),
      this.orca.getVolume(tokenAddress),
      this.jupiter.getVolume(tokenAddress)
    ]);

    return {
      raydium: volumes[0],
      orca: volumes[1],
      jupiter: volumes[2]
    };
  }
}
