const hre = require("hardhat");

async function main() {
  const WavePortal = await hre.ethers.getContractFactory("WavePortal");
  const wavePortal = await WavePortal.deploy({
    value: hre.ethers.utils.parseEther("0.001")
  });

  await wavePortal.deployed();

  console.log("WavePortal deployed to:", wavePortal.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
