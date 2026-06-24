import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export async function getWalletData(address: string) {
  try {
    // Fetch native balance
    const balance = await alchemy.core.getBalance(address);
    
    // Fetch token balances
    const tokens = await alchemy.core.getTokenBalances(address);
    
    // Fetch transaction history
    const transfers = await alchemy.core.getAssetTransfers({
      fromBlock: '0x0',
      fromAddress: address,
      category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
      maxCount: 50,
    });

    return {
      balance: balance.toString(),
      tokenCount: tokens.tokenBalances.length,
      recentTransfers: transfers.transfers,
    };
  } catch (error) {
    console.error('Alchemy error:', error);
    throw new Error('Failed to fetch wallet data from blockchain');
  }
}
