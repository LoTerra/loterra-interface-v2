import React, {useState, useEffect, useRef} from 'react'
import numeral from 'numeral';
import {useStore} from "../../store";
import PriceLoader from "../PriceLoader";
import {MsgExecuteContract} from "@terra-money/terra.js";
import SpaceWagerInfoMessage from './SpaceWagerInfoMessage';
import { ArrowLeft, TrendDown, TrendUp } from 'phosphor-react';
import toast, { Toaster } from 'react-hot-toast';
import CountUp from 'react-countup';


function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export default function SpaceWagerCardBody(props) {
    const { state, dispatch } = useStore()
    const {obj,price, currentTimeRound, counterOneMinute, variationStatus,formattedVariation,lockedPrice,prizesPool, isLivePrediction, isPastPrediction, isNextPrediction , bettingOddsOnDown, bettingOddsOnUp} = props;
    const [bidScreen, setBidScreen] = useState(false)
    const [bidType, setBidType] = useState('');
    const [amount,setAmount] = useState(0)
    const [ustBalance, setUstBalance] = useState(0)
    const [currentTime, setCurrentTime] = useState(new Date().setSeconds(new Date().getSeconds() + 60))
    const [lastPrice, setLastPrice] = useState(0)
    const [lastPricePart1, setLastPricePart1] = useState(0)
    const [lastPricePart2, setLastPricePart2] = useState(0)
    let prevLastPricePart1 = usePrevious(lastPricePart1)
    let prevLastPricePart2 = usePrevious(lastPricePart2)

    //const [personalBidInfo, setPersonalBidInfo] = useState()


    const payoutUpStyle = {
        color:'rgb(23, 185, 107)',
        background:'linear-gradient(45deg, #17b96b4d, transparent)',
        color:'#fff'
    }

    const payoutDownStyle = {
        color:'#f038f0',
        background:'linear-gradient(45deg, #f13af126, transparent)',
        color:'#fff'
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
            toast.error('please fill a amount to bid')
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
                    toast.success('Bid succesfull!')
                } else {
                    toast.error('Something went wrong, please try again')
                    console.log(e)
                }
            })
            .catch((e) => {
                dispatch({ type: 'setIsUserMakingPrediction', message: false })
                console.log(e)

            })
    }

    function format_number(number, sizeOne, sizeTwo){
        let split_variation = numeral(number).format("0,0.000000").split('.');
        let format_variation = split_variation.length == 1 ? <>{split_variation[0]}<span style={{fontSize: sizeOne}}>.000000</span></>  : <>{split_variation[0]}<span style={{fontSize: sizeTwo}}>.{split_variation[1]}</span></>
        return format_variation
    }

    function format_last_price(number){
        let split_variation = numeral(number).format("0,0.000000").split('.');

        return {lastPricePart1: split_variation[0], lastPricePart2: split_variation.length == 1 ? '000000' :split_variation[1]}
    }
    function last_price(){
        if (isLivePrediction || isPastPrediction && obj.success == null){
            //dispatch({ type: 'setSpaceWagerLastPrice', message: price })

            if (isPastPrediction){
                setLastPrice(price)
            }else {
                let {lastPricePart1, lastPricePart2} = format_last_price(price)
                console.log(lastPricePart1)
                console.log(lastPricePart2)
                setLastPricePart1(lastPricePart1)
                setLastPricePart2(lastPricePart2)
            }

        }else{
            setLastPrice(obj.resolved_price / 1000000)
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


    useEffect(() => {
        last_price()
    }, [isLivePrediction, isNextPrediction, isPastPrediction, price, obj.resolved_price])
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
    // useEffect(() => {
    //
    // }, [ isLivePrediction, isNextPrediction, isPastPrediction])

    // useEffect(() => {
    //     if(state.wallet && obj[0]){
    //         getPersonalBids(obj[0])
    //     }
    // },[isLivePrediction, isPastPrediction, isNextPrediction])
    // useEffect(()=>{
    //     setPrevLastPrice(lastPrice)
    // }, [lastPrice])

    return (
 <>

         {
             //When not active round
             isPastPrediction && obj.success == null  &&
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
                <p className="my-1 mb-0 small text-muted">Last price</p>
            </div>
            <div className="col-6 text-start">
                <p className="mb-0 fw-bold fs-3"
                    style={
                        variationStatus == 'DOWN' ? downStylePrice : variationStatus == 'UP' ? upStylePrice : {color:'#fff'}
                    }
                >${isPastPrediction ? format_number(lastPrice, '0.5em', '0.5em') : <><CountUp start={prevLastPricePart1} end={lastPricePart1}/><CountUp prefix="." style={{fontSize: '0.5em'}} start={prevLastPricePart2} end={lastPricePart2}/> </>}
                </p>
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
                <p className="my-1 fw-regular small mb-0">Locked Price:</p>                    
            </div>
            <div className="col-6 text-end">
                <p className="my-1 fw-regular small mb-0">
                    ${format_number(obj.locked_price / 1000000, '0.8em', '0.8em')}</p>
            </div>
        </div>
        
        <div className="row">
            <div className="col-6 text-start">
                <p className="mb-2 fw-bold fs-6 mb-0">Prize Pool:</p>
            </div>
            <div className="col-6 text-end">
                <p className="mb-2 fw-bold fs-6 mb-0">{numeral((parseInt(obj['up']) + parseInt(obj['down']))/ 1_000_000 ).format('0,0.00')} {' '} UST</p>
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
                          <div className="row" >
                              <div className="col-12">
                                  <button className={'btn btn-secondary float-start p-1 px-2'} style={{position:'absolute',top:'78px',left:'25px',background:'#1f085e'}} onClick={() => makeBid()}>
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
                          
                          { state.wallet && state.wallet.hasOwnProperty('walletAddress') &&
                          <h6 className='mt-2 text-muted text-end small'>
                              Balance: <span onClick={() => setAmount(state.ustBalance)} style={{textDecoration:'underline'}}>{numeral(state.ustBalance).format('0,0.00')} UST</span>
                          </h6>
                          }
                          { state.wallet && state.wallet.hasOwnProperty('walletAddress') &&
                            <button onClick={() => makeBidFinal(obj.prediction_id) } className={"btn w-100 mt-1" + (bidType == 'UP' ? ' btn-up' : ' btn-down')}>Enter {bidType}</button>
                          }
                          { state.wallet && !state.wallet.hasOwnProperty('walletAddress') &&
                            <button className={"btn w-100 mt-1" + (bidType == 'UP' ? ' btn-up' : ' btn-down')} onClick={() => toast.error('Please connect your wallet')}>Connect wallet</button>
                          }
                          <SpaceWagerInfoMessage>
                              You won’t be able to remove or change your position once you enter it.
                          </SpaceWagerInfoMessage>
                  </div>
                      :
                  <div className="row">
                           <div className="col-6 text-start">
                          <p className="my-2 fw-bold fs-6 mb-0">Prize Pool:</p>
                      </div>
                      <div className="col-6 text-end mb-2">
                          {!state.isUserMakingPrediction && (
                              <p className="my-2 fw-bold fs-6 mb-0"><CountUp end={(parseInt(state.latestPrediction.up) + parseInt(state.latestPrediction.down))/ 1_000_000 } decimals={2}/> {' '} UST</p>)
                          || <div className="spinner-border text-light" role="status"><span className="sr-only"></span></div>
                          }  
                      </div>
                      <div className="col-12 mt-2">
                        {/* <div className="progress">
                                <div
                                    className='progress-bar'
                                    color='#000000'
                                    value={remainingTime()}
                                    max={100}
                                    style={{width: remainingTime()+'%'}}
                                >
                                </div>
                            </div> */}
                      </div>
                      
                      <div className="col-12 my-3">
                          <h3 className="fs-6 text-muted fw-bold mb-1">Your Prediction</h3>
                          <div className="row">
                   
                              <div className="col-6">
                                <button className="btn btn-up" onClick={() => makeBid('UP')}><TrendUp size={18} style={{marginRight:'3px'}}/>
                                UP
                                <span className="small fw-normal d-block" style={{fontSize:'12px'}}>
                                <span className="fw-bold">
                                {
                                    isNextPrediction ?

                                        state.latestPrediction.up == '0' && state.latestPrediction.down != '0' ? '1.00' : state.latestPrediction.up != '0' && state.latestPrediction.down == '0' || state.latestPrediction.up == '0' && state.latestPrediction.down == '0'? '0.00' : numeral((parseInt(state.latestPrediction.down) + parseInt(state.latestPrediction.up)) / parseInt(state.latestPrediction.up)).format("0,0.00")
                                        : bettingOddsOnUp == '0' && bettingOddsOnDown != '0' ? '1.00' : bettingOddsOnUp != '0' && bettingOddsOnDown == '0' || bettingOddsOnUp == '0' && bettingOddsOnDown == '0'? '0.00' : numeral((parseInt(bettingOddsOnDown) +  parseInt(bettingOddsOnUp)) / parseInt(bettingOddsOnUp)).format("0,0.00")
                                }x
                                </span> Payout
                                 

                            </span>
                                </button>
                              </div>
                              <div className="col-6">
                                <button className="btn btn-down" onClick={() => makeBid('DOWN')}><TrendDown size={18} style={{marginRight:'3px'}} />
                                DOWN
                                <span className="small d-block fw-normal" style={{fontSize:'12px'}}>
                                <span className="fw-bold">{
                                    isNextPrediction ?
                                        state.latestPrediction.down == '0' && state.latestPrediction.up != '0' ? '1.00' : state.latestPrediction.down != '0' && state.latestPrediction.up == '0' || state.latestPrediction.down == '0' && state.latestPrediction.up == '0'? '0.00' : numeral((parseInt(state.latestPrediction.up) + parseInt(state.latestPrediction.down)) / parseInt(state.latestPrediction.down)).format("0,0.00")
                                        : bettingOddsOnDown  == '0' && bettingOddsOnUp != '0' ? '1.00' : bettingOddsOnDown != '0' && bettingOddsOnUp == "0" || bettingOddsOnDown == '0' && bettingOddsOnUp == '0'? '0.00' : numeral((parseInt(bettingOddsOnUp) + parseInt(bettingOddsOnDown)) / parseInt(bettingOddsOnDown)).format("0,0.00")

                                }x</span> Payout
                            </span>
                                </button>
                              </div>                         
                          </div>
                      </div>
                  </div>
              }

              
            
          </div>
    }
                { isLivePrediction &&
                  <div className="col-12 my-3">              
                  <div className="row">
                      <div className="col-6 rounded py-2"
                      style={
                       variationStatus == 'UP' ? payoutUpStyle : {opacity:0.5}
                        }
                      >
                       
                        UP
                        <span className="small fw-normal d-block" style={{fontSize:'12px'}}>
                        <span className="fw-bold">
                        {bettingOddsOnUp == '0' && bettingOddsOnDown != '0' ? '1.00' : bettingOddsOnUp != '0' && bettingOddsOnDown == '0' || bettingOddsOnUp == '0' && bettingOddsOnDown == '0'? '0.00' : numeral((parseInt(bettingOddsOnDown) +  parseInt(bettingOddsOnUp)) / parseInt(bettingOddsOnUp)).format("0,0.00")                        }x
                        </span> Payout
                         

                    </span>
                      
                      </div>
                      <div className="col-6 rounded py-2"
                      style={
                        variationStatus == 'DOWN' ? payoutDownStyle : {opacity:0.5}
                        }
                      >
                       DOWN
                        <span className="small d-block fw-normal" style={{fontSize:'12px'}}>
                        <span className="fw-bold">{bettingOddsOnDown  == '0' && bettingOddsOnUp != '0' ? '1.00' : bettingOddsOnDown != '0' && bettingOddsOnUp == "0" || bettingOddsOnDown == '0' && bettingOddsOnUp == '0'? '0.00' : numeral((parseInt(bettingOddsOnUp) + parseInt(bettingOddsOnDown)) / parseInt(bettingOddsOnDown)).format("0,0.00")}
                        x</span> Payout
                    </span>
                       
                      </div>                         
                  </div>
              </div>

              }
 </>
    )

}