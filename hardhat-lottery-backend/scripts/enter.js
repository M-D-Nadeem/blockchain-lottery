const { ethers, deployments } = require("hardhat");
const fs=require("fs")
const abiAdd="./artifacts/contracts/Lottery.sol/Lottery.json"
const lotteryAbi=JSON.parse(fs.readFileSync(abiAdd,"utf-8"))
const ABI=lotteryAbi.abi
async function enterRaffle() {
    // const lottery=await deployments.get("Lottery")
    // console.log(lottery);
    // const lottery = await ethers.getContractAt(ABI, "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
    const lottery = await ethers.getContract("Lottery")

// const lottery = lotteryContract.attach("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
  console.log(lottery);
  
  const entranceFee = await lottery.getEnterenceFee();
  console.log(entranceFee.toString());
  
  await lottery.enterLottery({ value: entranceFee });
  console.log("Entered!");
}

enterRaffle()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });