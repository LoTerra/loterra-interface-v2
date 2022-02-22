import React, { useState, useEffect } from 'react'
import numeral from 'numeral';
import {useStore} from "../../store";

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
        background: '#18ab64',
        color: '#ffffff'
    }

    const equalStylePrice = {
        color: '#ffffff'
    }

    const downStylePrice = {
        color: '#f038f0'
    }

    const upStylePrice = {
        color: '#18ab64'
    }

    function last_price(){
        if (isLivePrediction){
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
        isPastPrediction  &&
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
         //When not active round
         isLivePrediction  &&
         <>

             <div className="row">
                 <div className="col-12 text-start">
                     <p className="my-2 fs-6 mb-0">Last price:</p>
                 </div>
                 <div className="col-6 text-start">
                     <p className="mb-0 fw-bold fs-3">${numeral(last_price()).format('0,0.000')}</p>
                 </div>
                 <div className="col-6 text-end">
                <span
                    className="badge"
                    style={
                        variationStatus == 'down' ? downStyle : upStyle
                    }
                >
                    <p className={'fw-bold fs-6 mb-0'}>{formattedVariation &&(formattedVariation)}</p>
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
                <p className="my-2 fw-bold fs-6 mb-0">{numeral((parseInt(obj[1]['up']) + parseInt(obj[1]['down']))/ 1_000_000 ).format('0,0.00')} {' '} UST</p>
            </div>
        </div>
    }
 </>
    )

}