import React, { useState, useEffect } from 'react'
import numeral from 'numeral';

export default function SpaceWagerCardBody(props) {

    const {obj,price,variationStatus,formattedVariation,lockedPrice,prizesPool} = props;

    
    const equalStyle = {
        background: '#44377e',
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
   

    return (
 <>
        { 
        //When not active round
        obj[1].closing_time * 1000 < Date.now() &&       
        <>    
            
        <div className="row">            
            <div className="col-12 text-start">
                <p className="my-2 fw-muted fs-6 mb-0">Last price:</p>
            </div>
            <div className="col-6 text-start">
                <p className="mb-0 fw-bold fs-3">${numeral(obj[1].resolved_price / 1000000).format('0,0.000')}</p>
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
      obj[1].closing_time * 1000 > Date.now() &&
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