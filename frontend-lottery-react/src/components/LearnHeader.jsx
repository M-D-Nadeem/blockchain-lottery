import { useEffect } from "react"
import { useMoralis } from "react-moralis"
function LearnHeader(){
    //enableWeb3->Use to connect with an account,pops up metamask and makes isWeb3Enabled true
    //isWeb3Enabled->Detect weather er are connected(true) or not(false)
    //isWeb3EnableLoading->Detect weather there is metamask open on screen
    //deactivateWeb3->makes isWeb3Enabled false
    const {enableWeb3,isWeb3Enabled,isWeb3EnableLoading,account,Moralis,deactivateWeb3}=useMoralis()
    
    //1st time screen is loaded nothing happens,then we click on connect all logic under
    //onClick works, but when we refresh the page then useEffect is called
    useEffect(()=>{
        if(!isWeb3Enabled && typeof  window!=undefined && window.localStorage.getItem("Connected")){
            enableWeb3()
        }
    },[isWeb3Enabled])
    //This useEffect is called when we change our account or disconnect our account
    useEffect(()=>{
        Moralis.onAccountChanged((acc)=>{
            console.log("Account is changed to ",acc);
            if(acc==null){
                console.log("No accunt connected");
                
                deactivateWeb3()
            }
            
        })
    })
    return(
        
          account?(
            <div>
                Connected to {account.slice(0,6)}....{account.slice(account.length-1,account.length-4)}
            </div>
          ):(
            <button onClick={async ()=>{
                const ret=await enableWeb3()
                if(typeof ret!=undefined){
                     if(typeof window!=undefined){
                        window.localStorage.setItem("Connected","Injected")
                     }
                }
            }}
            disabled={isWeb3EnableLoading}
            >
                   Connect
            </button>
          )
        
    )
}
export default LearnHeader