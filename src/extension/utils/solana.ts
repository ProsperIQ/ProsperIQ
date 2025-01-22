import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export class SolanaUtils {
  private static connection: Connection;

  static initialize(endpoint?: string) {
    this.connection = new Connection(
      endpoint || clusterApiUrl('mainnet-beta'),
      'confirmed'
    );
  }

  static async getTokenMetadata(tokenAddress: string) {
    const publicKey = new PublicKey(tokenAddress);
    // Implementation for fetching token metadata
  }

  static async getAccountBalance(address: string) {
    const publicKey = new PublicKey(address);
    return await this.connection.getBalance(publicKey);
  }

  static async getRecentTransactions(address: string, limit: number = 100) {
    const publicKey = new PublicKey(address);
    return await this.connection.getConfirmedSignaturesForAddress2(
      publicKey,
      { limit }
    );
  }
} 