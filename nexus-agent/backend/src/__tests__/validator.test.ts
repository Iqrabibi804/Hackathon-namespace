import { validateEthAddress } from "../middleware/validator";

function mockReq(params: any = {}, body: any = {}): any {
  return { params, body };
}

function mockRes(): any {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("validateEthAddress middleware", () => {
  it("calls next() for valid address in params", () => {
    const req = mockReq({ address: "0x1234567890abcdef1234567890abcdef12345678" });
    const res = mockRes();
    const next = jest.fn();

    validateEthAddress(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("calls next() for valid address in body.walletAddress", () => {
    const req = mockReq({}, { walletAddress: "0xABCDEF1234567890ABCDEF1234567890ABCDEF12" });
    const res = mockRes();
    const next = jest.fn();

    validateEthAddress(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("calls next() for valid address in body.tokenAddress", () => {
    const req = mockReq({}, { tokenAddress: "0x0000000000000000000000000000000000000001" });
    const res = mockRes();
    const next = jest.fn();

    validateEthAddress(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 400 when no address is provided", () => {
    const req = mockReq({}, {});
    const res = mockRes();
    const next = jest.fn();

    validateEthAddress(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Ethereum address is required." });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 for address without 0x prefix", () => {
    const req = mockReq({ address: "1234567890abcdef1234567890abcdef12345678" });
    const res = mockRes();
    const next = jest.fn();

    validateEthAddress(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Ethereum address format." });
  });

  it("returns 400 for address that is too short", () => {
    const req = mockReq({ address: "0x1234" });
    const res = mockRes();
    const next = jest.fn();

    validateEthAddress(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 for address with invalid characters", () => {
    const req = mockReq({ address: "0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG" });
    const res = mockRes();
    const next = jest.fn();

    validateEthAddress(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 for address that is too long", () => {
    const req = mockReq({ address: "0x1234567890abcdef1234567890abcdef1234567800" });
    const res = mockRes();
    const next = jest.fn();

    validateEthAddress(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
