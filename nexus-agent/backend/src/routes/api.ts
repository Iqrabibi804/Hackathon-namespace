import { Router, Request, Response } from "express";
import { rateLimit } from "../middleware/rateLimit";
import { validateEthAddress } from "../middleware/validator";
import { calculateWalletHealthScore } from "../engine/walletScorer";
import { detectRugPull } from "../engine/rugPullEngine";
import { explainWalletRisk, explainRugPull, explainProtocolRisk } from "../ai/explainer";

const router = Router();

// Apply rate limiting to all API routes
router.use(rateLimit);

// GET /health
router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// POST /api/wallet/:address
router.post("/wallet/:address", validateEthAddress, async (req: Request, res: Response) => {
  try {
    const address = req.params.address as string;
    const scoreResult = await calculateWalletHealthScore(address);
    const explanation = await explainWalletRisk(scoreResult);

    res.json({
      ...scoreResult,
      aiExplanation: explanation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate wallet health score" });
  }
});

// POST /api/risk
router.post("/risk", validateEthAddress, async (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.body;
    const rugResult = await detectRugPull(tokenAddress);
    const explanation = await explainRugPull(rugResult);

    res.json({
      ...rugResult,
      aiExplanation: explanation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to run rug pull detection" });
  }
});

// POST /api/simulate
router.post("/simulate", async (req: Request, res: Response) => {
  try {
    const { protocolName, tvlChangePercent, anomalyType } = req.body;

    if (!protocolName || tvlChangePercent === undefined || !anomalyType) {
      return res.status(400).json({ error: "Missing simulation parameters" });
    }

    const aiExplanation = await explainProtocolRisk(protocolName, Number(tvlChangePercent), anomalyType);

    res.json({
      simulated: true,
      protocolName,
      tvlChangePercent,
      anomalyType,
      aiExplanation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process simulation request" });
  }
});

export default router;
