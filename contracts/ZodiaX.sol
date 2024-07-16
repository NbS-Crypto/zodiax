// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @custom:security-contact matrix-plant-pulse@duck.com
contract ZodiX is ERC20, ERC20Burnable, ERC20Permit {
    constructor() ERC20("Zodi-X", "ZODIX") ERC20Permit("Zodi-X") {
        _mint(msg.sender, 2997924580 * 10 ** decimals());
    }
}
