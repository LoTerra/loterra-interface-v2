import { LCDClient, WasmAPI } from '@terra-money/terra.js';
import React, { createRef, useEffect,useMemo,useState, useRef } from 'react'
import numeral from 'numeral';
import { useStore } from '../store'
import SpaceWagerCard from '../components/Spacewager/SpaceWagerCard';
import SpaceWagerGameView from '../components/Spacewager/SpaceWagerGameView';
import { Head } from 'react-static'

import { Clock, Question, Trophy, Info, ArrowLeft, ArrowRight, Warning } from 'phosphor-react'

import SwiperCore, { Navigation, Pagination ,Autoplay,EffectFade } from 'swiper';

SwiperCore.use([Navigation, Pagination,Autoplay,EffectFade ]);

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';

import Pusher from 'pusher-js';
import SpaceWagerIcon from '../components/Spacewager/SpaceWagerIcon';
import { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
import CountUp from 'react-countup';
import SpaceWagerIndividualStats from '../components/Spacewager/SpaceWagerIndividualStats';
import SpaceWagerLunaLogo from '../components/Spacewager/SpaceWagerLunaLogo';

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

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
    let lunaPricePast = usePrevious(lunaPrice)

    const [lunaLockedPrice, setLunaLockedPrice] = useState(0)
    const [lunaPriceVariation, setLunaPriceVariation] = useState(0)
    const [lunaStatus, setLunaStatus] = useState('')
    const [lunaPriceCounter, setLunaPriceCountdown] = useState(0)
    const [prizesPoolAmount, setPrizesPoolAmount] = useState(0)

    const [amountBetOnUp, setAmountBetOnUp] = useState(0)
    const [amountBetOnDown, setAmountBetOnDown] = useState(0)
    const [bettingOddsOnUp, setBettingOdssOnUp] = useState(0)
    const [bettingOddsOnDown, setBettingOdssOnDown] = useState(0)
    const [currentUp, setCurrentUp] = useState(0)
    const [currentDown, setCurrentDown] = useState(0)


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
            dispatch({ type: 'setSpaceWagerCurrentRound', message: spacewager_state.round })
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

    function is_equal(prediction){
        if (state.latestPrediction.up != parseInt(state.previousPrediction.up) || state.latestPrediction.down != parseInt(state.previousPrediction.down)){
            dispatch({ type: 'setPreviousPrediction', message: prediction })
            dispatch({ type: 'setIsUserMakingPrediction', message: false })
        }
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
            setSpacewagerState({round: parseInt(data.message)})
            dispatch({ type: 'setSpaceWagerResolving', message: false })
            dispatch({ type: 'setSpaceWagerCurrentRound', message: parseInt(data.message) })
        })

        channel.bind('latest-prediction', function (data) {
            let prediction = JSON.parse(data.message);
            dispatch({ type: 'setLatestPrediction', message: prediction })
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

                return(
                <>
                    <Clock size={32} style={{position:'relative', top:'-8px'}} className="d-none d-md-inline-block" weight={'bold'}/>
                    <h2 className="fs-2 fw-bold d-inline-block mb-0">{format_message}</h2>
                </>
                )
            }

            return (
                <span className="fs-6">{format_message}</span>
            )

            //   console.log(currentTime, expiryTimestamp)

    }


    //Load on mount
    useEffect(() =>{
        getSpacewagerState()
        getSpacewagerConfig()
        
        setInterval(() => {
            formatTime()
        }, 1000)
        /*
            TODO: show the prediction loader here
         */
    },[])

    useEffect(() => {
        pusher_price()
    }, [])



    useEffect(() => {
        is_equal(state.latestPrediction)
    }, [state.latestPrediction])


    //Change on lunaprice state change
    useEffect(() =>  {       
      // if(config) {
      //   const interval = setInterval(() => {
      //       getLunaPrice(lunaPrice)
      //     }, 1000);
      //     return () => clearInterval(interval);
      // }

        getSpacewagerPredictions()
    },[spacewagerState.round, state.spaceWagerCurrentRound, state.latestPrediction])


    return (
        <>
        <Head>
                <meta charSet="UTF-8" />
                <title>
                    Spacewager | Predict LUNA/UST price prediction!
                </title>
                <meta
                    property="og:title"
                    content="Spacewager | Predict LUNA/UST price prediction!"
                />
                <meta
                    property="og:description"
                    content="LoTerra Spacewager is a decentralized prediction game on Terra Blockchain. Predict whether LUNA's price will rise or fall – guess correctly to win!"
                />
                <meta
                    property="og:image"
                    content="https://drive.google.com/file/d/1G6HMrcU05YhfTeAJpmz7sVUvbyOp_kuB/view?usp=sharing"
                />
                <meta
                    property="twitter:title"
                    content="Spacewager | Predict LUNA/UST price prediction!"
                />
                <meta
                    property="twitter:image"
                    content="https://drive.google.com/file/d/1G6HMrcU05YhfTeAJpmz7sVUvbyOp_kuB/view?usp=sharing"
                />
                <meta
                    property="twitter:description"
                    content="LoTerra Spacewager is a decentralized prediction game on Terra Blockchain. Predict whether LUNA's price will rise or fall – guess correctly to win!"
                />
            </Head>
            <div className="spacewager-beta">
                <p className="mb-0"><Warning size={'13px'} weight="fill" style={{position:'relative',top:'-1px', marginRight:4}} />Spacewager is currently in BETA, any losses inccured due your actions are your own responsibilty.</p>
            </div>
            <div className="container">
                <div className="w-100 py-3 py-md-5 text-center">
                    <h1 className="mb-0 fw-bold" style={{textShadow:'1px 1px 10px #14053b'}}>Spacewager</h1>
                    <h2 className="my-2 fw-regular fs-6 mb-0">Predict the future LUNA price</h2>
                </div>
        
                <div className="row mb-2">
                    <div className="col-6 col-md-4 order-2 order-md-1 text-start">
                    <div className="card lota-card">
                        <div className="card-body">
                        <div className="row">
                      
                      <div className="col-2 col-md-3 d-flex h-100 text-center d-none d-md-inline-block">
                        <SpaceWagerLunaLogo/>
                      </div>
                      <div className="col-12 col-md-8 d-flex h-100 text-start">
                       
                          <div className="align-self-center w-100">
                          <small className="d-inline-block mb-1 astroport"
                          style={{
                              padding:'5px 10px',
                              background:'#5a42fb',
                              borderRadius:'100px',
                              fontSize:'12px'
                          }}
                          >
                              <svg viewBox="0 0 41 32" focusable="false" href="https://astroport.fi/" className="d-none d-md-inline-block"
                              style={{
                                width: '18.5px', height: '14px', display: 'inline-block', lineHeight: '1em', marginRight:'7px'
                              }}
                              >
                                  <path d="M24.3958 21.0859V21.0771C22.053 21.0302 20.1681 19.1548 20.1681 16.8442C20.1681 19.1499 18.29 21.0224 15.9541 21.0762V21.0859C18.29 21.1397 20.1681 23.0122 20.1681 25.3179C20.1671 23.0083 22.053 21.1329 24.3958 21.0859Z" fill="currentColor"></path><path d="M23.5293 -0.00012207H17.0028C16.1611 -0.00012207 15.3906 0.471177 15.0048 1.22213L0.1428 30.1503C-0.289706 30.9932 0.319115 31.9974 1.264 31.9974H8.76857C9.618 31.9974 10.3944 31.5173 10.7762 30.7566L14.7681 22.8041C15.3107 21.7227 15.302 20.4457 14.7438 19.372L11.8711 13.8455C11.0899 12.3426 12.177 10.5435 13.8661 10.5454L26.6806 10.5591C28.3697 10.5611 29.4529 12.3622 28.6687 13.8631L25.4357 20.0546C25.0986 20.6989 25.0928 21.4675 25.4191 22.1177L29.7558 30.7576C30.1377 31.5183 30.9141 31.9984 31.7635 31.9984H39.2681C40.213 31.9984 40.8218 30.9942 40.3893 30.1513L25.5272 1.22213C25.1415 0.471177 24.37 -0.00012207 23.5293 -0.00012207Z" fill="currentColor"></path>
                              </svg>                                  
                                   <span  style={{color:'#fff'}}><a href="https://docs.astroport.fi/astroport/smart-contracts/oracles" style={{color:'#fff',textDecoration:'none',fontWeight:'700'}} target="_blank">Astroport</a> Oracle</span>
                              </small>
                              <p className="mb-0 text-normal text-muted card-label">
                              Luna/UST Price
                              </p>
                          <h2 className={'fs-2 fw-bold mb-0'}>
                              $<CountUp start={lunaPricePast} end={lunaPrice} decimals="3"/>
                              </h2>
                             
                          </div>
                          </div>
                      </div>
                        </div>

                        </div>
                    </div>
                    <div className="col-6 col-md-4 order-3 order-md-2 text-center">
                <div className="card lota-card h-100">
                    <div className="card-body d-flex">
                    <div className="align-self-center w-100 mb-0 text-white">
                    <p className="mb-0 text-normal text-muted card-label">
                    Round ends in
                    </p>
                    
                    {state.spaceWagerCurrentTimeRound && formatTime() || "00:00"}
                </div>
                    </div>
                </div>
            </div>
                    <div className="col-12 col-md-4 text-center text-md-end order-1 order-md-2 position-relative">
                        <button className="btn btn-plain fw-bold w-20 ms-2 docs-btn" style={{zIndex:999, position:'relative'}}
                            onClick={() => window.open("https://docs.loterra.io/upcoming/roadmap/spacewager", "_blank")}>
                            <Question size={24} style={{position:'relative',top:-2}} weight={'bold'}/>
                        </button>
                        <SpaceWagerIcon />
                        {/* <button className="btn btn-plain fw-bold w-20 ms-2"
                            onClick={() => makeBid('up')}>
                            <Trophy size={36} style={{position:'relative',top:0}} weight={'bold'}/>
                        </button> */}
                    </div>
                    <div className="col-md-12 order-4 my-3">
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
           
            
            <div className="row mb-2 position-relative">
                    {predictions.length > 0 &&
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
                            <SwiperSlide key={obj.prediction_id} >
                                <SpaceWagerCard 
                                key={obj.prediction_id}
                                id={k}
                                dataLength={predictions.length}
                                obj={obj}
                                roundAmount={spacewagerState.round}
                                currentTimeRound={state.spaceWagerCurrentTimeRound}
                                bettingOddsOnUp={obj['up']}
                                price={lunaPrice}
                                variation={getVariation(obj['locked_price'], obj.resolved_price )}
                                lockedPrice={obj['locked_price']}
                                prizesPool={prizesPoolAmount}
                                bettingOddsOnDown={obj['down']}
                                isLivePrediction={obj.closing_time * 1000 < Date.now() && obj.closing_time * 1000 > Date.now() - 300000}
                                isNextPrediction={obj.closing_time * 1000 > Date.now()}
                                isPastPrediction={obj.closing_time * 1000 < Date.now() && obj.closing_time * 1000 < Date.now() - 300000 }
                                />
                            </SwiperSlide>
                        )
                    })}
                </Swiper> 
                    }
         
                </div>
            </div>
        <div>
            {/*<SpaceWagerIndividualStats/>*/}
            <SpaceWagerGameView/>
            <Toaster
         position="top-center"
         reverseOrder={false}
       />
        </div>
        <Footer />
    </>
    )
}
