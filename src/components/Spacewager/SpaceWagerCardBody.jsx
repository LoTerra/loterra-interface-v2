import React, { useState, useEffect } from 'react'
import numeral from 'numeral';
import {useStore} from "../../store";
import PriceLoader from "../PriceLoader";

export default function SpaceWagerCardBody(props) {
    const { state, dispatch } = useStore()
    const {obj,price,variationStatus,formattedVariation,lockedPrice,prizesPool, isLivePrediction, isPastPrediction, isNextPrediction} = props;

    const equalStyle = {
        background: '#6B6B6B',
        opacity: '37%',
        color: '#ffffff'
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

    function last_price(){
        if (isLivePrediction || isPastPrediction && obj[1].success == null){
            //dispatch({ type: 'setSpaceWagerLastPrice', message: price })
            return price
        }else{
            return obj[1].resolved_price / 1000000
        }
    }

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
 </>
    )

}