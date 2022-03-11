import { Head } from 'react-static'
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useStore } from '../store'
import RapidoCard from '../components/Rapido/RapidoCard'
import { Clock } from 'phosphor-react'
import SwiperCore, {
    Navigation,
    Pagination,
    Autoplay,
    EffectFade,
} from 'swiper'

SwiperCore.use([Navigation, Pagination, Autoplay, EffectFade])

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { ArrowLeft, ArrowRight } from 'phosphor-react'
import { WasmAPI } from '@terra-money/terra.js'
import Pusher from 'pusher-js'

export default () => {
    const { state, dispatch } = useStore()

    const [rapidoState, setRapidoState] = useState({})
    const [lotteries, setlotteries] = useState([])
    const [allLotteriesHistory, setAllLotteriesHistory] = useState([{}])
    const [timeBetween, setTimeBetween] = useState(0)

    const [config, setConfig] = useState({
        denom: 'uusd',
        frequency: 300,
        fee_collector: '0.05',
        fee_collector_address: 'terra1umd70qd4jv686wjrsnk92uxgewca3805dxd46p',
        fee_collector_terrand: '0.001',
        fee_collector_terrand_address:
            'terra1a62jxn3hh54fa5slan4dkd7u6v4nzgz3pjhygm',
    })

    const api = new WasmAPI(state.lcd_client_testnet.apiRequester)

    async function getRapidoState() {
        try {
            let rapido_state = await api.contractQuery(state.rapidoAddress, {
                state: {},
            })
            setRapidoState({ ...rapido_state })
            dispatch({
                type: 'setRapidoCurrentRound',
                message: rapido_state.round,
            })
        } catch (e) {
            console.log(e)
        }
    }

    async function getRapidoConfig() {
        try {
            let rapido_config = await api.contractQuery(state.rapidoAddress, {
                config: {},
            })
            console.log('config', rapido_config)
            setConfig(rapido_config)
        } catch (e) {
            console.log(e)
        }
    }

    async function getRapidoLotteries() {
        try {
            if (rapidoState.round == null) {
                return
            }
            // Prepare query
            let query = {
                lotteries_state: { limit: 5 },
            }
            // Add start after to get only last 5 elements
            if (parseInt(rapidoState.round) - 5 > 0) {
                query.lotteries_state.start_after =
                    parseInt(rapidoState.round) - 5
            }
            // Query to state smart contract
            let lotteries_state = await api.contractQuery(
                state.rapidoAddress,
                query,
            )
            
            let allLotteries_state = await api.contractQuery(
                state.rapidoAddress,
                {
                    lotteries_state: {limit: 50},
                }
            )
            // Set the array of lotteries
            setlotteries([...lotteries_state])
            setAllLotteriesHistory([...allLotteries_state])
            /*
                TODO: dismiss the prediction loader here
             */
        } catch (e) {
            console.log(e)
        }
    }

    function formatTime() {
        const seconds = Math.floor((timeBetween / 1000) % 60)
        const minutes = Math.floor((timeBetween / 1000 / 60) % 60)
        let format_minutes = minutes < 10 ? '0' + minutes : minutes
        let format_seconds = seconds < 10 ? '0' + seconds : seconds

        let format_message = 'Closing...'
        if (state.rapidoCurrentTimeRound * 1000 > Date.now()) {
            format_message = format_minutes + ':' + format_seconds

            return (
                <>
                    <Clock
                        size={32}
                        style={{ position: 'relative', top: '-8px' }}
                        className="d-none d-md-inline-block"
                        weight={'bold'}
                    />
                    <h2 className="fs-2 fw-bold d-inline-block mb-0">
                        {format_message}
                    </h2>
                </>
            )
        }

        return <span className="fs-6">{format_message}</span>
    }

    function resultHistory() {
        let render = allLotteriesHistory.map((lottery) => (
            <tr key={lottery.lottery_id}>
                {console.log(' - ' + lottery.lottery_id)}
                <td>#{lottery.lottery_id}</td>
                <td className='text-center'>{lottery.terrand_round}</td>
                <td className='text-center'>{lottery.counter_player ? lottery.counter_player : '-'}</td>
                <td className='text-center'> {lottery.winning_number + ' ' + lottery.bonus_number}</td>
            </tr>
        ))
        return <>{render}</>
    }

    async function rapidoWebsocket() {
        const pusher = new Pusher('c1288646a5093e3c0c7c', {
            cluster: 'eu',
        })
        const channel = pusher.subscribe('rapido')

        // Update rapido round every x seconds
        channel.bind('state', function (data) {
            let new_rapido_state = JSON.parse(data.message)
            if (rapidoState.round != new_rapido_state.round) {
                setRapidoState({ ...new_rapido_state })
                dispatch({
                    type: 'setRapidoCurrentRound',
                    message: new_rapido_state.round,
                })
            }
        })

        return () => {
            pusher.unsubscribe('space-wager')
        }
    }

    useEffect(() => {
        getRapidoState()
        getRapidoConfig()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeBetween(state.rapidoCurrentTimeRound * 1000 - Date.now())
            if (timeBetween > 0) {
                formatTime()
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [timeBetween])

    useEffect(() => {
        if (rapidoState.round) {
            getRapidoLotteries()
        }
        /*
            TODO: show a loader | Loading current lotteries...
         */
    }, [rapidoState.round])

    useEffect(() => {
        rapidoWebsocket()
    }, [])

    return (
        <>
            <div className="w-100 py-3 pt-md-5 text-center mb-4">
                <h1
                    className="mb-0 fw-bold"
                    style={{ textShadow: '1px 1px 10px #14053b' }}
                >
                    Rapido
                </h1>
                <h2 className="my-2 fw-regular fs-6 mb-0">
                    One draw every 5 minutes
                </h2>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="col-12 text-center">
                            <div className="card rapido-card h-100">
                                <div className="card-body d-flex">
                                    <div className="align-self-center w-100 mb-0 text-white">
                                        <p className="mb-0 text-normal text-muted card-label">
                                            Round ends in
                                        </p>
                                        {(state.rapidoCurrentTimeRound &&
                                            formatTime()) ||
                                            '00:00'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 overflow-hidden mb-4 mt-5">
                            <div className="w-100 order-4 my-3 mb-2">
                                <div className="row">
                                    <div className="col-6 text-end">
                                        <button className="swiper-prev btn btn-plain pb-2">
                                            <ArrowLeft size={24} />
                                        </button>
                                    </div>
                                    <div className="col-6 text-start">
                                        <button className="swiper-next btn btn-plain pb-2">
                                            <ArrowRight size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {lotteries.length <= 1 && (
                                <div className="w-100 py-5 text-center">
                                    <div
                                        class="spinner-grow text-primary "
                                        role="status"
                                    >
                                        <span class="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            )}
                            {lotteries.length > 0 && (
                                <Swiper
                                    spaceBetween={55}
                                    style={{padding: '45px'}}
                                    navigation={{
                                        nextEl: '.swiper-next',
                                        prevEl: '.swiper-prev',
                                    }}
                                    //   modules={[Navigation, Pagination, A11y]}

                                    slidesPerView={4}
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
                                            slidesPerView: 2,
                                        },
                                    }}
                                    initialSlide={4}
                                    onSlideChange={(swiper) =>
                                        console.log(
                                            'slide change',
                                            swiper.realIndex,
                                        )
                                    }
                                    onSwiper={(swiper) => console.log(swiper)}
                                >
                                    {lotteries.length > 1 &&
                                        lotteries.map((obj, k) => {
                                            return (
                                                <SwiperSlide key={k}>
                                                    <RapidoCard
                                                        key={obj.lottery_id + k}
                                                        id={k}
                                                        dataLength={
                                                            lotteries.length
                                                        }
                                                        lotteryId={
                                                            obj.lottery_id
                                                        }
                                                        winningCombination={
                                                            obj.winning_number
                                                        }
                                                        bonusNumber={
                                                            obj.bonus_number
                                                        }
                                                        isLotteryLive={
                                                            obj.draw_time *
                                                                1000 >
                                                            Date.now()
                                                        }
                                                        drawTime={obj.draw_time}
                                                    />
                                                </SwiperSlide>
                                            )
                                        })}
                                </Swiper>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    <div className="col-6 p-4">
                        <h2 className="fs-1 fw-bold">Play for free?</h2>
                        <h4 className="fs-4 fw-normal text-muted">
                            Deposit UST in Dogether our no loss rapido
                        </h4>
                    </div>
                </div>
            </div>
            <div className="container py-5">
                <div className="row">
                    <div className="col-6 p-4">
                        <h2 className="fs-1 fw-bold">Rapido results</h2>
                        <h4 className="fs-4 fw-normal text-muted">
                            Get all results per day
                        </h4>
                    </div>
                    <div className="table-responsive">
                        <table className="table text-white">
                            <thead>
                                <tr>
                                    <th style={{ minWidth: 100 }}>draws</th>
                                    <th style={{ minWidth: 100 }} className='text-center'>Terrand round</th>
                                    <th style={{ minWidth: 100 }} className='text-center'>Numbers of players</th>
                                    <th style={{ minWidth: 100 }} className='text-center'>Results</th>
                                </tr>
                            </thead>
                            <tbody>{resultHistory()}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
