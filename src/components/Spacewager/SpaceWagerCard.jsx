import React, { useEffect,useState } from 'react'
import numeral from 'numeral';
import { ThermometerSimple } from 'phosphor-react';
import SpaceWagerCardHeader from './SpaceWagerCardHeader';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { useStore } from '../../store';

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

    const {state,dispatch} = useStore()

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


    function upButtonShape(upColor, upColorOpacity, boxBorderColor, boxBorderColorOpacity, downColor, downColorOpacity){
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="24.3139 0 270.6231 68">
                <path d="M24.7723 15.3663C20.5385 8.70893 25.3209 0 33.2105 0H286.474C294.81 0 299.486 9.59954 294.348 16.1636L285.632 27.2997C282.841 30.8657 282.795 35.8623 285.519 39.4795L294.937 51.9838C299.9 58.5735 295.199 68 286.949 68H32.8434C25.0314 68 20.2361 59.4436 24.3139 52.7802L32.9501 38.6677C34.9431 35.4109 34.9077 31.3035 32.8587 28.0816L24.7723 15.3663Z" fill="#6B6B6B"/>
            </svg>
        )
    }

    function downButtonShape(upColor, upColorOpacity, boxBorderColor, boxBorderColorOpacity, downColor, downColorOpacity){
        return(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="24.3139 251 270.6231 68">
                <path d="M24.7723 266.366C20.5385 259.709 25.3209 251 33.2105 251H286.474C294.81 251 299.486 260.6 294.348 267.164L285.632 278.3C282.841 281.866 282.795 286.862 285.519 290.48L294.937 302.984C299.9 309.574 295.199 319 286.949 319H32.8434C25.0314 319 20.2361 310.444 24.3139 303.78L32.9501 289.668C34.9431 286.411 34.9077 282.304 32.8587 279.082L24.7723 266.366Z" fill="#6B6B6B"/>
            </svg>
        )
    }

    // function setWagerBox(upColor, upColorOpacity, boxBorderColor, boxBorderColorOpacity, downColor, downColorOpacity) {
    //     return (
    //         <svg width="321" height="319" viewBox="0 0 321 319" fill="none" xmlns="http://www.w3.org/2000/svg">
    //             <path d="M24.7723 15.3663C20.5385 8.70893 25.3209 0 33.2105 0H286.474C294.81 0 299.486 9.59954 294.348 16.1636L285.632 27.2997C282.841 30.8657 282.795 35.8623 285.519 39.4795L294.937 51.9838C299.9 58.5735 295.199 68 286.949 68H32.8434C25.0314 68 20.2361 59.4436 24.3139 52.7802L32.9501 38.6677C34.9431 35.4109 34.9077 31.3035 32.8587 28.0816L24.7723 15.3663Z" fill={upColor} fill-opacity={upColorOpacity}/>
                
    //             <rect x="1.5" y="66.5" width="318" height="186" rx="18.5" stroke={boxBorderColor} stroke-opacity={boxBorderColorOpacity} stroke-width="3">
                   
    //             </rect>
    //             <path d="M24.7723 266.366C20.5385 259.709 25.3209 251 33.2105 251H286.474C294.81 251 299.486 260.6 294.348 267.164L285.632 278.3C282.841 281.866 282.795 286.862 285.519 290.48L294.937 302.984C299.9 309.574 295.199 319 286.949 319H32.8434C25.0314 319 20.2361 310.444 24.3139 303.78L32.9501 289.668C34.9431 286.411 34.9077 282.304 32.8587 279.082L24.7723 266.366Z" fill={downColor} fill-opacity={downColorOpacity}/>
    //         </svg>
    //     )
    // }

    const getVariation = async (price) => {

        try {
            if (price != lockedPrice) {
                //console.log('lockedPrice', lockedPrice)
                //console.log('Price', price)
                if (price > lockedPrice) {
                    setFormattedVariation('⬆ $' + numeral(variation).format('0,0.000'))
                    setVariationStatus('up')
                    //console.log('up')
                } else if (price < lockedPrice) {
                    setFormattedVariation('⬇ $' + numeral(variation).format('0,0.000'))
                    setVariationStatus('down')
                    //console.log('down')
                }     
            } else {
                setFormattedVariation('$' + numeral(variation).format('0,0.000'))
                setVariationStatus('equal')
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

    const makeBidFinal = (round) => {
        if(amount == 0 || amount == ''){
            alert('please fill a amount you want to bid')
            return;
        }
        alert('you bid on '+ bidType +': '+ amount + 'UST on round: '+round) 

        if (amount <= 0) return

        let type = bidType == 'up' ? true : false

        let msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.spaceWagerAddress,
            {
                make_prediction: {up :type},
                resolve_game: { address: state.wallet.walletAddress, round: round }
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

    //Load on mount
    useEffect(() =>  {       
        const interval = setInterval(() => {
            getVariation(price)    
        }, 1000);
          return () => clearInterval(interval); 
            
    },[price])

    return (
       <div className="col-9 mx-auto">
            <div className={"card spacewager-card h-100 "+(obj.active ? ' active' : '')}>                
                    <SpaceWagerCardHeader obj={obj}/>
                <div className="card-body">
                    {/* {setWagerBox("green", "1", "pink", "1", "pink", "1")} */}
                    <button className="btn btn-green fw-bold w-100"
                        style={{borderBottomLeftRadius:0,borderBottomRightRadius:0}}
                        onClick={() => makeBid('up')}>
                            {upButtonShape()}
                        <div className="btn-content">
                        Up
                        <span className="small fw-normal d-block">{numeral(bettingOddsOnUp).format('0,0.00') + 'x Payout'}</span>    
                        </div>
                    </button>
                    <div className="card-content">
                    { !bidScreen &&
                        <>                
                        <div className="row">
                            <div className="col-12 text-start">
                                <p className="my-2 fw-muted fs-6 mb-0">Last price:</p>
                            </div>
                            <div className="col-6 text-start">
                                <p className="mb-0 fw-bold fs-3">${numeral(price).format('0,0.000')}</p>
                            </div>
                            <div className="col-6 text-end fs-2">
                                <span
                                    className="badge"
                                    style={
                                        variationStatus == 'down' ? downStyle : upStyle
                                    }
                                >
                                    <p className={'my-2 fw-bold fs-6 mb-0'}>{formattedVariation &&(formattedVariation)}</p>
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 text-start">
                                <p className="my-2 fw-regular fs-6 mb-0">Locked Price:</p>                    
                            </div>
                            <div className="col-6 text-end">
                                <p className="my-2 fw-bold fs-6 mb-0">${numeral(lockedPrice).format('0,0.000')}</p>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-6 text-start">
                            <p className="my-2 fw-regular fs-6 mb-0">Prizes Pool:</p>
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
                            <button onClick={() => makeBidFinal(obj[0]) } className="btn btn-primary w-100 mt-3">Place bid</button>
                        </>
                    }
                    </div>
                        <button className="btn btn-red w-100 fw-bold"
                        style={{borderTopLeftRadius:0,borderTopRightRadius:0}}
                        onClick={() => makeBid('down')}>
                            {downButtonShape()}
                            <div className="btn-content">
                                <span className="small d-block fw-normal">{numeral(bettingOddsOnDown).format('0,0.00') + 'x Payout'}</span>
                                Down
                            </div>
                        </button>
                </div>
                    <div className="card-footer p-0">                      
                    </div>
                </div>
       </div>
    )
}