// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NexusDefender
 * @dev Manages user defense profiles and logs risk intelligence actions.
 */
contract NexusDefender is Ownable {
    
    struct DefenseProfile {
        bool isActive;
        uint256 riskScore;
        address backupWallet;
    }

    // Mapping from user wallet to their defense profile
    mapping(address => DefenseProfile) public userProfiles;

    // Events for the AI Risk Engine to listen to
    event ProfileCreated(address indexed user, address backupWallet);
    event ThreatLogged(address indexed user, string threatType, string aiExplanation);
    event DefenseActionExecuted(address indexed user, string actionType);
    event RiskScoreUpdated(address indexed user, uint256 newScore);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Users register their wallet and set a backup address for emergencies
     */
    function createProfile(address _backupWallet) external {
        require(!userProfiles[msg.sender].isActive, "Profile already exists");
        require(_backupWallet != address(0), "Invalid backup wallet");
        
        userProfiles[msg.sender] = DefenseProfile({
            isActive: true,
            riskScore: 0, // 0 = Safe, 100 = Maximum Risk
            backupWallet: _backupWallet
        });

        emit ProfileCreated(msg.sender, _backupWallet);
    }

    /**
     * @dev Called by the backend Rule Engine to update a user's health score
     */
    function updateRiskScore(address user, uint256 score) external onlyOwner {
        require(userProfiles[user].isActive, "Profile not found");
        require(score <= 100, "Score must be 0-100");
        
        userProfiles[user].riskScore = score;
        emit RiskScoreUpdated(user, score);
    }

    /**
     * @dev Called by the backend to log a detected threat with Claude AI's explanation
     */
    function logThreat(address user, string calldata threatType, string calldata aiExplanation) external onlyOwner {
        require(userProfiles[user].isActive, "Profile not found");
        emit ThreatLogged(user, threatType, aiExplanation);
    }

    /**
     * @dev Logs when an autonomous defense action is executed
     */
    function logDefenseAction(address user, string calldata actionType) external onlyOwner {
        require(userProfiles[user].isActive, "Profile not found");
        emit DefenseActionExecuted(user, actionType);
    }
}
