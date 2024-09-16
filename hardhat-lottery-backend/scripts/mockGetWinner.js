
// const {deployments,ethers, network}=require("hardhat")
// const {networkConfig}=require("../helper-hardhat-config")
// const fs=require("fs")
// const ADDRESS="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
// const abiAdd="./artifacts/contracts/Lottery.sol/Lottery.json"
// const lotteryAbi=JSON.parse(fs.readFileSync(abiAdd,"utf-8"))
// const ABI=lotteryAbi.abi
// async function mockKeepers() {
//    const loterry=await ethers.getContract("Lottery")
//    console.log(loterry);
   
    
// }
// async function mockVrf(requestId,lottery) {
//     console.log("We on a local network? Ok let's pretend...")
//     const mockVrfContract=await deployments.get("VRFCoordinatorV2_5Mock")
//     const mockVrf=await ethers.getContractAt(mockVrfContract.abi,mockVrfContract.address)
//     await mockVrf.fulfillRandomWords(requestId,lottery.target)
//     const recentWinner=await lottery.getResentWinner()
//     console.log("Recent winner",recentWinner);
    
    
// }
// mockKeepers()
// .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })

const { ethers, network, getNamedAccounts, deployments } = require("hardhat")
const { devlopmentChain, networkConfig } = require("../helper-hardhat-config")

async function mockKeepers() {
    console.log(network.name);
    
    // const lotterContract=await deployments.get("Lottery")
    // const lottery=await ethers.getContractAt(lotterContract.abi,lotterContract.address)
    const lottery = await ethers.getContract("Lottery")
    // const lottery = await ethers.getContract("lottery")
    const checkData = ethers.keccak256(ethers.toUtf8Bytes(""))
    // console.log(checkData);
    
    const { upkeepNeeded } = await lottery.checkUpkeep.staticCall(checkData)
    
    if (upkeepNeeded) {
        const tx = await lottery.performUpkeep(checkData)
        // console.log(tx);
        
        const txReceipt = await tx.wait(1)
        // console.log(txReceipt);
        
        const requestId = txReceipt.logs[1].args.requestId
        console.log(`Performed upkeep with RequestId: ${requestId}`)
        if (devlopmentChain.includes(network.name)) {
            await mockVrf(requestId, lottery)
        }
    } else {
        console.log("No upkeep needed!")
    }
}
async function mockVrf(requestId, lottery) {
    console.log("We on a local network? Ok let's pretend...")
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2_5Mock")

    // const vrfContract=await deployments.get("VRFCoordinatorV2_5Mock")
    // const vrfCoordinatorV2Mock = await ethers.getContractAt(vrfContract.abi,vrfContract.address)
    console.log("add",lottery.target);    
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, lottery.target)
    console.log("Responded!")
    const recentWinner = await lottery.getResentWinner()
    console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
