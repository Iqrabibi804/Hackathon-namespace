import axios from "axios";

/**
 * etherscan.ts
 * Polygonscan API Wrapper
 */
const BASE_URL = "https://api.polygonscan.com/api";
const API_KEY = process.env.POLYGONSCAN_API_KEY || "";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTokenTransactions(walletAddress: string): Promise<string[]> {
  try {
    await sleep(300);
    const url = `${BASE_URL}?module=account&action=tokentx&address=${walletAddress}&sort=desc&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.data.status !== "1") return [];
    
    // Extract unique token contract addresses
    const tokens = response.data.result.map((tx: any) => tx.contractAddress);
    return Array.from(new Set(tokens)) as string[];
  } catch (error) {
    console.error("Error in getTokenTransactions:", error);
    return [];
  }
}

export async function getTokenHolders(tokenAddress: string): Promise<{ address: string; percentage: number }[]> {
  try {
    await sleep(300);
    // Mock top 20 holders since basic explorer api doesn't expose holder list easily without premium
    return [
      { address: "0xDevWalletAddress123", percentage: 25 },
      { address: "0xLiquidityPoolAddress456", percentage: 40 },
      { address: "0xHolderAddress789", percentage: 5 }
    ];
  } catch (error) {
    console.error("Error in getTokenHolders:", error);
    return [];
  }
}

export async function getContractABI(tokenAddress: string): Promise<any[]> {
  try {
    await sleep(300);
    const url = `${BASE_URL}?module=contract&action=getabi&address=${tokenAddress}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.data.status !== "1") return [];
    return JSON.parse(response.data.result);
  } catch (error) {
    console.error("Error in getContractABI:", error);
    return [];
  }
}

export async function getNativeBalance(walletAddress: string): Promise<string> {
  try {
    await sleep(300);
    const url = `${BASE_URL}?module=account&action=balance&address=${walletAddress}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.data.status !== "1") return "0";
    const balanceWei = response.data.result;
    // Simple conversion to Eth/Matic units
    return (Number(balanceWei) / 1e18).toFixed(4);
  } catch (error) {
    console.error("Error in getNativeBalance:", error);
    return "0";
  }
}

export async function getTransactionHistory(walletAddress: string, days: number = 30): Promise<any[]> {
  try {
    await sleep(300);
    const url = `${BASE_URL}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.data.status !== "1") return [];
    return response.data.result.slice(0, 50); // return last 50 transactions
  } catch (error) {
    console.error("Error in getTransactionHistory:", error);
    return [];
  }
}
