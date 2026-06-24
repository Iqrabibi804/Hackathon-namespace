import { calculateWalletHealthScore } from "../engine/walletScorer";

jest.mock("../data/etherscan", () => ({
  getNativeBalance: jest.fn(),
  getTokenTransactions: jest.fn(),
}));

import { getTokenTransactions } from "../data/etherscan";
const mockedGetTokenTransactions = getTokenTransactions as jest.MockedFunction<typeof getTokenTransactions>;

describe("calculateWalletHealthScore", () => {
  const WALLET = "0xabcdef1234567890abcdef1234567890abcdef12";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a valid WalletHealthResult structure", async () => {
    mockedGetTokenTransactions.mockResolvedValue(["0xToken1", "0xToken2", "0xToken3"]);

    const result = await calculateWalletHealthScore(WALLET);

    expect(result.walletAddress).toBe(WALLET);
    expect(result.calculatedAt).toBeDefined();
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(["SECURE", "MODERATE", "AT RISK", "CRITICAL"]).toContain(result.grade);
    expect(result.signals).toBeInstanceOf(Array);
  });

  it("calculates diversification score based on token count", async () => {
    mockedGetTokenTransactions.mockResolvedValue(["0xA", "0xB", "0xC", "0xD", "0xE"]);

    const result = await calculateWalletHealthScore(WALLET);

    const diversification = result.signals.find(s => s.name === "Token Diversification");
    expect(diversification).toBeDefined();
    expect(diversification!.score).toBe(40); // min(5*8, 40) = 40
    expect(diversification!.maxScore).toBe(40);
  });

  it("marks token diversification as risk when < 2 tokens", async () => {
    mockedGetTokenTransactions.mockResolvedValue(["0xOnlyOne"]);

    const result = await calculateWalletHealthScore(WALLET);

    const diversification = result.signals.find(s => s.name === "Token Diversification");
    expect(diversification!.isRisk).toBe(true);
    expect(diversification!.score).toBe(8); // 1 * 8
  });

  it("includes stablecoin ratio signal", async () => {
    mockedGetTokenTransactions.mockResolvedValue(["0xA"]);

    const result = await calculateWalletHealthScore(WALLET);

    const stablecoin = result.signals.find(s => s.name === "Stablecoin Ratio");
    expect(stablecoin).toBeDefined();
    expect(stablecoin!.score).toBe(12); // 0.4 * 30 = 12
    expect(stablecoin!.maxScore).toBe(30);
  });

  it("includes portfolio concentration signal", async () => {
    mockedGetTokenTransactions.mockResolvedValue(["0xA"]);

    const result = await calculateWalletHealthScore(WALLET);

    const concentration = result.signals.find(s => s.name === "Portfolio Concentration");
    expect(concentration).toBeDefined();
    // largestTokenRatio is mocked at 0.55, so score = 10
    expect(concentration!.score).toBe(10);
  });

  it("includes protocol exposure deduction", async () => {
    mockedGetTokenTransactions.mockResolvedValue(["0xA"]);

    const result = await calculateWalletHealthScore(WALLET);

    const protocol = result.signals.find(s => s.name === "Protocol Exposure");
    expect(protocol).toBeDefined();
    expect(protocol!.score).toBe(-5); // 1 risky protocol * 5
    expect(protocol!.isRisk).toBe(true);
  });

  it("includes wallet age signal", async () => {
    mockedGetTokenTransactions.mockResolvedValue(["0xA"]);

    const result = await calculateWalletHealthScore(WALLET);

    const age = result.signals.find(s => s.name === "Wallet Age");
    expect(age).toBeDefined();
    expect(age!.score).toBe(5); // isOldWallet = true
    expect(age!.isRisk).toBe(false);
  });

  it("includes recent outflow signal with no deduction when normal", async () => {
    mockedGetTokenTransactions.mockResolvedValue(["0xA"]);

    const result = await calculateWalletHealthScore(WALLET);

    const outflow = result.signals.find(s => s.name === "Recent Outflow Check");
    expect(outflow).toBeDefined();
    expect(outflow!.score).toBe(0); // heavyOutflow = false
    expect(outflow!.isRisk).toBe(false);
  });

  it("assigns correct grade for high score (>= 75)", async () => {
    // 5 tokens: diversification = 40, stablecoin = 12, concentration = 10,
    // protocol = -5, age = 5, outflow = 0 → total = 62 → MODERATE
    mockedGetTokenTransactions.mockResolvedValue(["0xA", "0xB", "0xC", "0xD", "0xE"]);

    const result = await calculateWalletHealthScore(WALLET);

    // With 5 tokens: 40 + 12 + 10 - 5 + 5 + 0 = 62
    expect(result.score).toBe(62);
    expect(result.grade).toBe("MODERATE");
  });

  it("calculates correct score with zero tokens", async () => {
    mockedGetTokenTransactions.mockResolvedValue([]);

    const result = await calculateWalletHealthScore(WALLET);

    // 0 tokens: diversification = 0, stablecoin = 12, concentration = 10,
    // protocol = -5, age = 5, outflow = 0 → total = 22
    expect(result.score).toBe(22);
    expect(result.grade).toBe("CRITICAL");
  });

  it("returns 6 signals in total", async () => {
    mockedGetTokenTransactions.mockResolvedValue(["0xA"]);

    const result = await calculateWalletHealthScore(WALLET);

    expect(result.signals.length).toBe(6);
  });
});
