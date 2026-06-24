import { Request, Response, NextFunction } from "express";

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30;

const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  const clientData = ipRequestMap.get(ip);

  if (!clientData) {
    ipRequestMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  if (now > clientData.resetTime) {
    // Reset rate limit window
    clientData.count = 1;
    clientData.resetTime = now + WINDOW_MS;
    return next();
  }

  clientData.count++;
  if (clientData.count > MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: `Rate limit exceeded. Max ${MAX_REQUESTS} requests per minute. Try again soon.`,
    });
  }

  next();
}
