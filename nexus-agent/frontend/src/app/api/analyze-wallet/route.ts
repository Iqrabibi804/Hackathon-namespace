import { NextResponse } from 'next/server';
import { getWalletData } from '../../../lib/alchemy';
import { analyzeWalletWithClaude } from '../../../lib/claude';
import { scanLimiter, checkRateLimit } from '../../../lib/rateLimiter';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate Limiting via Upstash
    const rateLimit = await checkRateLimit(scanLimiter, ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Reset': rateLimit.reset.toString() } }
      );
    }

    const body = await req.json();
    const { address, chain } = body;

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // 1. Fetch live blockchain data via Alchemy
    const walletData = await getWalletData(address);

    // 2. Perform AI Security Analysis via Claude
    const analysis = await analyzeWalletWithClaude({ address, chain, ...walletData });

    // 3. Return the fully formed analysis report
    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error: any) {
    console.error('Wallet Analysis API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during analysis' },
      { status: 500 }
    );
  }
}
