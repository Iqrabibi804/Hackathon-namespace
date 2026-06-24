import { detectRugPull } from "../engine/rugPullEngine";

jest.mock("../data/etherscan", () => ({
  getTokenHolders: jest.fn(),
  getContractABI: jest.fn(),
}));

import { getTokenHolders, getContractABI } from "../data/etherscan";
const mockedGetTokenHolders = getTokenHolders as jest.MockedFunction<typeof getTokenHolders>;
const mockedGetContractABI = getContractABI as jest.MockedFunction<typeof getContractABI>;

describe("detectRugPull", () => {
  const TOKEN = "0x1234567890abcdef1234567890abcdef12345678";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns LOW risk for safe token with verified contract", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xDevWallet", percentage: 5 },
      { address: "0xPool", percentage: 10 },
    ]);
    mockedGetContractABI.mockResolvedValue([
      { name: "transfer", type: "function" },
      { name: "approve", type: "function" },
    ]);

    const result = await detectRugPull(TOKEN);

    expect(result.tokenAddress).toBe(TOKEN);
    expect(result.riskLevel).toBe("LOW");
    expect(result.rugPullScore).toBeLessThanOrEqual(30);
    expect(result.analyzedAt).toBeDefined();
  });

  it("detects CRITICAL owner concentration (>50%)", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xDevWallet", percentage: 60 },
      { address: "0xPool", percentage: 10 },
    ]);
    mockedGetContractABI.mockResolvedValue([]);

    const result = await detectRugPull(TOKEN);

    const ownerRisk = result.risks.find(r => r.rule === "Owner Concentration");
    expect(ownerRisk).toBeDefined();
    expect(ownerRisk!.severity).toBe("CRITICAL");
    expect(ownerRisk!.points).toBe(30);
  });

  it("detects HIGH owner concentration (25-50%)", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xDevWallet", percentage: 30 },
      { address: "0xPool", percentage: 10 },
    ]);
    mockedGetContractABI.mockResolvedValue([]);

    const result = await detectRugPull(TOKEN);

    const ownerRisk = result.risks.find(r => r.rule === "Owner Concentration");
    expect(ownerRisk).toBeDefined();
    expect(ownerRisk!.severity).toBe("HIGH");
    expect(ownerRisk!.points).toBe(15);
  });

  it("detects mint functionality as CRITICAL risk", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xHolder1", percentage: 10 },
    ]);
    mockedGetContractABI.mockResolvedValue([
      { name: "mint", type: "function" },
      { name: "transfer", type: "function" },
    ]);

    const result = await detectRugPull(TOKEN);

    const mintRisk = result.risks.find(r => r.rule === "Mint Functionality");
    expect(mintRisk).toBeDefined();
    expect(mintRisk!.severity).toBe("CRITICAL");
    expect(mintRisk!.points).toBe(20);
  });

  it("detects proxy upgradeability as HIGH risk", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xHolder1", percentage: 10 },
    ]);
    mockedGetContractABI.mockResolvedValue([
      { name: "upgradeTo", type: "function" },
      { name: "transfer", type: "function" },
    ]);

    const result = await detectRugPull(TOKEN);

    const proxyRisk = result.risks.find(r => r.rule === "Proxy Upgradeability");
    expect(proxyRisk).toBeDefined();
    expect(proxyRisk!.severity).toBe("HIGH");
    expect(proxyRisk!.points).toBe(15);
  });

  it("detects whale concentration when top holders > 80%", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xWhale1", percentage: 50 },
      { address: "0xWhale2", percentage: 35 },
    ]);
    mockedGetContractABI.mockResolvedValue([]);

    const result = await detectRugPull(TOKEN);

    const whaleRisk = result.risks.find(r => r.rule === "Top Holders Concentration");
    expect(whaleRisk).toBeDefined();
    expect(whaleRisk!.points).toBe(15);
  });

  it("detects unverified contract when ABI is empty", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xHolder1", percentage: 5 },
    ]);
    mockedGetContractABI.mockResolvedValue([]);

    const result = await detectRugPull(TOKEN);

    const verifyRisk = result.risks.find(r => r.rule === "Contract Verification");
    expect(verifyRisk).toBeDefined();
    expect(verifyRisk!.points).toBe(10);
  });

  it("marks isScamLikely true when score > 65", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xDevWallet", percentage: 60 },
      { address: "0xWhale", percentage: 30 },
    ]);
    mockedGetContractABI.mockResolvedValue([
      { name: "mint", type: "function" },
      { name: "upgradeTo", type: "function" },
    ]);

    const result = await detectRugPull(TOKEN);

    expect(result.isScamLikely).toBe(true);
    expect(result.rugPullScore).toBeGreaterThan(65);
  });

  it("caps rugPullScore at 100", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xDevWallet", percentage: 60 },
      { address: "0xWhale", percentage: 50 },
    ]);
    mockedGetContractABI.mockResolvedValue([
      { name: "mint", type: "function" },
      { name: "upgradeTo", type: "function" },
    ]);

    const result = await detectRugPull(TOKEN);

    expect(result.rugPullScore).toBeLessThanOrEqual(100);
  });

  it("returns totalSignalsDetected matching risks array length", async () => {
    mockedGetTokenHolders.mockResolvedValue([
      { address: "0xHolder", percentage: 5 },
    ]);
    mockedGetContractABI.mockResolvedValue([
      { name: "transfer", type: "function" },
    ]);

    const result = await detectRugPull(TOKEN);

    expect(result.totalSignalsDetected).toBe(result.risks.length);
  });
});
