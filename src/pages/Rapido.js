import { Head } from 'react-static'
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useStore } from '../store'
import RapidoCard from '../components/Rapido/RapidoCard'
import {
    ArrowsClockwise,
    CheckCircle,
    Clock,
    Gear,
    HourglassSimpleHigh,
    Lightning,
    Star,
    Wallet,
    Warning,
    X,
} from 'phosphor-react'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { ArrowLeft, ArrowRight } from 'phosphor-react'
import { MsgExecuteContract, WasmAPI } from '@terra-money/terra.js'
import Pusher from 'pusher-js'
import toast, { Toaster } from 'react-hot-toast'
import CountUp from 'react-countup'
import axios from 'axios'

export default () => {
    const { state, dispatch } = useStore()
    const [rapidoState, setRapidoState] = useState({})
    const [lotteries, setlotteries] = useState([])
    const [allLotteriesHistory, setAllLotteriesHistory] = useState([])
    const [timeBetween, setTimeBetween] = useState(0)
    const [gameStats, setGameStats] = useState([])
    const [games, setGames] = useState([])
    const [winningNumber, setWinningNumber] = useState([])
    const [loaderGames, setLoaderGames] = useState(false)
    const [loaderResolveAll, setLoaderResolveAll] = useState(false)
    const [lotteryStats, setLotteryStats] = useState(null)
    const [loaderUserGames, setLoaderUserGames] = useState(false)

    //Custom wallet address for resolve_all
    const [customWalletAddress, setCustomWalletAddress] = useState('')
    const [customWalletField, setCustomWalletField] = useState(false)

    const [config, setConfig] = useState({
        denom: 'uusd',
        frequency: 300,
        fee_collector: '0.05',
        fee_collector_address: 'terra1umd70qd4jv686wjrsnk92uxgewca3805dxd46p',
        fee_collector_terrand: '0.001',
        fee_collector_terrand_address:
            'terra1a62jxn3hh54fa5slan4dkd7u6v4nzgz3pjhygm',
    })

    const api = new WasmAPI(state.lcd_client.apiRequester)

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

            let promiseMap = lotteries_state.map(async (lottery) => {
                let query = {
                    lottery_stats: { round: lottery.lottery_id },
                }
                let lottery_stats = await api.contractQuery(
                    state.rapidoAddress,
                    query,
                )
                return lottery_stats
            })

            Promise.all(promiseMap).then((e) => {
                let stats = {}
                e.map((d) => {
                    stats[d.lottery_stats_id] = d
                })
                setLotteryStats(stats)
            })
        } catch (e) {
            console.log(e)
        }
    }

    // async function getLotteryId(lottery_id){
    //     try {
    //         // Prepare query
    //         let query = {
    //             lottery_state: { round: lottery_id },
    //         }
    //
    //         // Query to state smart contract
    //         let lottery_state = await api.contractQuery(
    //             state.rapidoAddress,
    //             query,
    //         )
    //
    //         if (lottery_state.length > 0) {
    //             let copy_games = [...games]
    //             let x = copy_games.filter(
    //                 (e) => e.lottery_id != game_stats_id,
    //             )
    //
    //             let new_arr = [...x, ...res_games]
    //             setGames(new_arr)
    //
    //             // get_user_combination(lotteries_state)
    //         }
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    async function getRapidoLotteriesPagination(start_after) {
        try {
            // Prepare query
            let query = {
                lottery_state: { limit: 5 },
            }
            // Add start after to get only last 5 elements
            console.log(start_after)
            if (start_after) {
                query.lotteries_state.start_after = start_after
            }
            // Query to state smart contract
            let lotteries_state = await api.contractQuery(
                state.rapidoAddress,
                query,
            )

            if (lotteries_state.length > 0) {
                let new_arr = [...allLotteriesHistory, ...lotteries_state]
                new_arr.sort((a, b) => b.lottery_id - a.lottery_id)
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
                game_stats: { player: state.wallet.walletAddress, limit: 5 },
            }
            // Add start after to get only last 5 elements
            console.log(start_after)
            if (start_after) {
                query.game_stats.start_after = start_after
            }
            // Query to state smart contract
            let game_stats = await api.contractQuery(state.rapidoAddress, query)

            console.log(game_stats)
            if (game_stats.length > 0) {
                //new_arr.sort((a,b) => b.lottery_id - a.lottery_id)
                // Set the array of lotteries
                if (start_after) {
                    setGameStats([...gameStats, ...game_stats])
                } else {
                    setGameStats(game_stats)
                }
                // get_user_combination(lotteries_state)

                let resolve_promise = []
                game_stats.map((game) => {
                    let start_after = null
                    let loop = true
                    let games_el = []
                    let promise_copy_games = new Promise(
                        async (resolve, reject) => {
                            while (loop) {
                                // Prepare query
                                let query = {
                                    games: {
                                        limit: 5,
                                        round: game.game_stats_id,
                                        player: state.wallet.walletAddress,
                                    },
                                }
                                // Add start after to get pagination
                                if (start_after != null) {
                                    query.games.start_after = start_after
                                }
                                console.log(start_after)

                                // Query to state smart contract
                                let res_games = await api.contractQuery(
                                    state.rapidoAddress,
                                    query,
                                )

                                if (res_games.length > 0) {
                                    games_el = [...games_el, ...res_games]
                                    start_after =
                                        res_games[res_games.length - 1].game_id
                                    // get_user_combination(lotteries_state)
                                } else {
                                    loop = false
                                    start_after = null
                                }
                            }
                            resolve(games_el)
                        },
                    )

                    resolve_promise.push(promise_copy_games)

                    let promise_lottery_winning = new Promise(
                        async (resolve, reject) => {
                            //Get lottery info
                            let lottery_query = {
                                lottery_state: {
                                    round: game.game_stats_id,
                                },
                            }
                            let lottery_info = await api.contractQuery(
                                state.rapidoAddress,
                                lottery_query,
                            )

                            if (lottery_info) {
                                //setWinningNumber(new_arr)
                                resolve(lottery_info)
                            }
                        },
                    )
                    resolve_promise.push(promise_lottery_winning)
                })
                Promise.all(resolve_promise).then((w) => {
                    console.log(w)
                    let new_games_arr = []
                    let new_winning_obj = {}
                    let dataPromise = w.map(async (e) => {
                        if (Array.isArray(e)) {
                            new_games_arr = [...new_games_arr, ...e]
                            return new_games_arr
                        } else {
                            if (e.winning_number) {
                                const res2 = await axios.get(
                                    `https://drand.cloudflare.com/public/${e.terrand_round}`,
                                )
                                const { randomness } = res2.data
                                let newWinningNumber = [
                                    ...e.winning_number,
                                    e.bonus_number,
                                    e.terrand_round,
                                    randomness,
                                ]
                                console.log(newWinningNumber)
                                let new_arr = {
                                    ...winningNumber,
                                    ...new_winning_obj,
                                }
                                new_arr[e.lottery_id] = newWinningNumber
                                new_winning_obj = new_arr
                                return new_winning_obj
                            }
                        }
                    })

                    Promise.all(dataPromise).then((data) => {
                        setGames([...games, ...new_games_arr])
                        setWinningNumber(new_winning_obj)
                    })

                    //console.log(games)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    // async function getGames(game_stats_id) {
    //     setLoaderGames(true)
    //
    //     try {
    //         let start_after = null
    //         let loop = true
    //
    //         let copy_games = new Promise(async (resolve, reject ) => {
    //             let games_el = []
    //             while (loop) {
    //                 // Prepare query
    //                 let query = {
    //                     games: {
    //                         limit: 5,
    //                         round: game_stats_id,
    //                         player: state.wallet.walletAddress,
    //                     },
    //                 }
    //                 // Add start after to get pagination
    //                 if (start_after != null) {
    //                     query.games.start_after = start_after
    //                 }
    //                 console.log(start_after)
    //
    //                 // Query to state smart contract
    //                 let res_games = await api.contractQuery(
    //                     state.rapidoAddress,
    //                     query,
    //                 )
    //                 console.log(query)
    //                 if (res_games.length > 0 ) {
    //
    //                     games_el = [...games_el, ...res_games]
    //                     start_after = res_games[res_games.length - 1].game_id
    //                     // get_user_combination(lotteries_state)
    //                 } else {
    //                     loop = false
    //                     start_after = null
    //                 }
    //             }
    //             resolve(games_el)
    //         }).then((res )=> {
    //             setGames([...games, ...res])
    //             setLoaderGames(false)
    //         })
    //
    //         try {
    //             //Get lottery info
    //             let lottery_query = {
    //                 lottery_state: {
    //                     round: game_stats_id
    //                 }
    //             }
    //             let lottery_info = await api.contractQuery(
    //                 state.rapidoAddress,
    //                 lottery_query,
    //             )
    //
    //             if (lottery_info){
    //                 let newWinningNumber = [...lottery_info.winning_number, lottery_info.bonus_number]
    //                 let new_arr = {
    //                     ...winningNumber
    //                 }
    //                 new_arr[game_stats_id] = newWinningNumber
    //                 setWinningNumber(new_arr)
    //             }
    //         }catch (e) {
    //             console.log("no lottery round")
    //         }
    //
    //
    //     } catch (e) {
    //         console.log(e)
    //     }
    //
    // }

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
            if (seconds < 0 && minutes < 0) {
                format_message = '00:00'
            } else {
                format_message = format_minutes + ':' + format_seconds
            }

            return (
                <>
                    <HourglassSimpleHigh
                        size={25}
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
        let render = gameStats.map((game_stats, k) => (
            <tr key={k}>
                <td>
                    <strong>#{game_stats.game_stats_id}</strong>
                </td>
                <td className="text-center">{game_stats.total_ticket}</td>
                {/*<td className='text-center'>{lottery.counter_player ? lottery.counter_player : '-'}</td>*/}

                {/*<td className='text-center'>*/}
                {/*    { winningNumber[game_stats.game_stats_id] ? <>*/}
                {/*        <a style={{textDecoration: 'None'}} href={`https://drand.cloudflare.com/public/${winningNumber[game_stats.game_stats_id][5]}`}>*/}
                {/*            <span style={{padding: "10px"}}>{winningNumber[game_stats.game_stats_id][6][0]}</span>*/}
                {/*            <span style={{padding: "10px"}}>{winningNumber[game_stats.game_stats_id][6][1]}</span>*/}
                {/*            <span style={{padding: "10px"}}>{winningNumber[game_stats.game_stats_id][6][2]}</span>*/}
                {/*            <span style={{padding: "10px"}}>{winningNumber[game_stats.game_stats_id][6][3]}</span>*/}
                {/*            <span style={{padding: "10px"}}>{winningNumber[game_stats.game_stats_id][6][63]}</span>*/}
                {/*        </a>*/}
                {/*    </> : <></> }*/}
                {/*    </td>*/}

                <td className="text-center rapido-table-results">
                    {winningNumber[game_stats.game_stats_id] ? (
                        <div className="btn-holder">
                            <span className={'nr-btn smaller'}>
                                {winningNumber[game_stats.game_stats_id][0]}
                            </span>
                            <span className={'nr-btn smaller'}>
                                {winningNumber[game_stats.game_stats_id][1]}
                            </span>
                            <span className={'nr-btn smaller'}>
                                {winningNumber[game_stats.game_stats_id][2]}
                            </span>
                            <span className={'nr-btn smaller'}>
                                {winningNumber[game_stats.game_stats_id][3]}
                            </span>
                            <span className={'nr-btn smaller bonus'}>
                                {winningNumber[game_stats.game_stats_id][4]}
                            </span>
                        </div>
                    ) : game_stats.game_stats_id >= state.rapidoCurrentRound ? (
                        <>
                            {' '}
                            <span>Lotto still in progress...</span>
                        </>
                    ) : (
                        <></>
                    )}
                </td>
                <td className="text-center">
                    <div
                        style={{ flex: 'column' }}
                        className="rapido-table-results"
                    >
                        {/*{games.filter(*/}
                        {/*    (a) => a.lottery_id == game_stats.game_stats_id,*/}
                        {/*).length == 0 && (*/}
                        {/*    <button*/}
                        {/*        disabled={loaderGames}*/}
                        {/*        className="btn btn-default btn-sm"*/}
                        {/*        onClick={() =>*/}
                        {/*            getGames(game_stats.game_stats_id)*/}
                        {/*        }*/}
                        {/*    >*/}
                        {/*        <ArrowsClockwise*/}
                        {/*            size={14}*/}
                        {/*            className="position-icon me-1"*/}
                        {/*        />*/}
                        {/*        Show details*/}
                        {/*    </button>*/}
                        {/*)}*/}

                        {games.map((game, k) => {
                            if (game.lottery_id == game_stats.game_stats_id) {
                                return (
                                    <div
                                        key={k}
                                        style={{ marginBottom: '5px' }}
                                    >
                                        <span className="multiplier-table">
                                            x{game.multiplier}
                                        </span>
                                        <span
                                            className={
                                                'nr-btn smaller ' +
                                                (!winningNumber[
                                                    game_stats.game_stats_id
                                                ] ||
                                                game.number[0] !=
                                                    winningNumber[
                                                        game_stats.game_stats_id
                                                    ][0]
                                                    ? 'normal'
                                                    : 'active')
                                            }
                                        >
                                            {!winningNumber[
                                                game_stats.game_stats_id
                                            ] ||
                                            game.number[0] !=
                                                winningNumber[
                                                    game_stats.game_stats_id
                                                ][0] ? (
                                                game.number[0]
                                            ) : (
                                                <p>
                                                    {game.number[0]}{' '}
                                                    <Lightning
                                                        size={18}
                                                        fill={'#f2d230'}
                                                        weight={'fill'}
                                                    />
                                                </p>
                                            )}
                                        </span>
                                        <span
                                            className={
                                                'nr-btn smaller ' +
                                                (!winningNumber[
                                                    game_stats.game_stats_id
                                                ] ||
                                                game.number[1] !=
                                                    winningNumber[
                                                        game_stats.game_stats_id
                                                    ][1]
                                                    ? 'normal'
                                                    : 'active')
                                            }
                                        >
                                            {!winningNumber[
                                                game_stats.game_stats_id
                                            ] ||
                                            game.number[1] !=
                                                winningNumber[
                                                    game_stats.game_stats_id
                                                ][1] ? (
                                                game.number[1]
                                            ) : (
                                                <p>
                                                    {game.number[1]}{' '}
                                                    <Lightning
                                                        size={18}
                                                        fill={'#f2d230'}
                                                        weight={'fill'}
                                                    />
                                                </p>
                                            )}
                                        </span>
                                        <span
                                            className={
                                                'nr-btn smaller ' +
                                                (!winningNumber[
                                                    game_stats.game_stats_id
                                                ] ||
                                                game.number[2] !=
                                                    winningNumber[
                                                        game_stats.game_stats_id
                                                    ][2]
                                                    ? 'normal'
                                                    : 'active')
                                            }
                                        >
                                            {!winningNumber[
                                                game_stats.game_stats_id
                                            ] ||
                                            game.number[2] !=
                                                winningNumber[
                                                    game_stats.game_stats_id
                                                ][2] ? (
                                                game.number[2]
                                            ) : (
                                                <p>
                                                    {game.number[2]}{' '}
                                                    <Lightning
                                                        size={18}
                                                        fill={'#f2d230'}
                                                        weight={'fill'}
                                                    />
                                                </p>
                                            )}
                                        </span>
                                        <span
                                            className={
                                                'nr-btn smaller ' +
                                                (!winningNumber[
                                                    game_stats.game_stats_id
                                                ] ||
                                                game.number[3] !=
                                                    winningNumber[
                                                        game_stats.game_stats_id
                                                    ][3]
                                                    ? 'normal'
                                                    : 'active')
                                            }
                                        >
                                            {!winningNumber[
                                                game_stats.game_stats_id
                                            ] ||
                                            game.number[3] !=
                                                winningNumber[
                                                    game_stats.game_stats_id
                                                ][3] ? (
                                                game.number[3]
                                            ) : (
                                                <p>
                                                    {game.number[3]}{' '}
                                                    <Lightning
                                                        size={18}
                                                        fill={'#f2d230'}
                                                        weight={'fill'}
                                                    />
                                                </p>
                                            )}
                                        </span>
                                        <span
                                            className={
                                                'nr-btn smaller bonus ' +
                                                (!winningNumber[
                                                    game_stats.game_stats_id
                                                ] ||
                                                game.number[4] !=
                                                    winningNumber[
                                                        game_stats.game_stats_id
                                                    ][4]
                                                    ? 'normal'
                                                    : 'active')
                                            }
                                        >
                                            {!winningNumber[
                                                game_stats.game_stats_id
                                            ] ||
                                            game.bonus !=
                                                winningNumber[
                                                    game_stats.game_stats_id
                                                ][4] ? (
                                                game.bonus
                                            ) : (
                                                <p>
                                                    {game.bonus}{' '}
                                                    <Star
                                                        size={18}
                                                        fill={'#048abf'}
                                                        weight={'fill'}
                                                    />
                                                </p>
                                            )}
                                        </span>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </td>
                {/*<td>*/}
                {/*    {games.filter(*/}
                {/*        (a) => a.lottery_id == game_stats.game_stats_id,*/}
                {/*    ).length == 0 && (*/}
                {/*        <button*/}
                {/*            className="btn btn-default btn-sm"*/}
                {/*            onClick={() =>*/}
                {/*                getLotteryId(game_stats.game_stats_id)*/}
                {/*            }*/}
                {/*        >*/}
                {/*            <ArrowsClockwise*/}
                {/*                size={14}*/}
                {/*                className="position-icon me-1"*/}
                {/*            />*/}
                {/*            Show winning combination*/}
                {/*        </button>*/}
                {/*    )}*/}
                {/*</td>*/}
            </tr>
        ))

        return <>{render}</>
    }

    function paytable() {
        let render = (
            <tr>
                <td>1</td>
                <td>4 + 1 star</td>
                <td>1 / </td>
                <td>$ 10,000</td>
                <td>$ 20,000</td>
                <td>$ 50,000</td>
            </tr>
        )

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
        setLoaderResolveAll(true)
        let all_games = []

        //Check if custom wallet address
        let resolveWallet = state.wallet.walletAddress
        if (customWalletAddress !== '') {
            resolveWallet = customWalletAddress
        }

        let game_stats_promise = await new Promise(async (resolve, reject) => {
            try {
                let start_after = ''
                let loop = true

                while (loop) {
                    await new Promise(function (re, reject) {
                        setInterval(re, 1000)
                    })
                    // Prepare query
                    let query = {
                        game_stats: {
                            player: resolveWallet,
                            limit: 30,
                        },
                    }

                    // Add start after to get only last 5 elements
                    if (start_after) {
                        query.game_stats.start_after = start_after
                    }

                    // Query to state smart contract
                    let game_stats = await api.contractQuery(
                        state.rapidoAddress,
                        query,
                    )

                    if (game_stats.length > 0) {
                        all_games = [...all_games, ...game_stats]
                        // get_user_combination(lotteries_state)
                        start_after =
                            game_stats[game_stats.length - 1].game_stats_id
                    } else {
                        loop = false
                        start_after = ''
                    }
                }
                resolve(all_games)
            } catch (e) {
                console.log(e)
            }
        }).then((res) => {
            //let all_promises = []
            let data_prom = []
            //let all_msgs = []
            let all_promises_go = []
            //let all_promises = new Promise((resolve, reject) => {
            res.map(async (game) => {
                if (game.game_stats_id < state.rapidoCurrentRound) {
                    // Prepare query
                    let query = {
                        games: {
                            limit: 30,
                            round: game.game_stats_id,
                            player: resolveWallet,
                        },
                    }
                    try {
                        let data_game = []
                        let start_after = null
                        let loop = true

                        let games_promise = await new Promise(
                            async (resolve, reject) => {
                                while (loop) {
                                    await new Promise(function (re, reject) {
                                        setInterval(re, 1000)
                                    })
                                    // Add start after to get pagination
                                    if (start_after != null) {
                                        query.games.start_after = start_after
                                    }

                                    // Query to state smart contract
                                    let res_games = await api.contractQuery(
                                        state.rapidoAddress,
                                        query,
                                    )

                                    if (res_games.length > 0) {
                                        let new_res_games = []
                                        res_games.map((g) => {
                                            if (!g.resolved)
                                                new_res_games.push(g.game_id)
                                        })
                                        data_game = [
                                            ...data_game,
                                            ...new_res_games,
                                        ]
                                        start_after =
                                            res_games[res_games.length - 1]
                                                .game_id
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
                                                player: resolveWallet,
                                                game_id: data_game,
                                            },
                                        },
                                    )
                                    resolve(msg)
                                    //resolve(msg)
                                }
                                resolve()
                            },
                        )
                        //console.log(data_game)

                        //data_prom.push(games_promise)
                        console.log(games_promise)
                        //return games_promise
                        //data_prom.push(games_promise)
                        if (games_promise !== undefined) {
                            all_promises_go.push(games_promise)
                        }
                        //console.log(games_promise)
                    } catch (e) {
                        console.log(e)
                    }
                }
            })

            //resolve(filtered)
            //})
            Promise.all([all_promises_go]).then(async (result) => {
                await new Promise(function (re, reject) {
                    setInterval(re, 10000)
                })

                if (result[0].length > 0) {
                    state.wallet
                        .post({
                            msgs: result[0],
                        })
                        .then((e) => {
                            if (e.success) {
                                toast.success('Successfully resolved!')
                            } else {
                                toast.error(
                                    'Something went wrong, please try again',
                                )
                                console.log(e)
                            }
                            dispatch({
                                type: 'setLoaderResolveLottoNumber',
                                message: true,
                            })
                        })
                        .catch((e) => {
                            console.log(e)
                        })
                } else {
                    toast.error(
                        'Nothing to resolve, enter in lottery before trying again',
                    )
                }
                // time the transaction to be approved on blockchain
                setTimeout(() => {
                    setLoaderResolveAll(false)
                }, 6000)
            })
        })

        // //let all_promises = []
        // let data_prom = []
        // //let all_msgs = []
        // Promise.all([game_stats_promise]).then((res) => {
        //     let all_promises = new Promise((resolve, reject) => {
        //         let prom = res[0].map(async (game) => {
        //             await new Promise(function(re, reject) {setInterval(re, 1000);})
        //             if (game.game_stats_id < state.rapidoCurrentRound) {
        //                 // Prepare query
        //                 let query = {
        //                     games: {
        //                         limit: 30,
        //                         round: game.game_stats_id,
        //                         player: "terra1r2s4yakf2pp3qzut0lm5lqk6twx8rj3jrucgrp",
        //                     },
        //                 }
        //                 try {
        //                     let data_game = []
        //                     let start_after = null
        //                     let loop = true
        //
        //                     let games_promise = await new Promise(
        //                         async (resolve, reject) => {
        //                             while (loop) {
        //                                 await new Promise(function(re, reject) {setInterval(re, 1000)})
        //                                 // Add start after to get pagination
        //                                 if (start_after != null) {
        //                                     query.games.start_after = start_after
        //                                 }
        //
        //                                 // Query to state smart contract
        //                                 let res_games = await api.contractQuery(
        //                                     state.rapidoAddress,
        //                                     query,
        //                                 )
        //
        //                                 if (res_games.length > 0) {
        //                                     let new_res_games = []
        //                                     res_games.map((g) => {
        //                                         if (!g.resolved)
        //                                             new_res_games.push(g.game_id)
        //                                     })
        //                                     data_game = [
        //                                         ...data_game,
        //                                         ...new_res_games,
        //                                     ]
        //                                     start_after =
        //                                         res_games[res_games.length - 1]
        //                                             .game_id
        //                                     // get_user_combination(lotteries_state)
        //                                 } else {
        //                                     loop = false
        //                                     start_after = null
        //                                 }
        //                             }
        //                             if (data_game.length != 0) {
        //                                 let msg = new MsgExecuteContract(
        //                                     state.wallet.walletAddress,
        //                                     state.rapidoAddress,
        //                                     {
        //                                         collect: {
        //                                             round: game.game_stats_id,
        //                                             player: "terra1r2s4yakf2pp3qzut0lm5lqk6twx8rj3jrucgrp",
        //                                             game_id: data_game,
        //                                         },
        //                                     },
        //                                 )
        //                                 resolve(msg)
        //                                 //resolve(msg)
        //                             }
        //                             resolve()
        //                         },
        //                     )
        //                     //console.log(data_game)
        //
        //                     //data_prom.push(games_promise)
        //                     console.log(games_promise)
        //                     //return games_promise
        //                     data_prom.push(games_promise)
        //                     //console.log(games_promise)
        //                 } catch (e) {
        //                     console.log(e)
        //                 }
        //             }
        //         })
        //         let filtered = data_prom.filter((element) => {
        //             console.log("element")
        //             console.log(element)
        //             return element !== undefined
        //         })
        //         resolve(filtered)
        //     })
        //     Promise.all([all_promises]).then( (result) => {
        //
        //         let new_arr = result[0]
        //         console.log("result")
        //         console.log(result)
        //
        //         // console.log(filtered)
        //
        //         if (new_arr.length > 0) {
        //             state.wallet
        //                 .post({
        //                     msgs: new_arr,
        //                 })
        //                 .then((e) => {
        //                     if (e.success) {
        //                         toast.success('Successfully resolved!')
        //                     } else {
        //                         toast.error(
        //                             'Something went wrong, please try again',
        //                         )
        //                         console.log(e)
        //                     }
        //                     dispatch({
        //                         type: 'setLoaderResolveLottoNumber',
        //                         message: true,
        //                     })
        //                 })
        //                 .catch((e) => {
        //                     console.log(e)
        //                 })
        //         }else {
        //             toast.error(
        //                 'Nothing to resolve, enter in lottery before trying again',
        //             )
        //         }
        //         // time the transaction to be approved on blockchain
        //         setTimeout(() => {
        //             setLoaderResolveAll(false)
        //         }, 6000)
        //     })
        // })

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
        }
        /*
            TODO: show a loader | Loading current lotteries...
         */
    }, [rapidoState.round, state.rapidoCurrentRound])

    useEffect(() => {
        setGameStats([])
        setGames([])
        setWinningNumber({})
        //getRapidoLotteriesPagination(rapidoState.round - 6)
        if (state.wallet.walletAddress) {
            getGameStatsPagination()
        }
    }, [state.wallet.walletAddress])

    useEffect(() => {
        dispatch({
            type: 'setIsBuyingRapidoTicket',
            message: false,
        })
    }, [state.isBuyingRapidoTicket])

    useEffect(() => {
        rapidoWebsocket()
    }, [])

    // useEffect(()=>{
    //         resolve_all()
    //
    // }, [state.wallet.walletAddress])

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <title>
                    #SaveLuna | Burn LUNA and win up to UST 1,000,000 every 5
                    minutes!
                </title>
                <meta
                    property="og:title"
                    content="#SaveLuna | Burn LUNA and win up to UST 1,000,000 every 5 minutes!"
                />
                <meta
                    property="og:description"
                    content="#SaveLuna is the game of successive draws which offers a draw every 5 minutes! Try to find your 5 numbers among the combination of 4 blue and 1 yellow star numbers drawn at random and win up to UST 1,000,000!*"
                />
                <meta
                    property="og:image"
                    content="https://save-luna.netlify.app/SaveLuna.png"
                />
                <meta property="og:type" content="website" />
                <meta
                    property="twitter:title"
                    content="#SaveLuna | Burn LUNA and win up to UST 1,000,000 every 5 minutes!"
                />
                <meta property="twitter:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://save-luna.netlify.app/SaveLuna.png"
                />
                <meta
                    property="twitter:description"
                    content="#SaveLuna is the game of successive draws which offers a draw every 5 minutes! Try to find your 5 numbers among the combination of 4 blue and 1 yellow star numbers drawn at random and win up to UST 1,000,000!*"
                />
            </Head>

            <div className="w-100 py-1 py-md-5 text-center mb-0 mb-md-2" style={{background:'linear-gradient(45deg, #2559db, transparent)'}}>
                <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h2
                            className="mb-0 text-10xl xs:text-13xl xs:-mt-0 font-semibold mb-3"
                            style={{ color: '#fff' }}
                        >
                            Burn 🔥 LUNAC and win up to LUNAC{' '}
                            <span style={{ color: '#F2D230', fontWeight: 700 }}>
                                <CountUp
                                    start={0}
                                    end={50000000}
                                    separator={','}
                                />
                            </span>{' '}
                            every 5 minutes
                        </h2>
                        <img src="/SaveLuna.png" className={'img-fluid'} style={{height:'250px'}}/>
                    </div>
                    <div className="col-md-6">
                        <p className='fw-bold fs-3'>How it works?</p>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <div className="w-50 align-items-start text-start">
                                <ol>
                                    <li>
                                        chose 4 repeatable numbers and 1 bonus
                                    </li>
                                    <li>
                                        chose the multiplier to increase your
                                        prizes
                                    </li>
                                    <li>
                                        chose how much round you want your
                                        ticket live
                                    </li>
                                    <li>
                                        pay in LUNA and contribute to save LUNA
                                        community initiative. *50% burn 🔥 / 50% jackpot
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
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
                        <div className="col-12 overflow-hidden mb-4">
                            <div className="w-100 order-4 mb-2">
                                <div className="row">
                                    <div className="col-6 text-start text-md-end">
                                        <button className="swiper-prev btn-rapido-nav pb-2">
                                            <ArrowLeft size={24} />
                                        </button>
                                    </div>
                                    <div className="col-6 text-end text-md-start">
                                        <button className="swiper-next btn-rapido-nav pb-2">
                                            <ArrowRight size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {lotteries.length <= 1 && !lotteryStats && (
                                <div className="w-100 py-5 text-center">
                                    <div
                                        style={{ color: '#BF046B' }}
                                        className="spinner-grow"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            )}
                            {lotteries.length > 0 && lotteryStats && (
                                <Swiper
                                    threshold={10}
                                    spaceBetween={35}
                                    style={{
                                        padding: '10px 15px',
                                        marginTop: '25px',
                                    }}
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
                                            spaceBetween: 10,
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
                                    initialSlide={lotteries.length}
                                    onSlideChange={(swiper) =>
                                        console.log(
                                            'slide change',
                                            swiper.realIndex,
                                        )
                                    }
                                    onSwiper={(swiper) => console.log(swiper)}
                                >
                                    {lotteries.length > 0 &&
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
                                                        lotteryStats={
                                                            lotteryStats
                                                        }
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

            {/*<div className="container py-5">*/}
            {/*    <div className="row">*/}
            {/*        <div className="col-6 p-4">*/}
            {/*            <h2 className="fs-1 fw-bold">Play for free?</h2>*/}
            {/*            <h4 className="fs-4 fw-normal text-muted">*/}
            {/*                Deposit UST in Dogether our no loss rapido*/}
            {/*            </h4>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="container py-5">
                <div className="row">
                    <div className="col-md-6 p-md-4 text-center text-md-start">
                        <h2 className="fs-1 fw-bold">Burn games</h2>
                        <h4 className="fs-4 fw-normal">Get all your games</h4>
                    </div>
                    <div className="col-md-6 text-center text-md-end pt-2 pt-md-5">
                        <button
                            className="btn btn-default btn-sm position-relative me-2"
                            onClick={() => {
                                setCustomWalletField(!customWalletField)
                                setCustomWalletAddress('')
                            }}
                        >
                            {customWalletField ? (
                                <X size={18} />
                            ) : (
                                <>
                                    <span>
                                        <Gear size={18} /> Custom address
                                    </span>
                                </>
                            )}
                        </button>
                        <button
                            disabled={loaderResolveAll}
                            className="btn btn-default btn-sm"
                            onClick={() => resolve_all()}
                        >
                            {loaderResolveAll && (
                                <div
                                    className="spinner-border spinner-sm"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Loading...
                                    </span>
                                </div>
                            )}
                            Try resolve all games
                        </button>
                        {customWalletField && (
                            <div className="input-group mt-1">
                                <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                >
                                    <Wallet size={18} color={'#8372bf'} />
                                </span>
                                <input
                                    className="form-control"
                                    value={customWalletAddress}
                                    placeholder={
                                        'Custom resolve wallet address'
                                    }
                                    onChange={(e) =>
                                        setCustomWalletAddress(e.target.value)
                                    }
                                />
                                {customWalletAddress != '' && (
                                    <span
                                        className="input-group-text"
                                        style={{ backgroundColor: '#10003b' }}
                                        id="basic-addon1"
                                        onClick={() =>
                                            setCustomWalletAddress('')
                                        }
                                    >
                                        <X size={18} color={'#8372bf'} />
                                    </span>
                                )}
                            </div>
                        )}
                        <span className="small d-block mt-1">
                            Resolving all can take some minutes
                        </span>
                    </div>
                    <div className="table-responsive">
                        <table className="table text-white">
                            <thead>
                                <tr>
                                    <th style={{ minWidth: 100 }}>draws</th>
                                    <th
                                        style={{ minWidth: 150 }}
                                        className="text-center"
                                    >
                                        Tickets played
                                    </th>
                                    {/*<th style={{ minWidth: 100 }} className='text-center'>Numbers of players</th>*/}
                                    {/*<th*/}
                                    {/*    className="text-center"*/}
                                    {/*>*/}
                                    {/*   Provably fair*/}
                                    {/*</th>*/}
                                    <th
                                        style={{ minWidth: 250 }}
                                        className="text-center"
                                    >
                                        Winning combo
                                    </th>
                                    <th
                                        style={{ minWidth: 250 }}
                                        className="text-center"
                                    >
                                        My numbers
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{resultHistory()}</tbody>
                        </table>
                        <button
                            className="w-100 mt-2 btn btn-sm btn-default"
                            onClick={() =>
                                getGameStatsPagination(
                                    gameStats[gameStats.length - 1]
                                        .game_stats_id,
                                )
                            }
                        >
                            Load more
                        </button>
                    </div>
                </div>
            </div>
            <Toaster />
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-6 p-md-4 text-center text-md-start">
                        <h3 className="fs-3 fw-bold">
                            How prize works? #SaveLuna
                        </h3>
                        <p>
                            50% of the tickets sales in LUNA are sent to the
                            burn address *
                            <a href="https://twitter.com/stablekwon/status/1528004028851859456?s=21&t=NuW2CVd96aLPKZ18nbVu5w">
                                terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu{' '}
                            </a>
                            50% are for jackpot solvency. On
                            prize winning there is no tax. Tax are only applied on ticket purchase fees for LOTA stakers,
                            this tax can be flattened staking LOTA.
                        </p>
                        <p className="fs-4 fw-normal text-muted mb-5">
                            *The process is transparent and the transaction can
                            be find on blockchain
                        </p>
                        <h2 className="fs-1 fw-bold">Paytable</h2>
                        <h4 className="fs-4 fw-normal text-muted">
                            List of payouts
                        </h4>
                    </div>
                    <div className="table-responsive">
                        <table className="table text-white">
                            <thead>
                                <tr>
                                <th style={{ minWidth: 50 }}>Rank</th>
                                <th style={{ minWidth: 100 }} className="text-center">Score</th>
                                <th style={{ minWidth: 100 }} className="text-center">Odds</th>
                                <th style={{ minWidth: 50 }} className="text-center">LUNAC 1,000</th>
                                <th style={{ minWidth: 50 }} className="text-center">LUNAC 5,000</th>
                                <th style={{ minWidth: 50 }} className="text-center">LUNAC 10,000</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#1</td>
                                    <td className="text-center">
                                        4 (exact position) + 1 star
                                    </td>
                                    <td className="text-center">1 / 524,288</td>
                                    <td className="text-center">LUNAC 10,000,000</td>
                                    <td className="text-center">LUNAC 50,000,000</td>
                                    <td className="text-center">LUNAC 100,000,000</td>
                                </tr>
                                <tr>
                                    <td>#2</td>
                                    <td className="text-center">4 (exact position)</td>
                                    <td className="text-center">1 / 74,898.29</td>
                                    <td className="text-center">LUNAC 1,000,000</td>
                                    <td className="text-center">LUNAC 5,000,000</td>
                                    <td className="text-center">LUNAC 10,000,000</td>
                                </tr>
                                <tr>
                                    <td>#3</td>
                                    <td className="text-center">3 (exact position) + 1 star </td>
                                    <td className="text-center">1 / 8,738.13</td>
                                    <td className="text-center">LUNAC 150,000</td>
                                    <td className="text-center">LUNAC 750,000</td>
                                    <td className="text-center">LUNAC 1,500,000</td>
                                </tr>
                                <tr>
                                    <td>#4</td>
                                    <td className="text-center">
                                        3 (exact position){' '}
                                    </td>
                                    <td className="text-center">1 / 1,248.3</td>
                                    <td className="text-center">LUNAC 50,000</td>
                                    <td className="text-center">LUNAC 250,000</td>
                                    <td className="text-center">LUNAC 500,000</td>
                                </tr>
                                <tr>
                                    <td>#5</td>
                                    <td className="text-center">
                                        2 (exact position) + 1 star{' '}
                                    </td>
                                    <td className="text-center">1 / 388.36</td>
                                    <td className="text-center">LUNAC 30,000</td>
                                    <td className="text-center">LUNAC 150,000</td>
                                    <td className="text-center">LUNAC 300,000</td>
                                </tr>
                                <tr>
                                    <td>#6</td>
                                    <td className="text-center">
                                        2 (exact position){' '}
                                    </td>
                                    <td className="text-center">1 / 55.48</td>
                                    <td className="text-center">LUNAC 10,000</td>
                                    <td className="text-center">LUNAC 50,000</td>
                                    <td className="text-center">LUNAC 100,000</td>
                                </tr>
                                <tr>
                                    <td>#7</td>
                                    <td className="text-center">
                                        1 (exact position) + 1 star{' '}
                                    </td>
                                    <td className="text-center">1 / 38.84</td>
                                    <td className="text-center">LUNAC 5,000</td>
                                    <td className="text-center">LUNAC 25,000</td>
                                    <td className="text-center">LUNAC 50,000</td>
                                </tr>

                                <tr>
                                    <td>#8</td>
                                    <td className="text-center">1 star</td>
                                    <td className="text-center">1 / 10.36</td>
                                    <td className="text-center">LUNAC 2,000</td>
                                    <td className="text-center">LUNAC 10,000</td>
                                    <td className="text-center">LUNAC 50,000</td>
                                </tr>
                                <tr>
                                    <td>#9</td>
                                    <td className="text-center">
                                        1 (exact position)
                                    </td>
                                    <td className="text-center">1 / 5.55</td>
                                    <td className="text-center">LUNAC 500</td>
                                    <td className="text-center">LUNAC 2,500</td>
                                    <td className="text-center">LUNAC 5,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
