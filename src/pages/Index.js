import React, {useState} from "react";
import { useConnectedWallet } from '@terra-money/wallet-provider'
// import Jackpot from "../components/Jackpot";
import {StdFee, MsgExecuteContract, } from "@terra-money/terra.js"
const HomeCard={
    marginTop: '50px',
    width: '100px',
    padding: '30px',
}
export default function Index () {
    const [combo, setCombo] = useState("")
    const connectedWallet = useConnectedWallet()

    function execute(){
        const cart = combo.split(" ")
        const obj = new StdFee(10_000_000, { uusd: 2000000 })
        const msg = new MsgExecuteContract(
            connectedWallet.walletAddress,
            "terra1zcf0d95z02u2r923sgupp28mqrdwmt930gn8x5",
            {
                register: {
                    combination: cart,
                },
            },
            { uusd: 1_000_000 }
        )

        connectedWallet.post({
            msgs: [msg],
            gasPrices: obj.gasPrices(),
            gasAdjustment: 1.1,
        })

    }
    function change(e) {
        e.preventDefault();
        setCombo(e.target.value)
        console.log(combo.split(" "))
    }

     return (
         <div>
             <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
                 <div className="text-3xl">LoTerra</div>
                 <div> contract-v2</div>
                 <div>address: terra1zcf0d95z02u2r923sgupp28mqrdwmt930gn8x5</div>
                 <textarea placeholder="123456 abcdef 1abce2..." style={{width: "300px", height:"300px", marginBottom:"20px", padding:"10px"}} className="card-glass" type="text" value={combo} onChange={(e) => change(e)}  />
                 <div className="text-sm">hint: Enter ticket number from [0-9][a-f] max 6 symbols and spaced</div>
                 <button onClick={()=> execute()} className="button-glass" style={{color:"deeppink"}}>Buy ticket</button>
             </div>
         </div>

     );
}
