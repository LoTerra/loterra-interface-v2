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
       <div className="col-9 mx-auto">
            <div className={"card spacewager-card h-100 "+(obj.active ? ' active' : '')}
                style={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20
                }}
            >                
                <SpaceWagerCardHeader obj={obj} currentTimeRound={currentTimeRound} isLivePrediction={isLivePrediction} isNextPrediction={isNextPrediction} isPastPrediction={isPastPrediction}/>

                <div className="card-body">

                    <div className="card-content" 
                        style={
                            variationStatus == 'DOWN' ? downStyle : upStyle
                        }
                    >


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