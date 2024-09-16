import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";
import abi from "../constant/abi.json";
import contractAddress from "../constant/contractAddress.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

function EnterLottery() {
    const cId = useMoralis().chainId;
    const { isWeb3Enabled } = useMoralis();
    const [enterenceFee, setEntrenceFee] = useState("");
    const [numPlayer, setnumPlayer] = useState("");
    const [recentWinner, setRecentWinner] = useState("");
    const dispatch = useNotification();
    const chainId = parseInt(cId);
    const lotteryAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;

    const { runContractFunction: getEnterenceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEnterenceFee",
        params: {}
    });
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {}
    });
    const { runContractFunction: getResentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getResentWinner",
        params: {}
    });
    const { runContractFunction: enterLottery } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        params: {},
        functionName: "enterLottery",
        msgValue: enterenceFee
    });

    async function get() {
        const entranceFeeFromCall = (await getEnterenceFee()).toString();
        const numPlayersFromCall = (await getNumberOfPlayers()).toString();
        const recentWinnerFromCall = await getResentWinner();
        console.log(recentWinnerFromCall);
        
        setEntrenceFee(entranceFeeFromCall);
        setnumPlayer(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            get();
        }
    }, [isWeb3Enabled,getResentWinner,enterLottery]);

    async function handelSucess(tx) {
        await tx.wait(1);
        get();
        dispatch({
            type: "info",
            message: "Transaction complete",
            title: "Tx notification",
            position: "topR",
            icon: "bell",
        });
    }
    
    

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {lotteryAddress ? (
                <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500 ease-in-out">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                        Enter the Lottery
                    </h2>
                    <button
                        onClick={async () => {
                            await enterLottery({
                                onSuccess: handelSucess,
                                onError: (err) => console.log(err),
                            });
                        }}
                        className="w-full py-3 text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-lg"
                    >
                        Enter Lottery
                    </button>
                    <div className="text-center mt-4 text-lg">
                        <div className="animate-bounce text-blue-600 font-semibold">
                            Entrance Fee: {enterenceFee} ETH
                        </div>
                        <div className="mt-2 text-pink-600 font-semibold">
                            Number of Players: {numPlayer}
                        </div>
                        <div className="mt-2 text-green-600 font-semibold">
                            Recent Winner: {recentWinner}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-2xl text-white font-bold">
                    No Lottery Address Detected
                </div>
            )}
        </div>
    );
}

export default EnterLottery;
