/**
 * RuleEngine.ts
 * Layer 1: Deterministic Rule Engine
 * Calculates Wallet Health Score based on risk signals (NO AI INVOLVED IN CALCULATION)
 */

export interface RiskSignal {
  factor: string;
  scoreImpact: number; // 0-100
  description: string;
}

export class RuleEngine {
  /**
   * Calculates the overall health score of a wallet based on multiple risk signals.
   * 100 = Perfectly Safe, 0 = High Risk / Compromised
   */
  static calculateWalletHealth(signals: RiskSignal[]): number {
    let healthScore = 100;

    for (const signal of signals) {
      healthScore -= signal.scoreImpact;
    }

    // Ensure score stays between 0 and 100
    if (healthScore < 0) healthScore = 0;
    if (healthScore > 100) healthScore = 100;

    return healthScore;
  }

  /**
   * Mock function to detect if a token contract is a rug pull based on hard math (e.g. liquidity lock %, dev wallet holdings).
   */
  static analyzeTokenRisk(liquidityLockedPercent: number, devHoldingsPercent: number): RiskSignal | null {
    if (liquidityLockedPercent < 50 || devHoldingsPercent > 20) {
      return {
        factor: "Rug Pull Risk",
        scoreImpact: 80,
        description: `High risk: Liquidity is only ${liquidityLockedPercent}% locked and Dev holds ${devHoldingsPercent}%.`
      };
    }
    return null;
  }

  /**
   * Mock function to check Protocol TVL drops.
   */
  static checkProtocolTVL(tvlDropPercentage: number): RiskSignal | null {
    if (tvlDropPercentage > 30) {
      return {
        factor: "Protocol TVL Crash",
        scoreImpact: 50,
        description: `Severe risk: Protocol TVL dropped by ${tvlDropPercentage}% in 24 hours.`
      };
    }
    return null;
  }
}
