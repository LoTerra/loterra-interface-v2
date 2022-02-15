import { WasmAPI } from '@terra-money/terra.js';
import React, { useEffect,useState } from 'react'
import numeral from 'numeral';
import { useStore } from '../store'
import SpaceWagerCard from '../components/Spacewager/SpaceWagerCard';

export default () => {

    const {state,dispatch} = useStore();
    const terra = state.lcd_client

    const [lunaPrice, setLunaPrice] = useState(0)
    const [lunaLockedPrice, setLunaLockedPrice] = useState(0)
    const [lunaPricePercentage, setLunaPricePercentage] = useState(0)
    const [lunaStatus, setLunaStatus] = useState('')
    const [lunaPriceCounter, setLunaPriceCountdown] = useState(0)

    const api = new WasmAPI(terra.apiRequester)

    function getPercentage(currentPrice) {
        var percentageVariation = (numeral(currentPrice).format('0,0.000') - 55.910) / 55.910 * 100

        return percentageVariation
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
            setLunaPricePercentage(getPercentage(luna_base_price))
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
            <div className="luna-price">
                <p>Luna price</p>
                <h2 className={lunaStatus}>{numeral(lunaPrice).format('0,0.000')}</h2> 
                <div className="row">
                {[1,2,2].map((obj,k) => {
                    return (
                        <SpaceWagerCard key={k} price={lunaPrice} percentage={lunaPricePercentage} click={(a) => triggerClick(a)}/>
                    )
                })}
                </div>
            </div>
        </>
    )
}
