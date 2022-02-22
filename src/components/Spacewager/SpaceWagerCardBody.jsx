import React, { useState, useEffect } from 'react'
import numeral from 'numeral';
import {useStore} from "../../store";
import PriceLoader from "../PriceLoader";
import {MsgExecuteContract} from "@terra-money/terra.js";

export default function SpaceWagerCardBody(props) {
    const { state, dispatch } = useStore()
    const {obj,price,variationStatus,formattedVariation,lockedPrice,prizesPool, isLivePrediction, isPastPrediction, isNextPrediction} = props;
    const [bidScreen, setBidScreen] = useState(false)
    const [bidType, setBidType] = useState('');
    const [amount,setAmount] = useState(0)
    const [ustBalance, setUstBalance] = useState(0)

    function svgShape(color, opacity) {
        return(
            <svg width="265" xmlns="http://www.w3.org/2000/svg" viewBox="24.3139 251 270.6231 68">

                <path d="M24.7723 266.366C20.5385 259.709 25.3209 251 33.2105 251H286.474C294.81 251 299.486 260.6 294.348 267.164L285.632 278.3C282.841 281.866 282.795 286.862 285.519 290.48L294.937 302.984C299.9 309.574 295.199 319 286.949 319H32.8434C25.0314 319 20.2361 310.444 24.3139 303.78L32.9501 289.668C34.9431 286.411 34.9077 282.304 32.8587 279.082L24.7723 266.366Z" fill={color} fillOpacity={opacity}/>

            </svg>
        )
    }

    function upTextColor() {
        if (bidType == 'UP') {
            return '#ffffff'
        } else {
            return '#17B96B'
        }

    }

    function downTextColor() {
        if (bidType == 'DOWN') {
            return '#ffffff'
        } else {
            return '#f038f0'
        }

    }

    function upButtonShape(){
        if (bidType == 'UP') {
            return svgShape('#17B96B', '1')
        } else {
            return svgShape('#6b6b6b', '0.37')
        }
    }

    function downButtonShape(){
        if (bidType == 'DOWN') {
            return svgShape('#f038f0', '1')
        } else {
            return svgShape('#6b6b6b', '0.37')
        }
    }

    const equalStyle = {
        opacity: '37%',
        borderColor: '#6B6B6B'
    }

    const downStyle = {
        background: '#f038f0',
        color: '#ffffff'
    }

    const upStyle = {
        background: '#17B96B',
        color: '#ffffff'
    }


    const equalStylePrice = {
        color: '#ffffff'
    }

    const downStylePrice = {
        color: '#f038f0'
    }

    const upStylePrice = {
        color: '#17B96B'
    }


    function upButtonShape(){
        return (
            <svg width="265" xmlns="http://www.w3.org/2000/svg" viewBox="24.3139 0 270.6231 68">

                <path d="M24.7723 15.3663C20.5385 8.70893 25.3209 0 33.2105 0H286.474C294.81 0 299.486 9.59954 294.348 16.1636L285.632 27.2997C282.841 30.8657 282.795 35.8623 285.519 39.4795L294.937 51.9838C299.9 58.5735 295.199 68 286.949 68H32.8434C25.0314 68 20.2361 59.4436 24.3139 52.7802L32.9501 38.6677C34.9431 35.4109 34.9077 31.3035 32.8587 28.0816L24.7723 15.3663Z" fill="#6B6B6B" fillOpacity="0.37"/>

            </svg>
        )
    }

    function downButtonShape(){
        return(
            <svg width="265" xmlns="http://www.w3.org/2000/svg" viewBox="24.3139 251 270.6231 68">

                <path d="M24.7723 266.366C20.5385 259.709 25.3209 251 33.2105 251H286.474C294.81 251 299.486 260.6 294.348 267.164L285.632 278.3C282.841 281.866 282.795 286.862 285.519 290.48L294.937 302.984C299.9 309.574 295.199 319 286.949 319H32.8434C25.0314 319 20.2361 310.444 24.3139 303.78L32.9501 289.668C34.9431 286.411 34.9077 282.304 32.8587 279.082L24.7723 266.366Z" fill="#6B6B6B" fillOpacity="0.37"/>
                <defs>
                    <linearGradient id="MyGradient">
                        <stop offset="0.37%" stopColor="#6B6B6B" />
                    </linearGradient>
                </defs>
            </svg>
        )
    }
    const makeBid = (type) => {
        setBidType(type);
        if(bidScreen == true){
            //Reset values for clean new bid
            setBidType('')
            setAmount(0)
        }
        setBidScreen(!bidScreen)
    }

    const makeBidFinal = (round) => {
        if(amount == 0 || amount == ''){
            alert('please fill a amount you want to bid')
            return;
        }
        alert('you bid on '+ bidType +': '+ amount + 'UST on round: '+round)
        //LOADING
        dispatch({ type: 'setIsUserMakingPrediction', message: true })
        //Set bidscreen false
        setBidScreen(false)

        if (amount <= 0) return

        let type = bidType == 'UP' ? true : false

        let msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.spaceWagerAddress,
            {
                make_prediction: {up :type}
            },
            { uusd: parseFloat(amount) * 1000000 },
        )
        state.wallet
            .post({
                msgs: [msg],
            })
            .then((e) => {
                if (e.success) {
                    alert('success!')
                } else {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e)

            })
    }

    function last_price(){
        if (isLivePrediction || isPastPrediction && obj[1].success == null){
            //dispatch({ type: 'setSpaceWagerLastPrice', message: price })
            return price
        }else{
            return obj[1].resolved_price / 1000000
        }
    }

    // function getUserBalance() {
    //     if (connectedWallet) {
    //         lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
    //             coins = coins;
    //             // console.log(coins ? coins.get('uusd').amount / 1000000 : '')
    //             const ustBalance = coins.get('uusd').toData()
    //
    //             setUstBalance(ustBalance.amount / 1000000)
    //             dispatch({ type: 'setUstBalance', message: ustBalance.amount / 1000000 })
    //         });
    //     } else {
    //         setUstBalance(null);
    //     }
    // }

    return (
 <>
         {
             //When not active round
             isPastPrediction && obj[1].success == null  &&
             <>
                 <p className="small">
                     This round’s closing transaction has been submitted to the blockchain, and is awaiting confirmation.
                 </p>
             </>
         }
        { 
        //When not active round
            (isPastPrediction || isLivePrediction) &&
        <>    
            
        <div className="row">            
            <div className="col-12 text-start">
                <p className="my-2 fs-6 mb-0">Last price:</p>
            </div>
            <div className="col-6 text-start">
                <p className="mb-0 fw-bold fs-3"
                    style={
                        variationStatus == 'DOWN' ? downStylePrice : upStylePrice
                    }
                >${numeral(last_price()).format('0,0.000')}</p>
            </div>
            <div className="col-6 text-end">
                <span
                    className="badge"
                    style={
                        variationStatus == 'DOWN' ? downStyle : upStyle
                    }
                >
                    <p className={'fw-bold fs-6 mb-0'}>{formattedVariation}</p>
                </span>
            </div>
        </div>
        
        <div className="row">
            <div className="col-6 text-start">
                <p className="my-2 fw-regular fs-6 mb-0">Locked Price:</p>                    
            </div>
            <div className="col-6 text-end">
                <p className="my-2 fw-bold fs-6 mb-0">${numeral(obj[1].locked_price / 1000000).format('0,0.000')}</p>
            </div>
        </div>
        
        <div className="row">
            <div className="col-6 text-start">
                <p className="my-2 fw-regular fs-6 mb-0">Prizes Pool:</p>
            </div>
            <div className="col-6 text-end">
                <p className="my-2 fw-bold fs-6 mb-0">{numeral((parseInt(obj[1]['up']) + parseInt(obj[1]['down']))/ 1_000_000 ).format('0,0.00')} {' '} UST</p>
            </div>
        </div>  
                    
        </>
    }
     {
      //When active round
      isNextPrediction &&
          <div>
              <button className="btn btn-green fw-bold w-100"
                      style={{borderBottomLeftRadius:0,borderBottomRightRadius:0}}
                      onClick={() => makeBid('UP')}
              >
                  {upButtonShape()}
                  <div className="btn-content" style={{color: upTextColor()}}>
                      UP
                      <span className="small fw-normal d-block">{state.latestPrediction.up == '0' && state.latestPrediction.down != '0' ? 1 : state.latestPrediction.up != '0' && state.latestPrediction.down == '0' || state.latestPrediction.up == '0' && state.latestPrediction.down == '0'? 0 : numeral(parseInt(state.latestPrediction.up) / parseInt(state.latestPrediction.down)).format("0,0.00")}x Payout</span>
                  </div>
              </button>

              {
                  bidScreen ? <div>
                          <div className="row">
                              <div className="col-6 text-start">
                                  <p className="fw-regular fs-6 mb-0">Commit:</p>
                              </div>
                              <div className="col-6 text-end">
                                  <p className={'fw-bold fs-6 mb-1'}>
                                      <img
                                          src="/UST-Logo.png"
                                          className="img-fluid terraLogoSmall"
                                      /> UST
                                  </p>
                              </div>
                          </div>
                          <input className="form-control" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                          <h6 className='mt-2 text-muted text-end'>
                              Balance: 0 UST
                          </h6>
                          <button onClick={() => makeBidFinal(obj[0]) } className="btn btn-plain w-100 mt-1">Enter {bidType}</button>
                          <h6 className='mt-2 text-muted'>
                              You won’t be able to remove or change your position once you enter it.
                          </h6>
                  </div>
                      :
                  <div className="row">
                      <div className="col-6 text-start">
                          <p className="my-2 fw-regular fs-6 mb-0">Prizes Pool:</p>
                      </div>
                      <div className="col-6 text-end">
                          {!state.isUserMakingPrediction && (
                              <p className="my-2 fw-bold fs-6 mb-0">{ numeral((parseInt(state.latestPrediction.up) + parseInt(state.latestPrediction.down))/ 1_000_000 ).format('0,0.00')} {' '} UST</p>)
                          || <div className="spinner-border text-light" role="status"><span className="sr-only"></span></div>
                          }
                      </div>
                  </div>
              }

                  <button className="btn btn-red w-100 fw-bold"
                          style={{borderTopLeftRadius:0,borderTopRightRadius:0}}
                          onClick={() => makeBid('DOWN')}
                  >
                      {downButtonShape()}
                      <div className="btn-content" style={{color: downTextColor()}}>
                          <span className="small d-block fw-normal">{state.latestPrediction.down == '0' && state.latestPrediction.up != '0' ? 1 : state.latestPrediction.down != '0' && state.latestPrediction.up == '0' || state.latestPrediction.down == '0' && state.latestPrediction.up == '0'? 0 : numeral(parseInt(state.latestPrediction.down) / parseInt(state.latestPrediction.up)).format("0,0.00") }x Payout</span>
                          DOWN
                      </div>
                  </button>
          </div>
    }
 </>
    )

}