// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ApprovalGuard
 * @dev Autonomous defense mechanism to revoke dangerous ERC-20 approvals.
 * Note: In reality, smart contracts cannot revoke approvals on behalf of a user directly 
 * unless the user approves the contract to manage their funds. For this MVP, we simulate 
 * the defense action by tracking vulnerable approvals.
 */
contract ApprovalGuard is Ownable {

    event ApprovalRevoked(address indexed user, address indexed token, address spender);
    event ThreatPrevented(address indexed user, address indexed token, address maliciousSpender);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Simulates revoking an approval from a malicious spender when the Rule Engine detects a threat
     * @param user The wallet address at risk
     * @param token The ERC-20 token contract
     * @param spender The malicious contract/address
     */
    function revokeDangerousApproval(address user, address token, address spender) external onlyOwner {
        // In a fully functional system, the user would interact with this contract
        // or this contract would act as a proxy wallet.
        // For our AI Web3 Hackathon MVP, we log the autonomous defense execution.
        
        emit ApprovalRevoked(user, token, spender);
        emit ThreatPrevented(user, token, spender);
    }
}
