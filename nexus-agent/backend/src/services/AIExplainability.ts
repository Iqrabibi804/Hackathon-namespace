import axios from "axios";

/**
 * AIExplainability.ts
 * Layer 2: Claude API
 * ONLY explains what the Deterministic Rule Engine calculated. NEVER calculates risk itself.
 */
export class AIExplainability {
  private static API_KEY = process.env.CLAUDE_API_KEY;
  private static URL = "https://api.anthropic.com/v1/messages";

  /**
   * Generates a human-readable explanation of why a wallet's health score dropped.
   * @param riskFactors The raw risk factors identified by the Rule Engine.
   * @param finalScore The final score calculated by the Rule Engine.
   */
  static async explainRiskScore(riskFactors: any[], finalScore: number): Promise<string> {
    if (!this.API_KEY || this.API_KEY === "your_anthropic_api_key") {
      console.warn("Claude API key not configured. Returning mock explanation.");
      return `(Mock AI) The deterministic engine calculated a risk score of ${finalScore}. Key factors: ${riskFactors.map(r => r.factor).join(', ')}`;
    }

    try {
      const prompt = `
      You are the AI explainability layer for NexusAgent, a DeFi security system.
      The deterministic math engine has calculated the following risks for a user's wallet:
      Final Health Score: ${finalScore}/100
      Risk Factors: ${JSON.stringify(riskFactors)}
      
      Your job is ONLY to EXPLAIN these findings in clear, concise, cybersecurity terms. 
      Do NOT perform any calculations. Just explain why the score is what it is based on the provided factors.
      Keep it under 3 sentences.
      `;

      const response = await axios.post(
        this.URL,
        {
          model: "claude-3-sonnet-20240229",
          max_tokens: 150,
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            "x-api-key": this.API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
          }
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error("Claude API Error:", error);
      return "Error generating AI explanation. Please check API keys.";
    }
  }
}
