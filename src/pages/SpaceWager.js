import { WasmAPI } from '@terra-money/terra.js';
import React, { useEffect,useState } from 'react'
import numeral from 'numeral';
import { useStore } from '../store'
import SpaceWagerCard from '../components/Spacewager/SpaceWagerCard';
import { Clock, Question, Trophy, Info } from 'phosphor-react'

import SwiperCore, { Navigation, Pagination ,Autoplay,EffectFade } from 'swiper';

SwiperCore.use([Navigation, Pagination,Autoplay,EffectFade ]);

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'



export default () => {

    const {state,dispatch} = useStore();
    const terra = state.lcd_client

    const [lunaPrice, setLunaPrice] = useState(0)
    const [lunaLockedPrice, setLunaLockedPrice] = useState(0)
    const [lunaPriceVariation, setLunaPriceVariation] = useState(0)
    const [lunaStatus, setLunaStatus] = useState('')
    const [lunaPriceCounter, setLunaPriceCountdown] = useState(0)
    const [prizesPoolAmount, setPrizesPoolAmount] = useState(0)
    const [amountBetOnUp, setAmountBetOnUp] = useState(0)
    const [amountBetOnDown, setAmountBetOnDown] = useState(0)
    const [bettingOddsOnUp, setBettingOdssOnUp] = useState(0)
    const [bettingOddsOnDown, setBettingOdssOnDown] = useState(0)
    const [round, setRound] = useState(0)

    const api = new WasmAPI(terra.apiRequester)

    function openSpaceWagerDocs() {
        href="https://app.alteredprotocol.com"
    }

    function getVariation(lockedPrice, currentPrice) {
        let variation = 0.000
        if (lockedPrice != 0) {
            if (lockedPrice > currentPrice) {
                variation = currentPrice - lockedPrice
            } else if (lockedPrice < currentPrice){
                variation = currentPrice - lockedPrice
            } else {
                variation = 0
            }
        }
        
        return variation
    }

    function getRound(){

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
            setLunaLockedPrice(56.199)
            setLunaPriceVariation(getVariation(lunaLockedPrice, luna_base_price))
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
                    <h2 className="my-2 fw-regular fs-6 mb-0">Bets on the price of LUNA</h2>
                </div>
            <div className="luna-price mb-3">
                <div className="row">
                    <div className="col-6 text-start">
                        <span
                            className="badge"
                            style={{
                                background: '#44377e',
                                color: '#ffffff',
                                marginLeft: '7px',
                                position: 'relative',
                                top: '-2px',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 321 319">
                                <g fill="none">
                                    <path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/>
                                    <circle cx="420.9" cy="296.5" r="45.7"/>
                                    <path d="M520.5 78.1z"/>
                                </g>
                            </svg>
                            <img
                                src="/terra-luna-Logo.png"
                                className="img-fluid terraLogo"
                            />
                            <p className="mb-0 text-bold">LUNA/UST price</p>
                            
                            <h2 className={lunaStatus}>${numeral(lunaPrice).format('0,0.000')}</h2>
                        </span>
                    </div>
                    <div className="col-6 text-end">
                        <p className="mb-0 text-muted">Predictions?</p>
                        <h2 className={lunaStatus}>0000</h2>
                        <button className="btn btn-plain fw-bold w-20 ms-2"
                            onClick={() => window.open("https://docs.loterra.io/upcoming/roadmap/spacewager", "_blank")}>
                            <Question size={36} style={{position:'relative',top:0}} weight={'bold'}/>
                        </button>
                        <button className="btn btn-plain fw-bold w-20 ms-2"
                            onClick={() => makeBid('up')}>
                            <Trophy size={36} style={{position:'relative',top:0}} weight={'bold'}/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-100 my-2 mb-5 text-center">
                <p className="mb-0 text-white fs-1 fw-bold">
                    <Clock size={36} style={{position:'relative',top:-4}} weight={'bold'}/> 
                    00:00
                </p>
            </div>
            <div className="row">
            <Swiper
      spaceBetween={30}
    //   modules={[Navigation, Pagination, A11y]}                           
      initialSlide={3}
      pagination={{ clickable: true }}
      navigation={true}
      observeParents={true}
      observer={true}
      slidesPerView={1}         
      breakpoints={{
        // when window width is >= 640px
        1: {
            slidesPerView: 1,
        },
        // when window width is >= 768px
        768: {
            slidesPerView: 1,
        },
        1000: {
            slidesPerView: 1,
        },
        1500: {
            slidesPerView: 1,
        },
    }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
                {[
                    {active: false},
                    {active: false},
                    {active: false},
                    {active: false},
                    {active: false},
                    {active: false},
                    {active: false},
                    {active: false},
                    {active: false},
                    {active: false},
                    {active: false}
                ].map((obj,k) => {
                    return (
                        <SwiperSlide>
                            <SpaceWagerCard 
                            key={k} 
                            obj={obj}
                            roundAmount={round}
                            bettingOddsOnUp={bettingOddsOnUp}
                            price={lunaPrice}
                            variation={lunaPriceVariation}
                            lockedPrice={lunaLockedPrice}
                            prizesPool={prizesPoolAmount}
                            bettingOddsOnDown={bettingOddsOnDown}
                            click={(a) => triggerClick(a)}
                            />
                        </SwiperSlide>
                    )
                })}
                </Swiper>   
                </div>
            </div>
        </>
    )
}
