import { RuleEngine, RiskSignal } from "../services/RuleEngine";

describe("RuleEngine", () => {
  describe("calculateWalletHealth", () => {
    it("returns 100 when no signals are present", () => {
      expect(RuleEngine.calculateWalletHealth([])).toBe(100);
    });

    it("subtracts scoreImpact from 100", () => {
      const signals: RiskSignal[] = [
        { factor: "Test", scoreImpact: 20, description: "desc" },
      ];
      expect(RuleEngine.calculateWalletHealth(signals)).toBe(80);
    });

    it("handles multiple signals cumulatively", () => {
      const signals: RiskSignal[] = [
        { factor: "A", scoreImpact: 30, description: "a" },
        { factor: "B", scoreImpact: 25, description: "b" },
      ];
      expect(RuleEngine.calculateWalletHealth(signals)).toBe(45);
    });

    it("clamps score to 0 when impacts exceed 100", () => {
      const signals: RiskSignal[] = [
        { factor: "A", scoreImpact: 80, description: "a" },
        { factor: "B", scoreImpact: 50, description: "b" },
      ];
      expect(RuleEngine.calculateWalletHealth(signals)).toBe(0);
    });

    it("clamps score to 100 when negative impacts are given", () => {
      const signals: RiskSignal[] = [
        { factor: "Bonus", scoreImpact: -20, description: "negative" },
      ];
      expect(RuleEngine.calculateWalletHealth(signals)).toBe(100);
    });
  });

  describe("analyzeTokenRisk", () => {
    it("returns null when liquidity and dev holdings are safe", () => {
      expect(RuleEngine.analyzeTokenRisk(80, 10)).toBeNull();
    });

    it("returns risk signal when liquidity locked < 50%", () => {
      const result = RuleEngine.analyzeTokenRisk(30, 10);
      expect(result).not.toBeNull();
      expect(result!.factor).toBe("Rug Pull Risk");
      expect(result!.scoreImpact).toBe(80);
      expect(result!.description).toContain("30%");
    });

    it("returns risk signal when dev holdings > 20%", () => {
      const result = RuleEngine.analyzeTokenRisk(80, 30);
      expect(result).not.toBeNull();
      expect(result!.factor).toBe("Rug Pull Risk");
      expect(result!.description).toContain("30%");
    });

    it("returns risk when both conditions are bad", () => {
      const result = RuleEngine.analyzeTokenRisk(20, 40);
      expect(result).not.toBeNull();
      expect(result!.scoreImpact).toBe(80);
    });

    it("returns null at boundary (50% liquidity, 20% dev)", () => {
      expect(RuleEngine.analyzeTokenRisk(50, 20)).toBeNull();
    });
  });

  describe("checkProtocolTVL", () => {
    it("returns null when TVL drop is <= 30%", () => {
      expect(RuleEngine.checkProtocolTVL(30)).toBeNull();
      expect(RuleEngine.checkProtocolTVL(10)).toBeNull();
    });

    it("returns risk signal when TVL drops > 30%", () => {
      const result = RuleEngine.checkProtocolTVL(50);
      expect(result).not.toBeNull();
      expect(result!.factor).toBe("Protocol TVL Crash");
      expect(result!.scoreImpact).toBe(50);
      expect(result!.description).toContain("50%");
    });

    it("returns risk at boundary (31%)", () => {
      const result = RuleEngine.checkProtocolTVL(31);
      expect(result).not.toBeNull();
      expect(result!.description).toContain("31%");
    });
  });
});
