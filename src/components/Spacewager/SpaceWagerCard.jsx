import React, { useEffect,useState } from 'react'
import numeral from 'numeral';
import { ThermometerSimple, ArrowUp, ArrowDown } from 'phosphor-react';
import SpaceWagerCardHeader from './SpaceWagerCardHeader';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { useStore } from '../../store';
import SpaceWagerCardBody from './SpaceWagerCardBody';
import { registerables } from 'chart.js';

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
        click,
    } = props;

    const {state,dispatch} = useStore()

    const [amount,setAmount] = useState(0)
    const [bidType, setBidType] = useState('');
    const [bidScreen, setBidScreen] = useState(false)
    const [formattedVariation, setFormattedVariation] = useState(0)

    function upButtonShape(upColor, upColorOpacity, boxBorderColor, boxBorderColorOpacity, downColor, downColorOpacity){
        return (
            <svg width="265" xmlns="http://www.w3.org/2000/svg" viewBox="24.3139 0 270.6231 68">
            
                <path d="M24.7723 15.3663C20.5385 8.70893 25.3209 0 33.2105 0H286.474C294.81 0 299.486 9.59954 294.348 16.1636L285.632 27.2997C282.841 30.8657 282.795 35.8623 285.519 39.4795L294.937 51.9838C299.9 58.5735 295.199 68 286.949 68H32.8434C25.0314 68 20.2361 59.4436 24.3139 52.7802L32.9501 38.6677C34.9431 35.4109 34.9077 31.3035 32.8587 28.0816L24.7723 15.3663Z" fill="#6B6B6B" fill-opacity="0.37"/>
             
            </svg>
        )
    }

    function downButtonShape(upColor, upColorOpacity, boxBorderColor, boxBorderColorOpacity, downColor, downColorOpacity){
        return(
            <svg width="265" xmlns="http://www.w3.org/2000/svg" viewBox="24.3139 251 270.6231 68">


                <path d="M24.7723 266.366C20.5385 259.709 25.3209 251 33.2105 251H286.474C294.81 251 299.486 260.6 294.348 267.164L285.632 278.3C282.841 281.866 282.795 286.862 285.519 290.48L294.937 302.984C299.9 309.574 295.199 319 286.949 319H32.8434C25.0314 319 20.2361 310.444 24.3139 303.78L32.9501 289.668C34.9431 286.411 34.9077 282.304 32.8587 279.082L24.7723 266.366Z" fill="#6B6B6B" fill-opacity="0.37"/>
                <defs>
                <linearGradient id="MyGradient">
                <stop offset="0.37%" stop-color="#6B6B6B" />
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

    const getVariation = async (price) => {

        try {
            if (variation != 0) {
                if (variation > 0) {
                    setFormattedVariation('⬆ $' + numeral(variation).format('0,0.000'))
                    setVariationStatus('up')
                } else if (variation < 0) {
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
                { 
                    //Only show button when live
                    obj[1].closing_time * 1000 > Date.now() &&
                    <button className="btn btn-green fw-bold w-100"
                        style={{borderBottomLeftRadius:0,borderBottomRightRadius:0}}
                        onClick={() => makeBid('up')}>
                            {upButtonShape()}
                        <div className="btn-content">
                        Up
                        <span className="small fw-normal d-block">{obj[1]['up'] == '0' && obj[1]['down'] != '0' ? 1 : obj[1]['up'] != '0' && obj[1]['down'] == '0' || obj[1]['up'] == '0' && obj[1]['down'] == '0'? 0 : numeral(parseInt(obj[1]['up']) / parseInt(obj[1]['down'])).format("0,0.00")}x Payout</span>
                        </div>
                    </button>
                }
                    <div className="card-content" 
                        style={
                            variationStatus == 'down' ? downStyle : upStyle
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
                        />
                    }
                    { bidScreen &&
                        <>
                            <label>Your bid amount ({bidType})</label>
                            <input className="form-control" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/>

                            <button onClick={() => makeBidFinal(obj[0]) } className="btn btn-plain w-100 mt-3">Place bid</button>
                        </>
                    }
                    </div>
                    { 
                    //Only show button when live
                    obj[1].closing_time * 1000 > Date.now() &&
                        <button className="btn btn-red w-100 fw-bold"
                        style={{borderTopLeftRadius:0,borderTopRightRadius:0}}
                        onClick={() => makeBid('down')}>
                            {downButtonShape()}
                            <div className="btn-content">
                                <span className="small d-block fw-normal">{obj[1]['down'] == '0' && obj[1]['up'] != '0' ? 1 : obj[1]['down'] != '0' && obj[1]['up'] == '0' || obj[1]['down'] == '0' && obj[1]['up'] == '0'? 0 : numeral(parseInt(obj[1]['down']) / parseInt(obj[1]['up'])).format("0,0.00") }x Payout</span>
                                Down
                            </div>
                        </button>
                    }
                </div>
                    <div className="card-footer p-0">                      
                    </div>
                </div>
       </div>
    )
}