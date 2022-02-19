import { LCDClient, WasmAPI } from '@terra-money/terra.js';
import React, { useEffect,useMemo,useState } from 'react'
import numeral from 'numeral';
import { useStore } from '../store'
import SpaceWagerCard from '../components/Spacewager/SpaceWagerCard';
import { Clock, Question, Trophy, Info } from 'phosphor-react'

import SwiperCore, { Navigation, Pagination ,Autoplay,EffectFade } from 'swiper';

SwiperCore.use([Navigation, Pagination,Autoplay,EffectFade ]);

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';



export default () => {

    const {state,dispatch} = useStore();
    const terra = state.lcd_client

    //Basedata spacewager
    const [config,setConfig] = useState();
    const [spacewagerState, setSpacewagerState] = useState()
    const [predictions,setPredictions] = useState([]);

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

    //Testnet settings now api

    const lcd = new LCDClient({
        URL: 'https://bombay-lcd.terra.dev/',
        chainID: 'bombay-12'
    });

    const api = new WasmAPI(lcd.apiRequester)


    let wallet = ''
    let connectedWallet = ''
    if (typeof document !== 'undefined') {
        wallet = useWallet()
        connectedWallet = useConnectedWallet()
    }

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

    async function getSpacewagerState(){
        try {
            let spacewager_state = await api.contractQuery(
                state.spaceWagerAddress,
                {
                    state: {
                       
                    }
                }
            );
            console.log('state',spacewager_state)
            setSpacewagerState(spacewager_state)
        } catch(e) {
            console.log(e)
        }        
    }

    async function getSpacewagerConfig(){
        try {
            let spacewager_config = await api.contractQuery(
                state.spaceWagerAddress,
                {
                    config: {
                       
                    }
                }
            );
            console.log('config',spacewager_config)
            setConfig(spacewager_config)
        } catch(e) {
            console.log(e)
        }        
    }

    async function getSpacewagerPredictions(){
        try {
            let spacewager_predictions = await api.contractQuery(
                state.spaceWagerAddress,
                {
                    predictions: {
                       
                    }
                }
            );
            console.log('predictions',spacewager_predictions)
            setPredictions(spacewager_predictions)
            
        } catch(e) {
            console.log(e)
        }        
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
            const contractConfigInfo = await api.contractQuery(config.pool_address, {
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
        useEffect(() =>{
            getSpacewagerState()
            getSpacewagerConfig()
            getSpacewagerPredictions()
        },[])


    //Change on lunaprice state change
    useEffect(() =>  {       
      if(config){
        const interval = setInterval(() => {
            getLunaPrice(lunaPrice)    
          }, 1000);
          return () => clearInterval(interval); 
      }
               
    },[lunaPrice,config])
 
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
                {predictions.length > 0 && predictions.map((obj,k) => {
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
