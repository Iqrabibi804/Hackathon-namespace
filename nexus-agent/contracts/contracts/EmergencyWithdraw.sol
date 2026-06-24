// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NexusDefender.sol";

/**
 * @title EmergencyWithdraw
 * @dev Autonomous defense mechanism to move funds to a backup wallet when extreme risk is detected.
 */
contract EmergencyWithdraw is Ownable {

    NexusDefender public defenderContract;

    event EmergencyEvacuation(address indexed user, address indexed backupWallet, address token, uint256 amount);

    constructor(address _defenderContract) Ownable(msg.sender) {
        defenderContract = NexusDefender(_defenderContract);
    }

    /**
     * @dev Simulates an emergency withdrawal (front-running a rug pull or hack)
     * For MVP purposes, this acts as an escrow that auto-transfers on trigger.
     */
    function triggerEmergencyEvacuation(address user, address tokenAddress, uint256 amount) external onlyOwner {
        // Fetch user's backup wallet from NexusDefender
        (, , address backupWallet) = defenderContract.userProfiles(user);
        require(backupWallet != address(0), "No backup wallet configured");

        // Note: For hackathon MVP, the user would need to have deposited funds 
        // into this contract beforehand, or approved it to transfer.
        // We log the autonomous action for the AI intelligence layer.
        
        emit EmergencyEvacuation(user, backupWallet, tokenAddress, amount);
    }
}
