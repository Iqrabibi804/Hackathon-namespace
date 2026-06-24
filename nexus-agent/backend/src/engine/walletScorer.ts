import { getNativeBalance, getTokenTransactions } from "../data/etherscan";

export interface ScoringSignal {
  name: string;
  score: number;
  maxScore: number;
  detail: string;
  isRisk: boolean;
}

export interface WalletHealthResult {
  score: number;
  grade: "SECURE" | "MODERATE" | "AT RISK" | "CRITICAL";
  signals: ScoringSignal[];
  walletAddress: string;
  calculatedAt: string;
}

export async function calculateWalletHealthScore(walletAddress: string): Promise<WalletHealthResult> {
  const signals: ScoringSignal[] = [];
  
  // 1. Token Diversification
  const tokens = await getTokenTransactions(walletAddress);
  const tokenCount = tokens.length;
  const diversificationScore = Math.min(tokenCount * 8, 40);
  signals.push({
    name: "Token Diversification",
    score: diversificationScore,
    maxScore: 40,
    detail: `Found ${tokenCount} unique token transactions in history.`,
    isRisk: tokenCount < 2
  });

  // 2. Stablecoin Ratio (Mocking USD values for demo)
  const stablecoinRatio = 0.4; // 40% stablecoins
  const stablecoinScore = Math.round(stablecoinRatio * 30);
  signals.push({
    name: "Stablecoin Ratio",
    score: stablecoinScore,
    maxScore: 30,
    detail: `Portfolio contains ${Math.round(stablecoinRatio * 100)}% stablecoins (USDC/USDT/DAI).`,
    isRisk: stablecoinRatio < 0.15
  });

  // 3. Portfolio Concentration (Mocking token holdings)
  const largestTokenRatio = 0.55; // Largest token holds 55% portfolio value
  let concentrationScore = 20;
  if (largestTokenRatio > 0.70) {
    concentrationScore = 0;
  } else if (largestTokenRatio >= 0.50) {
    concentrationScore = 10;
  }
  signals.push({
    name: "Portfolio Concentration",
    score: concentrationScore,
    maxScore: 20,
    detail: `Largest single asset concentration is ${Math.round(largestTokenRatio * 100)}%.`,
    isRisk: largestTokenRatio > 0.70
  });

  // 4. Protocol Exposure (Mocking risky protocols)
  const riskyProtocols = ["RiskyDeFi_V1"]; // mock risky protocol exposure
  const deduction = Math.min(riskyProtocols.length * 5, 20);
  signals.push({
    name: "Protocol Exposure",
    score: 0 - deduction,
    maxScore: 0,
    detail: `Detected exposure to ${riskyProtocols.length} high-risk smart contracts.`,
    isRisk: riskyProtocols.length > 0
  });

  // 5. Wallet Age (Mocking age from transaction history)
  const isOldWallet = true; // Active > 1 year
  const ageScore = isOldWallet ? 5 : 0;
  signals.push({
    name: "Wallet Age",
    score: ageScore,
    maxScore: 5,
    detail: isOldWallet ? "Wallet history is older than 1 year (Trusted)." : "Wallet is relatively new.",
    isRisk: !isOldWallet
  });

  // 6. Recent Large Outflow (Mocking outflows)
  const heavyOutflow = false; // Total outflow > 50% last 7 days
  const outflowDeduction = heavyOutflow ? -15 : 0;
  signals.push({
    name: "Recent Outflow Check",
    score: outflowDeduction,
    maxScore: 0,
    detail: heavyOutflow ? "Warning: Large outflow of >50% portfolio detected recently." : "Outflow patterns normal.",
    isRisk: heavyOutflow
  });

  // Calculate final score
  let finalScore = diversificationScore + stablecoinScore + concentrationScore - deduction + ageScore + outflowDeduction;
  
  if (finalScore < 0) finalScore = 0;
  if (finalScore > 100) finalScore = 100;

  // Map to Grade
  let grade: "SECURE" | "MODERATE" | "AT RISK" | "CRITICAL" = "CRITICAL";
  if (finalScore >= 75) {
    grade = "SECURE";
  } else if (finalScore >= 50) {
    grade = "MODERATE";
  } else if (finalScore >= 25) {
    grade = "AT RISK";
  }

  return {
    score: finalScore,
    grade,
    signals,
    walletAddress,
    calculatedAt: new Date().toISOString()
  };
}
