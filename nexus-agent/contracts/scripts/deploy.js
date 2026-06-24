import hre from "hardhat";

async function main() {
  console.log("🚀 Starting deployment of NexusAgent Smart Contracts...");

  // 1. Deploy NexusDefender
  const NexusDefender = await hre.ethers.getContractFactory("NexusDefender");
  const defender = await NexusDefender.deploy();
  await defender.waitForDeployment();
  const defenderAddress = await defender.getAddress();
  console.log("✅ NexusDefender deployed to:", defenderAddress);

  // 2. Deploy ApprovalGuard
  const ApprovalGuard = await hre.ethers.getContractFactory("ApprovalGuard");
  const guard = await ApprovalGuard.deploy();
  await guard.waitForDeployment();
  console.log("✅ ApprovalGuard deployed to:", await guard.getAddress());

  // 3. Deploy EmergencyWithdraw (Requires NexusDefender address)
  const EmergencyWithdraw = await hre.ethers.getContractFactory("EmergencyWithdraw");
  const emergency = await EmergencyWithdraw.deploy(defenderAddress);
  await emergency.waitForDeployment();
  console.log("✅ EmergencyWithdraw deployed to:", await emergency.getAddress());

  console.log("🎉 All contracts deployed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
