import { ethers } from 'hardhat';

async function main() {
	const FungibleVoucher = await ethers.getContractFactory('FungibleVoucher');
	const fungibleVoucher = await FungibleVoucher.deploy('FungibleVoucher', 'FV');

	await fungibleVoucher.deployed();

	console.log(`Deployed FungibleVoucher contract address : ${fungibleVoucher.address}`);

	const NfvNFT = await ethers.getContractFactory('NfvNFT');
	const nfvNFT = await NfvNFT.deploy('VoucherNFT', 'VNFT', fungibleVoucher.address);

	await nfvNFT.deployed();

	console.log(`Deployed NfvNFT contract address : ${fungibleVoucher.address}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
