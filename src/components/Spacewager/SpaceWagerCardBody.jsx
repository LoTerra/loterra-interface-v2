import React, { useState, useEffect } from 'react'
import numeral from 'numeral';
import {useStore} from "../../store";
import PriceLoader from "../PriceLoader";
import {MsgExecuteContract} from "@terra-money/terra.js";
import SpaceWagerInfoMessage from './SpaceWagerInfoMessage';
import { ArrowLeft } from 'phosphor-react';
let date = new Date()
date.setSeconds( date.getSeconds() + 20)
export default function SpaceWagerCardBody(props) {
    const { state, dispatch } = useStore()
    const {obj,price, currentTimeRound, counterOneMinute, variationStatus,formattedVariation,lockedPrice,prizesPool, isLivePrediction, isPastPrediction, isNextPrediction} = props;
    const [bidScreen, setBidScreen] = useState(false)
    const [bidType, setBidType] = useState('');
    const [amount,setAmount] = useState(0)
    const [ustBalance, setUstBalance] = useState(0)
    const [currentTime, setCurrentTime] = useState(new Date().setSeconds(new Date().getSeconds() + 60))




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

    const makeBid = (type) => {
        setBidType(type);
        if(bidScreen == true || type == null){
            //Reset values for clean new bid
            setBidType('')
            setAmount(0)
        }
        setBidScreen(!bidScreen)
    }

    const makeBidFinal = (round) => {
        if(amount == 0 || amount == ''){
            return;
        }
        //alert('you bid on '+ bidType +': '+ amount + 'UST on round: '+round)
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
                    //alert('success!')
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

    function remainingTime() {
        let timeBetween = currentTimeRound * 1000 - Date.now()
        const seconds = Math.floor((timeBetween / 1000))
        const minutes = Math.floor((timeBetween / 1000 / 60) % 60)
        let remainingTime = (parseInt(minutes) / 60) + seconds

        let percentage = ((parseInt(remainingTime) * 100) / 300)

        return percentage
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
            <SpaceWagerInfoMessage>
                     This round’s closing transaction has been submitted to the blockchain, and is awaiting confirmation.
             </SpaceWagerInfoMessage>
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
                        variationStatus == 'DOWN' ? downStylePrice : variationStatus == 'UP' ? upStylePrice : {color:'#fff'}
                    }
                >${numeral(last_price()).format('0,0.000')}</p>
            </div>
            <div className="col-6 text-end">
                <span
                    className="badge"
                    style={
                        variationStatus == 'DOWN' ? downStyle : variationStatus == 'UP' ? upStyle : {background:'rgb(51 42 77)'}
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
              {
                  bidScreen ? <div>
                          <div className="row">
                              <div className="col-12">
                                  <button className={'btn btn-secondary float-start p-1 px-2'} onClick={() => makeBid()}>
                                        <ArrowLeft size={'18'} /> 
                                  </button>
                              </div>
                              <div className="col-6 text-start">
                                  <p className="fw-regular fs-6 mb-0 mt-2">Commit:</p>
                              </div>                              
                          </div>
                          <div className="input-group">
                          <span className="input-group-text" id="basic-addon1">
                            <img
                                src="/UST.svg"
                                width="30px"
                                className="img-fluid"
                            />
                        </span>
                        <input className="form-control" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                          </div>
                          
                          <h6 className='mt-2 text-muted text-end small'>
                              Balance: 0 UST
                          </h6>
                          { state.wallet && state.wallet.hasOwnProperty('walletAddress') &&
                            <button onClick={() => makeBidFinal(obj[0]) } className={"btn w-100 mt-1" + (bidType == 'UP' ? ' btn-up' : ' btn-down')}>Enter {bidType}</button>
                          }
                          { state.wallet && !state.wallet.hasOwnProperty('walletAddress') &&
                            <button className={"btn w-100 mt-1" + (bidType == 'UP' ? ' btn-up' : ' btn-down')}>Connect wallet</button>
                          }
                          <SpaceWagerInfoMessage>
                              You won’t be able to remove or change your position once you enter it.
                          </SpaceWagerInfoMessage>
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
                      <div className="col-12 mt-2">
                        <div className="progress">
                                <div
                                    className='progress-bar'
                                    color='#000000'
                                    value={remainingTime()}
                                    max={100}
                                    style={{width: remainingTime()+'%'}}
                                >
                                </div>
                            </div>
                      </div>
                      
                      <div className="col-12 my-3">
                          <button className="btn btn-up btn-lg mb-2" onClick={() => makeBid('UP')}>Enter UP</button>
                          <button className="btn btn-down btn-lg" onClick={() => makeBid('DOWN')}>Enter DOWN</button>
                      </div>
                  </div>
              }
          </div>
    }
 </>
    )

}