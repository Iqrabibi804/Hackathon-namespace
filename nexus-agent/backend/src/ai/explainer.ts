import axios from "axios";

/**
 * explainer.ts
 * Claude AI Explainer
 * System System Prompt Constraints:
 * - Role: DeFi security analyst
 * - Never say "you should", "invest", "buy", "sell"
 * - Explain WHY something is risky
 * - Max 3 sentences
 * - Simple language — non-technical user
 */

const API_KEY = process.env.CLAUDE_API_KEY || "";
const URL = "https://api.anthropic.com/v1/messages";

export async function explainWalletRisk(riskData: any): Promise<string> {
  const fallback = `Your wallet health score is ${riskData.score}/100, graded as ${riskData.grade}. The primary risks are related to token diversification, high asset concentration, and potential exposure to risky protocol smart contracts.`;

  if (!API_KEY || API_KEY === "your_anthropic_api_key") {
    return fallback;
  }

  try {
    const prompt = `
    You are a DeFi security analyst explaining wallet risk score.
    Input Risk Data: ${JSON.stringify(riskData)}
    Explain why this wallet got this score and why it is risky.
    Never say "you should", "invest", "buy", "sell".
    Explain in maximum 3 sentences using simple language.
    `;

    const response = await axios.post(
      URL,
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error("Claude explainWalletRisk error, returning fallback", error);
    return fallback;
  }
}

export async function explainRugPull(rugData: any): Promise<string> {
  const fallback = `The token has a rug pull score of ${rugData.rugPullScore}/100 (${rugData.riskLevel} risk). High developer supply concentration and short liquidity lock periods present direct risks of capital theft.`;

  if (!API_KEY || API_KEY === "your_anthropic_api_key") {
    return fallback;
  }

  try {
    const prompt = `
    You are a DeFi security analyst explaining rug pull risk.
    Input Rug Data: ${JSON.stringify(rugData)}
    Explain the top 2 risks.
    Never say "you should", "invest", "buy", "sell".
    Explain in maximum 3 sentences using simple language.
    `;

    const response = await axios.post(
      URL,
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error("Claude explainRugPull error, returning fallback", error);
    return fallback;
  }
}

export async function explainProtocolRisk(protocolName: string, tvlChangePercent: number, anomalyType: string): Promise<string> {
  const fallback = `Protocol ${protocolName} exhibits high-risk signals with a ${tvlChangePercent}% TVL change and a detected anomaly type of ${anomalyType}. This indicates potential protocol exploit or exit scam in progress.`;

  if (!API_KEY || API_KEY === "your_anthropic_api_key") {
    return fallback;
  }

  try {
    const prompt = `
    You are a DeFi security analyst explaining protocol risk.
    Protocol: ${protocolName}
    TVL Change: ${tvlChangePercent}%
    Anomaly Type: ${anomalyType}
    Explain why this is risky.
    Never say "you should", "invest", "buy", "sell".
    Explain in maximum 2 sentences using simple language.
    `;

    const response = await axios.post(
      URL,
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error("Claude explainProtocolRisk error, returning fallback", error);
    return fallback;
  }
}
