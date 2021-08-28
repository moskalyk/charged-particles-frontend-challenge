const { expect } = require("chai");
const { ethers } = require("hardhat");

const daiContractAddress = '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa';
const chargedParticleAddress = '0xF03EAB2b60eFB6E24C1b254A2D6fC91Eb639D6d3';

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  it("Should plant a tree nft as a charged particle", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const CPTree = await hre.ethers.getContractFactory("CPTree");
    const greeter = await Greeter.deploy("Hello, Hardhat!");
    await greeter.deployed();
    const cptree = await CPTree.deploy(chargedParticleAddress);
    await cptree.deployed();

    const tx = await cptree.plant('aave', daiContractAddress, 2, 'QmQW3dWkX9vPRDfPprhu8pqtVKAkroh9aXgfs5SqtpxpsM');
    console.log(tx)

  })
});
