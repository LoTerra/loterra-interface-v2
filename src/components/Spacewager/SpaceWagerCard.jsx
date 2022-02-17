import React, { useEffect,useState } from 'react'
import numeral from 'numeral';
import { ThermometerSimple } from 'phosphor-react';

export default function SpaceWagerCard(props) {

    const [variationStatus, setVariationStatus] = useState('')
    const {
        obj, 
        roundAmount, 
        bettingOddsOnUp, 
        price, 
        variation,
        lockedPrice, 
        prizesPool, 
        bettingOddsOnDown, 
        click
    } = props;
    const [amount,setAmount] = useState(0)
    const [bidType, setBidType] = useState('');
    const [bidScreen, setBidScreen] = useState(false)
    const [formattedVariation, setFormattedVariation] = useState(0)

    const equalStyle = {
        background: '#44377e',
        color: '#ffffff'
    }

    const downStyle = {
        background: '#ff0dff',
        color: '#ffffff'
    }

    const upStyle = {
        background: '#20ff93',
        color: '#ffffff'
    }

    const getVariation = async (price) => {

        try {
            if (price != lockedPrice) {
                if (price > lockedPrice) {
                    setFormattedVariation('⬆ $' + numeral(variation).format('0,0.000'))
                    setVariationStatus('up')
                } else if (price < lockedPrice) {
                    setFormattedVariation('⬇ $' + numeral(variation).format('0,0.000'))
                    setVariationStatus('down')
                }     
            } else {
                setFormattedVariation('$' + numeral(variation).format('0,0.000'))
                setVariationStatus('equal')
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

    const makeBidFinal = () => {
        if(amount == 0 || amount == ''){
            alert('please fill a amount you want to bid')
            return;
        }
        alert('you bid on '+ bidType +': '+ amount) 
    }

    //Load on mount
    useEffect(() =>  {       
        const interval = setInterval(() => {
            getVariation(variation)    
            console.log('formatted',formattedVariation,variation,numeral(price).format('0,0.000'))
        }, 1000);
          return () => clearInterval(interval); 
            
    },[variation])

    return (
       <div className="col-md-4">
           <div className={"card spacewager-card h-100 "+(obj.active ? ' active' : '')}>                
                <div className="card-header p-0">
                <button className="btn btn-green fw-bold w-100" 
                style={{borderBottomLeftRadius:0,borderBottomRightRadius:0}}
                onClick={() => makeBid('up')}>
                    Up
                    <span className="small fw-normal d-block">{numeral(bettingOddsOnUp).format('0,0.00') + 'x Payout'}</span>    
                </button>
                </div>
               <div className="card-body">
               { !bidScreen &&
                    <>                
                    <div className="row">
                        <div className="col-12 text-start">
                            <p className="my-2 fw-regular fs-6 mb-0">Last price</p>
                        </div>
                        <div className="col-6 text-start">
                        <p className="mb-0 fw-bold fs-2">${numeral(price).format('0,0.000')}</p>
                        </div>
                        <div className="col-6 text-end fs-2">
                            <span
                                className="badge"
                                style={
                                    variationStatus == 'equal' ? equalStyle : variationStatus == 'up' ? upStyle : downStyle
                                }
                            >
                                <p className={'my-2 fw-bold fs-6 mb-0'}>{formattedVariation &&(formattedVariation)}</p>
                            </span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 text-start">
                            <p className="my-2 fw-regular fs-6 mb-0">Locked Price</p>                    
                        </div>
                        <div className="col-6 text-end">
                            <p className="my-2 fw-bold fs-6 mb-0">${numeral(lockedPrice).format('0,0.000')}</p>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-6 text-start">
                        <p className="my-2 fw-regular fs-6 mb-0">Prizes Pool</p>
                        </div>
                        <div className="col-6 text-end">
                        <p className="my-2 fw-bold fs-6 mb-0">{numeral(prizesPool).format('0,0.000')} {' '} LUNA</p>
                        </div>
                    </div>
                    
                    </>
                }
                { bidScreen &&
                     <>
                        <label>Your bid amount ({bidType})</label>
                        <input className="form-control" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                        <button onClick={() => makeBidFinal() } className="btn btn-primary w-100 mt-3">Place bid</button>
                    </>
                }
               </div>
                <div className="card-footer p-0">                      
                <button className="btn btn-red w-100 fw-bold"
                style={{borderTopLeftRadius:0,borderTopRightRadius:0}}
                onClick={() => makeBid('down')}>
                <span className="small d-block fw-normal">{numeral(bettingOddsOnDown).format('0,0.00') + 'x Payout'}</span>
                    Down</button>
                </div>
           </div>
       </div>
    )
}
