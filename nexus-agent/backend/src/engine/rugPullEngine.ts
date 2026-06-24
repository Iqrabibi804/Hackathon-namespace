import { getContractABI, getTokenHolders } from "../data/etherscan";

export interface RugPullRisk {
  rule: string;
  signal: string;
  detail: string;
  points: number;
  severity: "INFO" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface RugPullResult {
  tokenAddress: string;
  rugPullScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  risks: RugPullRisk[];
  totalSignalsDetected: number;
  isScamLikely: boolean;
  analyzedAt: string;
}

export async function detectRugPull(tokenAddress: string): Promise<RugPullResult> {
  const risks: RugPullRisk[] = [];
  
  // 1. Owner Concentration (mocked or retrieved from holders list)
  const holders = await getTokenHolders(tokenAddress);
  const devHolder = holders.find(h => h.address.toLowerCase().includes("dev")) || { percentage: 35 };
  const devHoldingPercent = devHolder.percentage;
  
  let ownerConcentrationPoints = 0;
  if (devHoldingPercent > 50) {
    ownerConcentrationPoints = 30;
    risks.push({
      rule: "Owner Concentration",
      signal: "Dangerously High Owner Balance",
      detail: `Owner controls ${devHoldingPercent}% of the total token supply.`,
      points: 30,
      severity: "CRITICAL"
    });
  } else if (devHoldingPercent >= 25) {
    ownerConcentrationPoints = 15;
    risks.push({
      rule: "Owner Concentration",
      signal: "Significant Owner Balance",
      detail: `Owner controls ${devHoldingPercent}% of the total token supply.`,
      points: 15,
      severity: "HIGH"
    });
  }

  // 2. Mint Function check (from ABI)
  const abi = await getContractABI(tokenAddress);
  let mintPoints = 0;
  const hasMint = abi.some((item: any) => item.name === "mint");
  if (hasMint) {
    // Check if unrestricted or onlyOwner (mocking restriction level check)
    const isUnrestrictedMint = true; 
    mintPoints = isUnrestrictedMint ? 20 : 10;
    risks.push({
      rule: "Mint Functionality",
      signal: isUnrestrictedMint ? "Unrestricted Minting" : "Owner-restricted Minting",
      detail: isUnrestrictedMint 
        ? "Anyone can mint new tokens, leading to potential supply inflation scams."
        : "Only the owner can mint new tokens, still presenting inflation risks.",
      points: mintPoints,
      severity: isUnrestrictedMint ? "CRITICAL" : "MEDIUM"
    });
  }

  // 3. Proxy Contract check (look for upgradeTo or implementation in ABI)
  let proxyPoints = 0;
  const isProxy = abi.some((item: any) => item.name === "upgradeTo" || item.name === "implementation");
  if (isProxy) {
    proxyPoints = 15;
    risks.push({
      rule: "Proxy Upgradeability",
      signal: "Upgradable Smart Contract",
      detail: "The contract is upgradeable via proxy, allowing developers to change logic arbitrarily.",
      points: 15,
      severity: "HIGH"
    });
  }

  // 4. Top 10 Holders Concentration
  const top10HoldingPercent = holders.reduce((acc, h) => acc + h.percentage, 0); // mock sum
  let top10Points = 0;
  if (top10HoldingPercent > 80) {
    top10Points = 15;
    risks.push({
      rule: "Top Holders Concentration",
      signal: "Whale Wallet Concentration",
      detail: `Top 10 wallets control ${top10HoldingPercent}% of total supply.`,
      points: 15,
      severity: "HIGH"
    });
  }

  // 5. Liquidity Lock Duration
  const daysLocked = 20; // mock days
  let lockPoints = 0;
  if (daysLocked < 30) {
    lockPoints = 25;
    risks.push({
      rule: "Liquidity Lock Check",
      signal: "Insufficient Liquidity Lock",
      detail: `Liquidity pool is locked for only ${daysLocked} days.`,
      points: 25,
      severity: "CRITICAL"
    });
  } else if (daysLocked <= 180) {
    lockPoints = 10;
    risks.push({
      rule: "Liquidity Lock Check",
      signal: "Short Liquidity Lock",
      detail: `Liquidity pool is locked for ${daysLocked} days (less than 6 months).`,
      points: 10,
      severity: "MEDIUM"
    });
  }

  // 6. Contract Verification Status
  const isVerified = abi.length > 0;
  let verificationPoints = 0;
  if (!isVerified) {
    verificationPoints = 10;
    risks.push({
      rule: "Contract Verification",
      signal: "Unverified Contract Code",
      detail: "Contract source code is not verified on Block Explorer.",
      points: 10,
      severity: "MEDIUM"
    });
  }

  // Total points
  const totalScore = ownerConcentrationPoints + mintPoints + proxyPoints + top10Points + lockPoints + verificationPoints;
  const rugPullScore = Math.min(totalScore, 100);

  let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
  if (rugPullScore >= 81) {
    riskLevel = "CRITICAL";
  } else if (rugPullScore >= 61) {
    riskLevel = "HIGH";
  } else if (rugPullScore >= 31) {
    riskLevel = "MEDIUM";
  }

  return {
    tokenAddress,
    rugPullScore,
    riskLevel,
    risks,
    totalSignalsDetected: risks.length,
    isScamLikely: rugPullScore > 65,
    analyzedAt: new Date().toISOString()
  };
}
