// coinGecko.ts
/**
 * CoinGecko API wrapper for fetching token USD prices on Polygon network.
 * Provides functions to retrieve prices for arbitrary token contract addresses
 * and convenience function for major stablecoins.
 */
import axios from "axios";

// Base URL for CoinGecko API
const BASE_URL = "https://api.coingecko.com/api/v3";

/**
 * Fetch USD price for a list of token contract addresses on Polygon.
 * Returns a map of contract address (lowercased) to price.
 */
export async function getTokenPrices(tokenAddresses: string[]): Promise<Record<string, number>> {
  try {
    const contracts = tokenAddresses.map((addr) => addr.toLowerCase()).join(",");
    const url = `${BASE_URL}/simple/token_price/polygon-pos?contract_addresses=${contracts}&vs_currencies=usd`;
    const response = await axios.get(url);
    const data = response.data;
    const priceMap: Record<string, number> = {};
    for (const [addr, info] of Object.entries<any>(data)) {
      priceMap[addr.toLowerCase()] = info.usd;
    }
    return priceMap;
  } catch (error) {
    console.error("Error fetching token prices from CoinGecko:", error);
    return {};
  }
}

/**
 * Convenience wrapper that returns stablecoin USD prices.
 * Uses known Polygon contract addresses for USDC, USDT, and DAI.
 */
export async function getStablecoinPrices(): Promise<Record<string, number>> {
  // Known Polygon contract addresses for the major stablecoins.
  const stablecoins = [
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // USDC
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", // USDT
    "0x6b175474e89094c44da98b954eedeac495271d0f" // DAI (Ethereum mainnet address – placeholder for Polygon if needed)
  ];
  return await getTokenPrices(stablecoins);
}
