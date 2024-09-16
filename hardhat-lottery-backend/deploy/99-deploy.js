const {deployments,ethers, network}=require("hardhat")
const fs=require("fs")
const FRONTEND_ADDRESS_FILE="../frontend-lottery-react/src/constant/contractAddress.json"
const FRONTEND_ABI_FILE="../frontend-lottery-react/src/constant/abi.json"
const chainId=network.config.chainId;
async function updateFrontend(){
    if(process.env.UPDATE_FRONTEND){
        console.log("Updating frontend");
        updateContractAddress()
        updateAbi()
        console.log("Update complete");
        
    }
}
async function updateContractAddress() {
    const lotterContract=await deployments.get("Lottery")
     //NOTE= we should initially have a JSON object ->{} in our contractAddress.json and 
    //abi.json so thet it can be detected by JSON.parse
    const currentAddress=JSON.parse(fs.readFileSync(FRONTEND_ADDRESS_FILE,"utf-8"))
    //updating the currentAddress,chainId is there but currentAddress associated to it is diff
    if(chainId in currentAddress){
        if(!currentAddress[chainId].includes(lotterContract.address)){
            currentAddress[chainId].push(lotterContract.address)
        }
    }
    //creaitnng new id and adding address in form of array
    else{
           currentAddress[chainId]=[lotterContract.address]
    }
    fs.writeFileSync(FRONTEND_ADDRESS_FILE,JSON.stringify(currentAddress))
    
}
async function updateAbi(){
    const lotterContract=await deployments.get("Lottery")
    fs.writeFileSync(FRONTEND_ABI_FILE,JSON.stringify(lotterContract.abi));
}
module.exports=updateFrontend
module.exports.tags=["all","frontend"]


//DO-> npx hardhat node