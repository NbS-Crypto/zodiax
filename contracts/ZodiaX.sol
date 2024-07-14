// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @custom:security-contact matrix-plant-pulse@duck.com
contract ZodiaX is ERC20, ERC20Burnable, ERC20Permit {
    constructor() ERC20("ZodiaX", "ZDX") ERC20Permit("ZodiaX") {
        _mint(msg.sender, 299792458 * 10 ** decimals());
    }
}