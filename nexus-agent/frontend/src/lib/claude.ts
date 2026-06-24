import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeWalletWithClaude(walletData: any) {
  const prompt = `
    Analyze the following wallet data and provide a comprehensive security risk assessment.
    
    Wallet Data:
    ${JSON.stringify(walletData, null, 2)}
    
    Calculate the following risks (0-100):
    - Approval Risk
    - Contract Risk
    - Liquidity Risk
    - Phishing Risk
    - Bridge Risk
    
    Respond STRICTLY with a JSON object in the following format. Do NOT include markdown blocks or any other text.
    {
      "finalRiskScore": 45,
      "healthRating": "Moderate Risk",
      "riskBreakdown": {
        "approvalRisk": 30,
        "contractRisk": 50,
        "liquidityRisk": 10,
        "phishingRisk": 20,
        "bridgeRisk": 5
      },
      "aiExplanation": "A short, 2-sentence explanation of the primary risks.",
      "recommendations": ["Revoke approval for contract 0x...", "Monitor liquidity on token X"]
    }
  `;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      temperature: 0,
      system: "You are a world-class Web3 security auditor AI. You analyze blockchain transactions and output strict JSON.",
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error('Claude error:', error);
    throw new Error('Failed to analyze wallet data with AI');
  }
}
