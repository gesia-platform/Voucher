import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { expect } from 'chai';
import { FungibleVoucher } from '../typechain-types';

describe('FungibleVoucher', () => {
	let owner: Signer;
	let operator: Signer;
	let user: Signer;
	let voucher: FungibleVoucher;

	beforeEach(async () => {
		[owner, operator, user] = await ethers.getSigners();

		const FungibleVoucher = await ethers.getContractFactory('FungibleVoucher');
		voucher = await FungibleVoucher.deploy('FungibleVoucher', 'FV');
		await voucher.deployed();
	});

	it('should have correct initial value', async () => {
		expect(await voucher.name()).to.equal('FungibleVoucher');
		expect(await voucher.symbol()).to.equal('FV');
		expect(await voucher.totalSupply()).to.equal(0);
	});

	it('should add and remove operator correctly', async function () {
		const operator_addr: string = await operator.getAddress();

		await voucher.addOperator(operator_addr);
		expect(await voucher.operatorList(operator_addr)).to.equal(true);

		await voucher.removeOperator(operator_addr);
		expect(await voucher.operatorList(operator_addr)).to.equal(false);
	});

	it('should add and remove user to whitelist correctly', async function () {
		const user_addr: string = await user.getAddress();

		await voucher.addWhiteList(user_addr);
		expect(await voucher.whiteList(user_addr)).to.equal(true);

		await voucher.removeWhiteList(user_addr);
		expect(await voucher.whiteList(user_addr)).to.equal(false);
	});

	it('should mint vouchers by operator', async () => {
		const operator_addr: string = await operator.getAddress();

		await voucher.addOperator(operator_addr);
		await voucher.addWhiteList(operator_addr);

		const amount = 100;
		await voucher.connect(operator).mintByOperator(amount);

		const balance = await voucher.balanceOf(voucher.address);
		expect(balance).to.equal(amount);
		expect(await voucher.totalSupply()).to.equal(amount);
	});

	it('should not mint vouchers by non-operator', async function () {
		await expect(voucher.connect(user).mintByOperator(100)).to.be.revertedWith('not operator');
	});

	it('should transfer vouchers from contract to user', async function () {
		const operator_addr: string = await operator.getAddress();
		const user_addr: string = await user.getAddress();
		const amount = 100;

		await voucher.addOperator(operator_addr);
		await voucher.addWhiteList(user_addr);

		await voucher.connect(operator).mintByOperator(amount);
		await voucher.connect(user).claimToken(amount);

		const balance = await voucher.balanceOf(user_addr);
		expect(balance).to.equal(amount);
	});

	it('should not transfer vouchers to non-whitelisted user', async function () {
		await expect(voucher.connect(user).claimToken(100)).to.be.revertedWith('not in whitelist');
	});
});
