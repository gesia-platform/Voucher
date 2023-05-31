import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
	solidity: '0.8.18',
	networks: {
		dev: {
			url: 'http://localhost:8545',
			accounts: ['0x830086805cacb7d5901948deab2ab7ff058a0169bfef433ee05951176a662688', '0x1151a6577dd592e19fedc18db148e7ecf12e0d7dbb6312b669a30d3016740149', '0xddde5b0c2a134b2d8db2838d6fcf4d24dabdec207516593c7f5c0c8778874120', '0x73b3b25ccab5090dcf90c6474f72b29f2f42c18e2a2cc9dd68d3b64122c53bb2', '0x70d5f508274b369f1f3238ae20997dba48cf07ea5b395105a1c278f747bf9092'],
		},
	},
};

export default config;
