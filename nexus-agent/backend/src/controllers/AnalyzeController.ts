import { Request, Response } from "express";
import { RuleEngine, RiskSignal } from "../services/RuleEngine";
import { AIExplainability } from "../services/AIExplainability";

export class AnalyzeController {
  static async analyzeWallet(req: Request, res: Response) {
    try {
      const { walletAddress, liquidityLockedPercent, devHoldingsPercent, tvlDropPercentage } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address is required" });
      }

      // Step 1: Deterministic Math (No AI)
      const riskSignals: RiskSignal[] = [];

      const tokenRisk = RuleEngine.analyzeTokenRisk(
        liquidityLockedPercent || 100, 
        devHoldingsPercent || 0
      );
      if (tokenRisk) riskSignals.push(tokenRisk);

      const tvlRisk = RuleEngine.checkProtocolTVL(tvlDropPercentage || 0);
      if (tvlRisk) riskSignals.push(tvlRisk);

      const finalHealthScore = RuleEngine.calculateWalletHealth(riskSignals);

      // Step 2: AI Explainability (Claude ONLY explains, never calculates)
      let aiExplanation = "Wallet is safe. No significant risks detected.";
      if (riskSignals.length > 0) {
        aiExplanation = await AIExplainability.explainRiskScore(riskSignals, finalHealthScore);
      }

      // Return the Hybrid Intelligence result
      res.json({
        wallet: walletAddress,
        healthScore: finalHealthScore,
        rawRiskSignals: riskSignals,
        aiAnalysis: aiExplanation
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
