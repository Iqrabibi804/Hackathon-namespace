import { rateLimit } from "../middleware/rateLimit";

function mockReq(ip: string): any {
  return { ip, socket: { remoteAddress: ip } };
}

function mockRes(): any {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("rateLimit middleware", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows first request from a new IP", () => {
    const req = mockReq("192.168.1.100");
    const res = mockRes();
    const next = jest.fn();

    rateLimit(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("allows up to 30 requests within the window", () => {
    const ip = "10.0.0.1";
    const next = jest.fn();

    for (let i = 0; i < 30; i++) {
      const req = mockReq(ip);
      const res = mockRes();
      rateLimit(req, res, next);
    }

    expect(next).toHaveBeenCalledTimes(30);
  });

  it("blocks the 31st request with 429", () => {
    const ip = "10.0.0.2";
    let lastRes: any;

    for (let i = 0; i < 31; i++) {
      const req = mockReq(ip);
      lastRes = mockRes();
      const next = jest.fn();
      rateLimit(req, lastRes, next);
    }

    expect(lastRes.status).toHaveBeenCalledWith(429);
    expect(lastRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Too Many Requests" })
    );
  });

  it("resets the counter after the window expires", () => {
    const ip = "10.0.0.3";

    // Use up 30 requests
    for (let i = 0; i < 30; i++) {
      rateLimit(mockReq(ip), mockRes(), jest.fn());
    }

    // Advance time past the 1-minute window
    jest.advanceTimersByTime(61000);

    const req = mockReq(ip);
    const res = mockRes();
    const next = jest.fn();
    rateLimit(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("falls back to socket.remoteAddress when req.ip is undefined", () => {
    const req = { ip: undefined, socket: { remoteAddress: "172.16.0.1" } } as any;
    const res = mockRes();
    const next = jest.fn();

    rateLimit(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("uses 'unknown' when neither ip nor remoteAddress exists", () => {
    const req = { ip: undefined, socket: { remoteAddress: undefined } } as any;
    const res = mockRes();
    const next = jest.fn();

    rateLimit(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
