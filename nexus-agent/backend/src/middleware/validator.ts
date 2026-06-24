import { Request, Response, NextFunction } from "express";

export function validateEthAddress(req: Request, res: Response, next: NextFunction) {
  // Check in URL params (e.g. /api/wallet/:address) or request body
  const address = req.params.address || req.body.walletAddress || req.body.tokenAddress;

  if (!address) {
    return res.status(400).json({ error: "Ethereum address is required." });
  }

  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address format." });
  }

  next();
}
