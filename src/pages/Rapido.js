import { Head } from 'react-static'
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useStore } from '../store'
import RapidoCard from '../components/Rapido/RapidoCard'
import { ArrowsClockwise, Clock } from 'phosphor-react'
import SwiperCore, {
    Navigation,
    Pagination,
    Autoplay,
    EffectFade,
} from 'swiper'



import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { ArrowLeft, ArrowRight } from 'phosphor-react'
import {MsgExecuteContract, WasmAPI} from '@terra-money/terra.js'
import Pusher from 'pusher-js'
import toast, { Toaster } from "react-hot-toast";

export default () => {
    const { state, dispatch } = useStore()
    SwiperCore.use([Navigation, Pagination, Autoplay, EffectFade])
    const [rapidoState, setRapidoState] = useState({})
    const [lotteries, setlotteries] = useState([])
    const [allLotteriesHistory, setAllLotteriesHistory] = useState([])
    const [timeBetween, setTimeBetween] = useState(0)
    const [gameStats, setGameStats] = useState([])
    const [games, setGames] = useState([])


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

            // Set the array of lotteries
            setlotteries([...lotteries_state])

            /*
                TODO: dismiss the prediction loader here
             */
        } catch (e) {
            console.log(e)
        }
    }


    async function getRapidoLotteriesPagination(start_after) {
        try {
            // Prepare query
            let query = {
                lotteries_state: { limit: 5},
            }
            // Add start after to get only last 5 elements
            console.log(start_after)
            if (start_after) {
                query.lotteries_state.start_after =
                    start_after
            }
            // Query to state smart contract
            let lotteries_state = await api.contractQuery(
                state.rapidoAddress,
                query,
            )

            if (lotteries_state.length > 0){
                let new_arr = [...allLotteriesHistory, ...lotteries_state]
                new_arr.sort((a,b) => b.lottery_id - a.lottery_id)
                // Set the array of lotteries
                setAllLotteriesHistory(new_arr)
                // get_user_combination(lotteries_state)
            }


            /*
                TODO: dismiss the prediction loader here
             */
        } catch (e) {
            console.log(e)
        }
    }

    async function getGameStatsPagination(start_after) {
        try {
            // Prepare query
            let query = {
                game_stats: { player: state.wallet.walletAddress, limit: 5},
            }
            // Add start after to get only last 5 elements
            console.log(start_after)
            if (start_after) {
                query.game_stats.start_after =
                    start_after
            }
            // Query to state smart contract
            let game_stats = await api.contractQuery(
                state.rapidoAddress,
                query,
            )

            console.log(game_stats)
            if (game_stats.length > 0){
                //new_arr.sort((a,b) => b.lottery_id - a.lottery_id)
                // Set the array of lotteries
                if (start_after){
                    setGameStats([...gameStats, ...game_stats])
                }else{
                    setGameStats(game_stats)
                }

                // get_user_combination(lotteries_state)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function getGames(game_stats_id) {
        try {

            let start_after = null
            let loop = true
            while (loop){
                // Prepare query
                let query = {
                    games: {
                        limit: 5,
                        round: game_stats_id,
                        player: state.wallet.walletAddress,
                    },
                }
                // Add start after to get pagination
                if (start_after != null) {
                    query.games.start_after =
                        start_after
                }
                console.log(start_after)

                // Query to state smart contract
                let res_games = await api.contractQuery(
                    state.rapidoAddress,
                    query,
                )
                console.log(query)
                if (res_games.length > 0){

                    let copy_games = [...games]
                    let x = copy_games.filter(e => e.lottery_id != game_stats_id)

                    let new_arr = [...x, ...res_games];
                    setGames(new_arr)

                    start_after = res_games[res_games.length - 1].game_id
                    // get_user_combination(lotteries_state)
                }else {
                    loop = false
                    start_after = null
                }

            }
        } catch (e) {
            console.log(e)
        }
    }


    // async function get_user_combination(lotteries) {
    //     const default_limit = 5
    //     if (state.wallet.walletAddress){
    //         lotteries.map( lottery =>{
    //             let query = {
    //                 games: {
    //                     round: lottery_id,
    //                     player: state.wallet.walletAddress,
    //                     limit: default_limit,
    //                 }
    //             }
    //
    //             let rapido_games = await api.contractQuery(state.rapidoAddress, query)
    //
    //             if (rapido_games.length != 0) {
    //                 console.log(rapido_games)
    //                 //setUserGames([...userGames, ...rapido_games])
    //
    //             }
    //         })
    //     }
    // }

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

        let render = gameStats.map( (game_stats, k) => (
            <tr key={k}>
                <td><strong>#{game_stats.game_stats_id}</strong></td>
                <td className='text-center'>{game_stats.total_ticket}</td>
                {/*<td className='text-center'>{lottery.counter_player ? lottery.counter_player : '-'}</td>*/}
                {/* <td className='text-center'> */}
                    
                    {/*<div className="btn-holder">*/}
                    {/*    <span className={*/}
                    {/*        'nr-btn smaller'*/}
                    {/*    } style={{padding: "10px"}}>{lottery.winning_number[0]}</span>*/}
                    {/*    <span className={*/}
                    {/*        'nr-btn smaller'*/}
                    {/*    } style={{padding: "10px"}}>{lottery.winning_number[1]}</span>*/}
                    {/*    <span className={*/}
                    {/*        'nr-btn smaller'*/}
                    {/*    } style={{padding: "10px"}}>{lottery.winning_number[2]}</span>*/}
                    {/*    <span className={*/}
                    {/*        'nr-btn smaller'*/}
                    {/*    } style={{padding: "10px"}}>{lottery.winning_number[3]}</span>*/}
                    {/*    <span className={*/}
                    {/*        'nr-btn smaller'*/}
                    {/*    } style={{padding: "10px"}}>{lottery.bonus_number}</span>*/}
                    {/*</div>*/}


                {/* </td> */}
                <td className="text-center">
                    <div style={{flex: "column"}} className="rapido-table-results">
                        { games.filter(a => a.lottery_id == game_stats.game_stats_id).length == 0 &&
                            <button className="btn btn-default btn-sm" onClick={() => getGames(game_stats.game_stats_id)}><ArrowsClockwise size={14} className="position-icon me-1"/>Get results</button>
                        }
                        {
                            games.map((game, k) => {
                                if (game.lottery_id == game_stats.game_stats_id){
                                    return (
                                        <div key={game.game_id + game.lottery_id}>
                                            <span className="multiplier-table">x{game.multiplier}</span>
                                            <span className="nr-btn smaller">{game.number[0]}</span>
                                            <span className="nr-btn smaller">{game.number[1]}</span>
                                            <span className="nr-btn smaller">{game.number[2]}</span>
                                            <span className="nr-btn smaller">{game.number[3]}</span>
                                            <span className="nr-btn smaller bonus">{game.bonus}</span>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </td>

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

    async function resolve_all() {

        let all_games = [];
        let game_stats_promise = new Promise(async (resolve, reject) => {
            try {
                let start_after = ''
                let loop = true
                while (loop) {
                    // Prepare query
                    let query = {
                        game_stats: {player: state.wallet.walletAddress, limit: 30},
                    }

                    // Add start after to get only last 5 elements
                    if (start_after) {
                        query.game_stats.start_after =
                            start_after
                    }


                    // Query to state smart contract
                    let game_stats = await api.contractQuery(
                        state.rapidoAddress,
                        query,
                    )

                    if (game_stats.length > 0) {
                        all_games = [...all_games, ...game_stats]
                        // get_user_combination(lotteries_state)
                        start_after = game_stats[game_stats.length - 1].game_stats_id
                    } else {
                        loop = false
                        start_after = ''
                    }

                }
                resolve(all_games)
            } catch (e) {
                console.log(e)
            }
        })

        let all_promises = []
        let all_msgs= []
        Promise.all([game_stats_promise]).then((res) => {

            res[0].map(async (game) => {
                if (game.game_stats_id < state.rapidoCurrentRound) {

                    // Prepare query
                    let query = {
                        games: {
                            limit: 30,
                            round: game.game_stats_id,
                            player: state.wallet.walletAddress,
                        },
                    }
                    try {
                        let data_game = []
                        let start_after = null
                        let loop = true

                        let games_promise = new Promise(async (resolve, reject) => {
                            while (loop) {

                                // Add start after to get pagination
                                if (start_after != null) {
                                    query.games.start_after =
                                        start_after
                                }

                                // Query to state smart contract
                                let res_games = await api.contractQuery(
                                    state.rapidoAddress,
                                    query,
                                )

                                if (res_games.length > 0) {

                                    let new_res_games = []
                                    res_games.map(g => {
                                        if (!g.resolved)
                                            new_res_games.push(g.game_id)
                                    })
                                    data_game = [...data_game, ...new_res_games]
                                    start_after = res_games[res_games.length - 1].game_id
                                    // get_user_combination(lotteries_state)
                                } else {
                                    loop = false
                                    start_after = null
                                }
                            }
                            if (data_game.length != 0) {
                                let msg = new MsgExecuteContract(
                                    state.wallet.walletAddress,
                                    state.rapidoAddress,
                                    {
                                        collect: {
                                            round: game.game_stats_id,
                                            player: state.wallet.walletAddress,
                                            game_id: data_game,
                                        },
                                    },
                                )
                                resolve(msg)
                                console.log(msg)
                            }
                            resolve()
                        })

                        all_promises.push(games_promise)

                    } catch (e) {
                        console.log(e)
                    }
                }

            })

            Promise.all(all_promises).then((result) => {
                let new_arr = result
                let filtered = new_arr.filter(element => {
                    return element !== undefined;
                });

                if (filtered.length > 0){
                    state.wallet
                        .post({
                            msgs: filtered,
                        })
                        .then((e) => {
                            if (e.success) {
                                toast.success('Successfully resolved!')
                            } else {
                                toast.error('Something went wrong, please try again')
                                console.log(e)
                            }
                        })
                        .catch((e) => {
                            console.log(e)
                        })
                }


            })
        })
        // state.wallet
        //     .post({
        //         msgs: _all_msgs,
        //     })
        //     .then((e) => {
        //         if (e.success) {
        //             toast.success('Successfully resolved!')
        //         } else {
        //             toast.error('Something went wrong, please try again')
        //             console.log(e)
        //         }
        //     })
        //     .catch((e) => {
        //         console.log(e)
        //     })


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
            //getRapidoLotteriesPagination(rapidoState.round - 6)
            if (state.wallet.walletAddress){
                getGameStatsPagination()
            }else {
                setGameStats([])
            }
        }
        /*
            TODO: show a loader | Loading current lotteries...
         */
    }, [rapidoState.round, state.wallet.walletAddress])

    useEffect(() => {
        rapidoWebsocket()
    }, [])

    // useEffect(()=>{
    //         resolve_all()
    //
    // }, [state.wallet.walletAddress])

    return (
        <>
            <div className="w-100 py-3 pt-md-5 text-center mb-2">
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
                        {/* <div className="col-12 text-center">
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
                        </div> */}
                        <div className="col-12 overflow-hidden mb-4 mt-2">
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
                                        className="spinner-grow text-primary "
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            )}
                            {lotteries.length > 0 && (
                                <Swiper
                                    spaceBetween={55}
                                    style={{padding: '45px 25px'}}
                                    navigation={{
                                        nextEl: '.swiper-next',
                                        prevEl: '.swiper-prev',
                                    }}
                                    //   modules={[Navigation, Pagination, A11y]}

                                    slidesPerView={1}
                                    breakpoints={{
                                        // when window width is >= 640px
                                        1: {
                                            slidesPerView: 1,
                                            spaceBetween:10,
                                        },
                                        // when window width is >= 768px
                                        768: {
                                            slidesPerView: 1,
                                            spaceBetween: 55,
                                        },
                                        1000: {
                                            slidesPerView: 1,
                                        },
                                        1500: {
                                            slidesPerView: 1,
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
                                                        formatTime={formatTime}
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
                    <div className="col-md-6 p-md-4 text-center text-md-start">
                        <h2 className="fs-1 fw-bold">Rapido games</h2>
                        <h4 className="fs-4 fw-normal text-muted">
                            Get all your games
                        </h4>
                    </div>
                    <div className="col-md-6 text-center text-md-end pt-2 pt-md-5">
                        <button className="btn btn-default btn-sm" onClick={ () => resolve_all()}> Resolve all</button>
                        <span className="small d-block text-muted">Can take some minutes</span>
                    </div>
                    <div className="table-responsive">
                        <table className="table text-white">
                            <thead>
                                <tr>
                                    <th style={{ minWidth: 100 }}>draws</th>
                                    <th style={{ minWidth: 150 }} className='text-center'>Tickets played</th>
                                    {/*<th style={{ minWidth: 100 }} className='text-center'>Numbers of players</th>*/}
                                    <th style={{ minWidth: 250 }} className='text-center'>Results</th>
                                </tr>
                            </thead>
                            <tbody>{resultHistory()}</tbody>
                        </table>
                        <button className="w-100 mt-2 btn btn-sm btn-default text-muted" onClick={()=>getGameStatsPagination(gameStats[gameStats.length - 1].game_stats_id)}>Load more</button>
                    </div>
                </div>
            </div>
            <Toaster/>
        </>
    )
}
