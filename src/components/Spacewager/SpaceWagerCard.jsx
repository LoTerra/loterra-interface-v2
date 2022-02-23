import React, { useEffect,useState } from 'react'
import numeral from 'numeral';
import { ThermometerSimple, ArrowUp, ArrowDown } from 'phosphor-react';
import SpaceWagerCardHeader from './SpaceWagerCardHeader';
import SpaceWagerCardBody from './SpaceWagerCardBody';
import { LCDClient, MsgExecuteContract, WasmAPI } from '@terra-money/terra.js';
import { useStore } from '../../store';


export default function SpaceWagerCard(props) {

    const [variationStatus, setVariationStatus] = useState('')

    const {
        id,
        obj,
        dataLength,
        roundAmount,
        currentTimeRound, 

        price, 
        variation,
        lockedPrice, 
        prizesPool, 

        click,
        isLivePrediction,
        isNextPrediction,
        isPastPrediction,
        bettingOddsOnUp,
        bettingOddsOnDown
    } = props;

    const {state,dispatch} = useStore()


    const [formattedVariation, setFormattedVariation] = useState(0)
    const [personalBidInfo, setPersonalBidInfo] = useState()


    //Testnet settings now api

    const api = new WasmAPI(state.lcd_client.apiRequester)

    const downStyle = {
        borderColor: '#f038f0'
    }

    const upStyle = {
        borderColor: '#17B96B'
    }

    function svgShape(color, opacity) {
        return(
            <svg width="265" xmlns="http://www.w3.org/2000/svg" viewBox="24.3139 251 270.6231 68">

                <path d="M24.7723 266.366C20.5385 259.709 25.3209 251 33.2105 251H286.474C294.81 251 299.486 260.6 294.348 267.164L285.632 278.3C282.841 281.866 282.795 286.862 285.519 290.48L294.937 302.984C299.9 309.574 295.199 319 286.949 319H32.8434C25.0314 319 20.2361 310.444 24.3139 303.78L32.9501 289.668C34.9431 286.411 34.9077 282.304 32.8587 279.082L24.7723 266.366Z" fill={color} fillOpacity={opacity}/>

            </svg>
        )
    }

    function upTextColor() {
        if (variationStatus == 'UP' && !isNextPrediction) {
            return '#ffffff'
        } else {
            return '#17B96B'
        }
    }

    function downTextColor() {
        if (variationStatus == 'DOWN' && !isNextPrediction) {
            return '#ffffff'
        } else {
            return '#f038f0'
        }

    }

    function upButtonShape(){
        if (variationStatus == 'UP' && !isNextPrediction) {
            return svgShape('#17B96B', '1')
        } else {
            return svgShape('#6b6b6b', '0.37')
        }
    }

    function downButtonShape(){
        if (variationStatus == 'DOWN' && !isNextPrediction) {
            return svgShape('#f038f0', '1')
        } else {
            return svgShape('#6b6b6b', '0.37')
        }
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
       <div className="col-10 col-md-9 mx-auto">
            <div className={"card spacewager-card h-100 "+(isPastPrediction && obj[1].success != null ? ' finished' : '')}
                style={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20
                }}
            >    
                <SpaceWagerCardHeader obj={obj} currentTimeRound={currentTimeRound} isLivePrediction={isLivePrediction} isNextPrediction={isNextPrediction} isPastPrediction={isPastPrediction}/> 

                <div className="card-body">
                    
                        <div className="btn-green fw-bold w-100"
                        style={{borderBottomLeftRadius:0,borderBottomRightRadius:0}}
                    >
                        {upButtonShape()}
                        <div className="btn-content" style={{ color: upTextColor()}}>
                            UP
                            <span className="small fw-normal d-block">
                                {
                                    isNextPrediction ?
                                        state.latestPrediction.up == '0' && state.latestPrediction.down != '0' ? 1 : state.latestPrediction.up != '0' && state.latestPrediction.down == '0' || state.latestPrediction.up == '0' && state.latestPrediction.down == '0'? 0 : numeral(parseInt(state.latestPrediction.up) / parseInt(state.latestPrediction.down)).format("0,0.00")
                                        : bettingOddsOnUp == '0' && bettingOddsOnDown != '0' ? 1 : bettingOddsOnUp != '0' && bettingOddsOnDown == '0' || bettingOddsOnUp == '0' && bettingOddsOnDown == '0'? 0 : numeral(parseInt(bettingOddsOnUp) / parseInt(bettingOddsOnDown)).format("0,0.00")
                                }
                                x Payout

                            </span>
                        </div>
                    </div>
                    
                    
                    <div className="card-content" 
                        style={
                            variationStatus == 'DOWN' && !isNextPrediction ? downStyle : variationStatus == 'UP' && !isNextPrediction ? upStyle : {border:''}
                        }
                    >

                        <SpaceWagerCardBody
                        obj={obj}
                        price={price}
                        variationStatus={variationStatus}
                        currentTimeRound={currentTimeRound}
                        formattedVariation={formattedVariation}
                        lockedPrice={lockedPrice}
                        prizesPool={prizesPool}
                        isLivePrediction = {isLivePrediction}
                        isPastPrediction = {isPastPrediction}
                        isNextPrediction = {isNextPrediction}
                        />

                    </div>

                        <div className="btn-red w-100 fw-bold"
                            style={{borderTopLeftRadius:0,borderTopRightRadius:0}}
                        >
                            {downButtonShape()}
                            <div className="btn-content" style={{ color: downTextColor()}}>
                            <span className="small d-block fw-normal">
                                {
                                    isNextPrediction ?
                                    state.latestPrediction.down == '0' && state.latestPrediction.up != '0' ? 1 : state.latestPrediction.down != '0' && state.latestPrediction.up == '0' || state.latestPrediction.down == '0' && state.latestPrediction.up == '0'? 0 : numeral(parseInt(state.latestPrediction.down) / parseInt(state.latestPrediction.up)).format("0,0.00")
                                    : bettingOddsOnDown  == '0' && bettingOddsOnUp != '0' ? 1 : bettingOddsOnDown != '0' && bettingOddsOnUp == "0" || bettingOddsOnDown == '0' && bettingOddsOnUp == '0'? 0 : numeral(parseInt(bettingOddsOnDown) / parseInt(bettingOddsOnUp)).format("0,0.00")
                                }x Payout
                            </span>
                            DOWN
                            </div>
                        </div>
                    

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