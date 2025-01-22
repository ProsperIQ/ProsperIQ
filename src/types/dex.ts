export interface DexVolume {
  dex: 'Raydium' | 'Orca' | 'Jupiter' | 'Pump.Fun' | 'Meteora';
  volume24h: number;
  trades24h: number;
  priceChange24h: number;
}

export interface LiquidityPool {
  address: string;
  token0: string;
  token1: string;
  reserve0: number;
  reserve1: number;
  totalLiquidity: number;
  apr: number;
}

export interface DexScanResult {
  volume24h: number;
  liquidity: number;
  priceImpact: number;
  swapCount: number;
  holders: number;
  recentTransactions: Transaction[];
}

export interface Transaction {
  signature: string;
  amount: number;
  type: 'buy' | 'sell';
  timestamp: number;
} 