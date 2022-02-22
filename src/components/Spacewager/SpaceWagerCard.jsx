import React, { useEffect,useState } from 'react'
import numeral from 'numeral';
import { ThermometerSimple, ArrowUp, ArrowDown } from 'phosphor-react';
import SpaceWagerCardHeader from './SpaceWagerCardHeader';
import { LCDClient, MsgExecuteContract, WasmAPI } from '@terra-money/terra.js';
import { useStore } from '../../store';
import SpaceWagerCardBody from './SpaceWagerCardBody';
import { registerables } from 'chart.js';


export default function SpaceWagerCard(props) {

    const [variationStatus, setVariationStatus] = useState('')

    const {
        id,
        obj,
        dataLength,
        roundAmount,
        currentTimeRound, 
        bettingOddsOnUp, 
        price, 
        variation,
        lockedPrice, 
        prizesPool, 
        bettingOddsOnDown, 
        click,
        isLivePrediction,
        isNextPrediction,
        isPastPrediction
    } = props;

    const {state,dispatch} = useStore()

    const [amount,setAmount] = useState(0)
    const [bidType, setBidType] = useState('');
    const [bidScreen, setBidScreen] = useState(false)
    const [formattedVariation, setFormattedVariation] = useState(0)
    const [personalBidInfo, setPersonalBidInfo] = useState()

    //Testnet settings now api

    const api = new WasmAPI(state.lcd_client.apiRequester)

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

    const equalStyle = {
        opacity: '37%',
        borderColor: '#6B6B6B'
    }

    const downStyle = {
        borderColor: '#f038f0'
    }

    const upStyle = {
        borderColor: '#18ab64'
    }

    const getVariation = async (lockedPrice, currentPrice) => {

        try {
            let variation = 0.000
            if (currentPrice != 0) {
                if (lockedPrice > currentPrice) {
                    variation = (currentPrice - lockedPrice) / 1_000_000
                } else if (lockedPrice < currentPrice){
                    variation = (currentPrice - lockedPrice) / 1_000_000
                } else {
                    variation = 0.000
                }
            }

            if (variation != 0) {
                if (variation > 0) {
                    setFormattedVariation('⬆ $' + numeral(variation).format('0,0.000'))
                    setVariationStatus('UP')
                } else if (variation < 0) {
                    setFormattedVariation('⬇ $' + numeral(variation).format('0,0.000'))
                    setVariationStatus('DOWN')
                    //console.log('down')
                }     
            } else {
                setFormattedVariation('$' + numeral(variation).format('0,0.000'))
                setVariationStatus('EQUAL')
                //console.log('equal')
            }
            return 
        } catch(e){
            console.log(e)
        }
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

    // const getPersonalBids = async (round) => {
    //     try {
    //         let personal_bid_info = await api.contractQuery(
    //             state.spaceWagerAddress,
    //             {
    //                 game: {
    //                    address:state.wallet.walletAddress,
    //                    round: round
    //                 }
    //             }
    //         );
    //         console.log('getPersonalBids',personal_bid_info)
    //         setPersonalBidInfo(personal_bid_info)
    //     } catch(e) {
    //         console.log(e)
    //     }
    // }

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

    // function getVariationRatio(lockedPrice, currentPrice) {
    //     let variation = 0.000
    //     if (lockedPrice != 0) {
    //         if (lockedPrice > currentPrice) {
    //             variation = (currentPrice - lockedPrice) / 1_000_000
    //         } else if (lockedPrice < currentPrice){
    //             variation = (currentPrice - lockedPrice) / 1_000_000
    //         } else {
    //             variation = 0.000
    //         }
    //     }
    //
    //     return variation
    // }

    // useEffect(() => {
    //     if(state.wallet && obj[0]){
    //         getPersonalBids(obj[0])
    //     }
    // },[isLivePrediction, isPastPrediction, isNextPrediction])

    //Load on mount
    useEffect(() =>  {

        if (obj[1].resolved_price != "0"){
            getVariation(obj[1].locked_price, obj[1].resolved_price)
        }else{
            getVariation(obj[1].locked_price, state.spaceWagerLastPrice * 1000000)
        }

        },[state.spaceWagerLastPrice])

    return (
       <div className="col-9 mx-auto">
            <div className={"card spacewager-card h-100 "+(obj.active ? ' active' : '')}
                style={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20
                }}
            >                
                <SpaceWagerCardHeader obj={obj} currentTimeRound={currentTimeRound} isLivePrediction={isLivePrediction} isNextPrediction={isNextPrediction} isPastPrediction={isPastPrediction}/>

                <div className="card-body">
                { 
                    //Only show button when live
                    isNextPrediction &&
                    <button className="btn btn-green fw-bold w-100"
                        style={{borderBottomLeftRadius:0,borderBottomRightRadius:0}}
                        onClick={() => makeBid('UP')}>
                            {upButtonShape()}
                        <div className="btn-content">
                            UP

                            <span className="small fw-normal d-block">{state.latestPrediction.up == '0' && state.latestPrediction.down != '0' ? 1 : state.latestPrediction.up != '0' && state.latestPrediction.down == '0' || state.latestPrediction.up == '0' && state.latestPrediction.down == '0'? 0 : numeral(parseInt(state.latestPrediction.up) / parseInt(state.latestPrediction.down)).format("0,0.00")}x Payout</span>
                        </div>
                    </button>
                }
                    <div className="card-content" 
                        style={
                            variationStatus == 'DOWN' ? downStyle : upStyle
                        }
                    >
                    { !bidScreen &&
                        <SpaceWagerCardBody 
                        obj={obj}
                        price={price}
                        variationStatus={variationStatus}
                        formattedVariation={formattedVariation}
                        lockedPrice={lockedPrice}
                        prizesPool={prizesPool}
                        isLivePrediction = {isLivePrediction}
                        isPastPrediction = {isPastPrediction}
                        isNextPrediction = {isNextPrediction}
                        />
                    }
                    { bidScreen &&
                        <>
                            <div className="row">
                                <div className="col-6 text-start">
                                    <p className="fw-regular fs-6 mb-0">Commit:</p>                    
                                </div>
                                <div className="col-6 text-end">
                                    
                                    <p className={'fw-bold fs-6 mb-1'}>
                                    <img
                                        src="/terra-luna-Logo.png"
                                        className="img-fluid terraLogoSmall"
                                    /> LUNA
                                    </p>
                                </div>
                            </div>
                            <input className="form-control" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                            <button onClick={() => makeBidFinal(obj[0]) } className="btn btn-plain w-100 mt-3">Enter {bidType}</button>
                            <h6 className='mt-2 text-muted'>
                                You won’t be able to remove or change your position once you enter it.
                            </h6>
                        </>
                    }
                    </div>
                    { 
                    //Only show button when live
                    isNextPrediction &&
                        <button className="btn btn-red w-100 fw-bold"
                        style={{borderTopLeftRadius:0,borderTopRightRadius:0}}
                        onClick={() => makeBid('DOWN')}>
                            {downButtonShape()}
                            <div className="btn-content">
                                <span className="small d-block fw-normal">{state.latestPrediction.down == '0' && state.latestPrediction.up != '0' ? 1 : state.latestPrediction.down != '0' && state.latestPrediction.up == '0' || state.latestPrediction.down == '0' && state.latestPrediction.up == '0'? 0 : numeral(parseInt(state.latestPrediction.down) / parseInt(state.latestPrediction.up)).format("0,0.00") }x Payout</span>
                                DOWN
                            </div>
                        </button>
                    }
                </div>
                    {/*<div className="card-footer p-0">          */}
                    {/*    { personalBidInfo && (parseInt(personalBidInfo.up) > 0 || parseInt(personalBidInfo.down) > 0) &&*/}
                    {/*        <div className="row">*/}
                    {/*            <div className="col-12 text-center">*/}
                    {/*                <p className="text-center">Your stats</p>*/}
                    {/*            </div>*/}
                    {/*            <div className="col-md-6">*/}
                    {/*                <strong>UP VOTE</strong>*/}
                    {/*                <p>{numeral(personalBidInfo.up / 1000000).format('0,0.000') }</p>                              */}
                    {/*            </div>*/}
                    {/*            <div className="col-md-6">*/}
                    {/*                <strong>DOWN VOTE</strong>*/}
                    {/*                <p>{numeral(personalBidInfo.down / 1000000).format('0,0.000') }</p>  */}
                    {/*            </div>*/}
                    {/*            { obj[1].success && obj[1].is_up && parseInt(personalBidInfo.up) > 0 &&*/}
                    {/*                <div className="col-12">*/}
                    {/*                    <p>YOU WON WITH UP</p>*/}
                    {/*                    <button className="btn btn-plain">Collect prize</button>*/}
                    {/*                </div>*/}
                    {/*            }*/}
                    {/*            { obj[1].success && !obj[1].is_up && parseInt(personalBidInfo.down) > 0 &&*/}
                    {/*                <div className="col-12">*/}
                    {/*                <p>YOU WON WITH DOWN</p>*/}
                    {/*                <button className="btn btn-plain">Collect prize</button>*/}
                    {/*            </div>*/}
                    {/*            }*/}
                    {/*        </div>          */}
                    {/*    }*/}
                    {/*</div>*/}
                </div>
       </div>
    )
}