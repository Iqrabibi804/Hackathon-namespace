@echo off
echo ==========================================
echo Starting NexusAgent setup...
echo ==========================================
mkdir d:\hackathon\nexus-agent
cd /d d:\hackathon\nexus-agent

echo.
echo [1/3] Setting up Frontend...
call npx create-next-app@14 frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cd frontend
call npm install framer-motion @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query
echo NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id> .env.template
echo NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key>> .env.template
cd ..

echo.
echo [2/3] Setting up Backend...
mkdir backend
cd backend
call npm init -y
call npm install express cors dotenv ethers@6 axios
call npm install --save-dev nodemon typescript @types/express @types/cors @types/node ts-node
mkdir src
mkdir src\routes
mkdir src\controllers
mkdir src\services
mkdir src\config
mkdir src\utils
echo PORT=5000> .env.template
echo POLYGONSCAN_API_KEY=your_polygonscan_api_key>> .env.template
echo COINGECKO_API_KEY=your_coingecko_api_key>> .env.template
echo DEFILLAMA_API_KEY=your_defillama_api_key>> .env.template
echo CLAUDE_API_KEY=your_anthropic_api_key>> .env.template
echo RPC_URL_MUMBAI=your_mumbai_rpc_url>> .env.template
cd ..

echo.
echo [3/3] Setting up Contracts...
mkdir contracts
cd contracts
call npm init -y
call npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
call npm install @openzeppelin/contracts@5.0.0
echo require("@nomicfoundation/hardhat-toolbox"); > hardhat.config.js
echo. >> hardhat.config.js
echo /** @type import('hardhat/config').HardhatUserConfig */ >> hardhat.config.js
echo module.exports = { solidity: "0.8.24" }; >> hardhat.config.js
mkdir contracts
mkdir scripts
mkdir test
echo PRIVATE_KEY=your_deployment_wallet_private_key> .env.template
echo POLYGONSCAN_API_KEY=your_polygonscan_api_key>> .env.template
echo MUMBAI_RPC_URL=your_mumbai_rpc_url>> .env.template
cd ..

echo.
echo Initializing Git...
git init
echo node_modules/> .gitignore
echo .env>> .gitignore
echo .next/>> .gitignore
echo dist/>> .gitignore
echo build/>> .gitignore
echo coverage/>> .gitignore
echo artifacts/>> .gitignore
echo cache/>> .gitignore
echo typechain-types/>> .gitignore

echo.
echo ==========================================
echo Setup Complete! 
echo ==========================================
pause
