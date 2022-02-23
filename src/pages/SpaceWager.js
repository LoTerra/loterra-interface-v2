import { LCDClient, WasmAPI } from '@terra-money/terra.js';
import React, { createRef, useEffect,useMemo,useState } from 'react'
import numeral from 'numeral';
import { useStore } from '../store'
import SpaceWagerCard from '../components/Spacewager/SpaceWagerCard';
import SpaceWagerGameView from '../components/Spacewager/SpaceWagerGameView';

import { Clock, Question, Trophy, Info, ArrowLeft, ArrowRight } from 'phosphor-react'

import SwiperCore, { Navigation, Pagination ,Autoplay,EffectFade } from 'swiper';

SwiperCore.use([Navigation, Pagination,Autoplay,EffectFade ]);

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';

import Pusher from 'pusher-js';
import {min} from "@popperjs/core/lib/utils/math";

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;


export default () => {

    const {state,dispatch} = useStore();
    const terra = state.lcd_client

    //Basedata spacewager
    const [config,setConfig] = useState({
        pool_address: "",
        collector_address: "",
        round_time: 0,
        limit_time: 0,
        denom: "",
        collector_fee: ""
    });
    const [spacewagerState, setSpacewagerState] = useState({round:null})
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

    //Testnet settings now api

    const api = new WasmAPI(state.lcd_client.apiRequester)

    const swiperRef = createRef()



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
                variation = (currentPrice - lockedPrice) / 1_000_000
            } else if (lockedPrice < currentPrice){
                variation = (currentPrice - lockedPrice) / 1_000_000
            } else {
                variation = 0.000
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
            if (spacewagerState.round == null){
                return
            }
            // Prepare query
            let query = {
                predictions: {}
            }
            // Add start after to get only last 5 elements
            if (parseInt(spacewagerState.round) - 5 > 0){
                query.predictions.start_after = parseInt(spacewagerState.round) - 5
            }
            // Query to state smart contract
            let spacewager_predictions = await api.contractQuery(
                state.spaceWagerAddress,
                query
            );
            // Set the array of predictions
            setPredictions(spacewager_predictions)
            /*
                TODO: dismiss the prediction loader here
             */

        } catch(e) {
            console.log(e)
        }        
    }

    function getRound(){

    }

    function getBetsAmount() {

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

    async function pusher_price(){
        const pusher = new Pusher('8aa328a021ba69c9198a', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('space-wager')
        channel.bind('price-feed', function (data) {
            dispatch({ type: 'setSpaceWagerLastPrice', message: parseFloat(data.message) })
            setLunaPrice(parseFloat(data.message))
        })

        channel.bind('new-prediction', function (data) {
            setSpacewagerState({round: parseFloat(data.message)})
            dispatch({ type: 'setSpaceWagerResolving', message: false })
        })

        channel.bind('latest-prediction', function (data) {
            let prediction = JSON.parse(data.message);
            if (state.latestPrediction.up != prediction.up || state.latestPrediction.down != prediction.down){
                dispatch({ type: 'setIsUserMakingPrediction', message: false })
            }
            dispatch({ type: 'setLatestPrediction', message: JSON.parse(data.message) })
        })

        return () => {
            pusher.unsubscribe('space-wager')
        }
    }
    function formatTime(){

            let timeBetween = state.spaceWagerCurrentTimeRound * 1000 - Date.now()
            const seconds = Math.floor((timeBetween / 1000) % 60)
            const minutes = Math.floor((timeBetween / 1000 / 60) % 60)
            let format_minutes = minutes < 10 ? "0" + minutes : minutes;
            let format_seconds = seconds < 10 ? "0" + seconds : seconds;

            let format_message = "Closing..."
            if (state.spaceWagerCurrentTimeRound * 1000 > Date.now()){
                format_message = format_minutes + ":" +format_seconds
            }

            return format_message

            //   console.log(currentTime, expiryTimestamp)

    }


    //Load on mount
    useEffect(() =>{
        getSpacewagerState()
        getSpacewagerConfig()
        pusher_price()
        setInterval(() => {
            formatTime()
        }, 1000)
        /*
            TODO: show the prediction loader here
         */
    },[])


    //Change on lunaprice state change
    useEffect(() =>  {       
      // if(config) {
      //   const interval = setInterval(() => {
      //       getLunaPrice(lunaPrice)
      //     }, 1000);
      //     return () => clearInterval(interval);
      // }
        getSpacewagerPredictions()
    },[spacewagerState.round])
 
    return (
        <>
            <div className="container">
                <div className="w-100 py-5 text-center">
                    <h1 className="mb-0 fw-bold">Spacewager</h1>
                    <h2 className="my-2 fw-regular fs-6 mb-0">Bets on the price of LUNA</h2>
                </div>
            <div className="luna-price mb-5">
                <div className="row">
                    <div className="col-6 col-md-4 text-start">
                        <span
                            className="badge"
                            style={{
                                background: '#0b012499',
                                color: '#ffffff',
                                marginLeft: '7px',
                                borderRadius: 20,
                                padding: 20,
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
                    <div className="col-6 col-md-4 d-flex text-center">
                <p className="align-self-center w-100 mb-0 text-white fs-1 fw-bold"
                    style={{
                        background: '#0b012499',
                        borderRadius: 20,
                        padding: 15
                    }}
                >
                    <span 
                    className="d-block"
                    style={{
                        fontSize: 16,
                        fontWeight: 400,
                        opacity: 0.5
                    }}
                    >Current rounds ends in:</span>
                    <Clock size={36} style={{position:'relative',top:-4, marginRight:5}} weight={'bold'}/>
                    {state.spaceWagerCurrentTimeRound && formatTime() || "00:00"}
                </p>
            </div>
                    <div className="col-md-12 text-center text-md-end">
                        <button className="btn btn-plain fw-bold w-20 ms-2"
                            onClick={() => window.open("https://docs.loterra.io/upcoming/roadmap/spacewager", "_blank")}>
                            <Question size={36} style={{position:'relative',top:0}} weight={'bold'}/>
                        </button>
                        <button className="btn btn-plain fw-bold w-20 ms-2"
                            onClick={() => makeBid('up')}>
                            <Trophy size={36} style={{position:'relative',top:0}} weight={'bold'}/>
                        </button>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-6 text-end">
                                <button className="swiper-prev btn btn-plain pb-2"><ArrowLeft size={24} /></button>
                            </div>  
                            <div className="col-6 text-start">
                                <button className="swiper-next btn btn-plain pb-2"><ArrowRight size={24} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row">
                    {spacewagerState.round > 0 &&
                    <Swiper
                    spaceBetween={-50}
                    navigation={{
                        nextEl: '.swiper-next',
                        prevEl: '.swiper-prev',
                      }}
                    //   modules={[Navigation, Pagination, A11y]}                           
                    initialSlide={spacewagerState.round}
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
                    {predictions.length > 0 && predictions.map((obj, k) => {
                        return (
                            <SwiperSlide key={k} >
                                <SpaceWagerCard 
                                key={k}
                                id={k}
                                dataLength={predictions.length}
                                obj={obj}
                                roundAmount={spacewagerState.round}
                                currentTimeRound={state.spaceWagerCurrentTimeRound}
                                bettingOddsOnUp={obj[1]['up']}
                                price={lunaPrice}
                                variation={getVariation(obj[1]['locked_price'], obj[1].resolved_price )}
                                lockedPrice={obj[1]['locked_price']}
                                prizesPool={prizesPoolAmount}
                                bettingOddsOnDown={obj[1]['down']}
                                isLivePrediction={obj[1].closing_time * 1000 < Date.now() && obj[1].closing_time * 1000 > Date.now() - 300000}
                                isNextPrediction={obj[1].closing_time * 1000 > Date.now()}
                                isPastPrediction={obj[1].closing_time * 1000 < Date.now() && obj[1].closing_time * 1000 < Date.now() - 300000 }
                                click={(a) => triggerClick(a)}                        
                                />
                            </SwiperSlide>
                        )
                    })}
                </Swiper> 
                    }
                </div>
            </div>
        <div>
            <SpaceWagerGameView/>
        </div>
    </>
    )
}
