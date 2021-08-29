const { expect } = require("chai");
const { ethers } = require("hardhat");

const daiContractAddress = '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd';
const chargedParticleAddress = '0xF03EAB2b60eFB6E24C1b254A2D6fC91Eb639D6d3';
const chargedSettingsAddress = '0x57B5C64E0494a7Bd4A98B33C105E3ef31301dFdF';

describe("CPTree", function () {
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
    const CPTree = await hre.ethers.getContractFactory("CPTree");
    const cptree = await CPTree.deploy(chargedParticleAddress);
    // const cptree = await CPTree.deploy(chargedParticleAddress, chargedSettingsAddress);
    await cptree.deployed();
    const res = await cptree.greeting()
    console.log(res)
    expect(res).to.equal("Welcome to the renewing arbor;");
    // console.log(await cptree._CP())  


    
    })
    
    it("Should plant a tree nft seed as a charged covalent", async function () {
      const CPTree = await hre.ethers.getContractFactory("CPTree");
      const cptree = await CPTree.deploy(chargedParticleAddress);
      await cptree.deployed();

      try{
        const tx = await cptree.plantSeed('aave', daiContractAddress, new ethers.BigNumber.from(2), 'QmQW3dWkX9vPRDfPprhu8pqtVKAkroh9aXgfs5SqtpxpsM');
        console.log(tx)
      }catch(e){
        console.log(e)
      }

    })
})
