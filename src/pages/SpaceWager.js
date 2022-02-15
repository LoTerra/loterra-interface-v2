import { WasmAPI } from '@terra-money/terra.js';
import React, { useEffect,useState } from 'react'
import numeral from 'numeral';
import { useStore } from '../store'
import SpaceWagerCard from '../components/Spacewager/SpaceWagerCard';
import { Clock } from 'phosphor-react';

export default () => {

    const {state,dispatch} = useStore();
    const terra = state.lcd_client

    const [lunaPrice, setLunaPrice] = useState(0)
    const [lunaLockedPrice, setLunaLockedPrice] = useState(0)
    const [lunaPricePercentage, setLunaPricePercentage] = useState(0)
    const [lunaStatus, setLunaStatus] = useState('')
    const [lunaPriceCounter, setLunaPriceCountdown] = useState(0)
    const [prizesPoolAmount, setPrizesPoolAmount] = useState(0)
    const [amountBetOnUp, setAmountBetOnUp] = useState(0)
    const [amountBetOnDown, setAmountBetOnDown] = useState(0)
    const [bettingOddsOnUp, setBettingOdssOnUp] = useState(0)
    const [bettingOddsOnDown, setBettingOdssOnDown] = useState(0)

    const api = new WasmAPI(terra.apiRequester)

    function getPercentage(currentPrice, lockedPrcie) {
        var percentageVariation = (currentPrice - lockedPrice) / lockedPrice * 100

        return percentageVariation
    }

    function getBetsAmount() {

    }

    function getBettingOdds(amountBetOnUp, amountBetOnDown) {

    }

    function getLockedPrice() {

    }

    function getPrizesPoolAmount() {

    }

    const getLunaPrice = async (price) => {
        console.log('price')
        try {
            const contractConfigInfo = await api.contractQuery(state.lunaPoolAddress, {
                pool: {},
            }) 
            let ust = parseInt(contractConfigInfo.assets[1].amount)
            let luna = parseInt(contractConfigInfo.assets[0].amount)
            
            let luna_base_price = luna / ust
            if(parseFloat(luna_base_price) != parseFloat(price)){
                let status = ''
                if(numeral(luna_base_price).format('0,0.000') > numeral(price).format('0,0.000')){
                    status = 'up'
                } else if(numeral(luna_base_price).format('0,0.000') < numeral(price).format('0,0.000')){
                    status = 'down'
                }
                setLunaPrice(luna_base_price)
                setLunaStatus(status)
                setLunaPriceCountdown(lunaPriceCounter + 1)
            } else {
                setLunaPrice(luna_base_price)
                setLunaStatus('')
            }
            console.log(luna_base_price)

            setLunaLockedPrice(55.910)
            setLunaPricePercentage(getPercentage(luna_base_price, lunaLockedPrice))
        } catch(e){
            console.log(e)
        }
    }

    const triggerClick = (status) => {
        alert(status)
        console.log('you just clicked me')
    }

    //Load on mount
    useEffect(() =>  {       
        const interval = setInterval(() => {
            getLunaPrice(lunaPrice)    
          }, 1000);
          return () => clearInterval(interval); 
               
    },[lunaPrice])
    
    return (
        <>
            <div className="container">
                <div className="w-100 py-5 text-center">
                    <h1 className="mb-0 fw-bold">Spacewager</h1>
                </div>
            <div className="luna-price mb-3">
                <div className="row">
                    <div className="col-6 text-start">
                        <p className="mb-0 text-muted">Luna price</p>
                        <h2 className={lunaStatus}>{numeral(lunaPrice).format('0,0.000')}</h2> 
                    </div>
                    <div className="col-6 text-end">
                        <p className="mb-0 text-muted">Predictions?</p>
                        <h2 className={lunaStatus}>0000</h2> 
                    </div>
                </div>
                
                
            </div>
            <div className="w-100 my-2 mb-5 text-center">
                <p className="mb-0 text-white fs-1 fw-bold"><Clock size={36} style={{position:'relative',top:-4}} weight={'bold'}/> 00:00</p>
            </div>
            <div className="row">
                {[
                    {active: false},
                    {active: true},
                    {active: false}
                ].map((obj,k) => {
                    return (
                        <SpaceWagerCard 
                        key={k} 
                        obj={obj}
                        bettingOddsOnUp={bettingOddsOnUp}
                        price={lunaPrice}
                        percentage={lunaPricePercentage}
                        lockedPrice={lunaLockedPrice}
                        prizesPool={prizesPoolAmount}
                        bettingOddsOnDown={bettingOddsOnDown}
                        click={(a) => triggerClick(a)}
                        />
                    )
                })}
                </div>
            </div>
        </>
    )
}
