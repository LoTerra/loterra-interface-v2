import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'
import numeral from 'numeral'
import { MsgExecuteContract } from '@terra-money/terra.js'
import toast from 'react-hot-toast'
import { Lightning, Star } from 'phosphor-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import useSound from 'use-sound'
import successSfx from './sounds/hero_decorative-celebration-02.mp3';
import buttonSfx from './sounds/ui_tap-variant-01.mp3';

export default function RapidoCardFooter(props) {

    const { state, dispatch } = useStore()

    //Sounds
    const [playSuccess] = useSound(successSfx);   
    const [playButtonClick] = useSound(buttonSfx);

    const {
        enterDraw,
        multiplier,
        nrOfDraws,
        fourNumbers,
        oneNumber,
        winningCombination,
        isLotteryLive,
        userGames,
        loadMore,
        isLastItem,
        lotteryId,
        bonusNumber,
        switchToDefault,
        lotteryStats
    } = props

    const validateTheTicket = (round) => {
        playButtonClick()
        let fourNumbersFilter = fourNumbers.filter(e => e != "")
        let oneNumberFilter = oneNumber.filter(e => e != "")
        if (fourNumbersFilter.length < 4) {
            console.log('Please select 4 blue numbers')
            toast.error('Please select 4 blue numbers')
            return
        } else if (oneNumberFilter.length < 1) {
            console.log('Please select 1 yellow star')
            toast.error('Please select 1 yellow star')
            return
        } else if (multiplier < 1) {
            console.log('Please select a multiplier (1UST / 2UST / 5UST')
            toast.error('Please select a multiplier (1UST / 2UST / 5UST')
            return
        } else if (nrOfDraws < 1) {
            console.log('Please select a number of draw')
            toast.error('Please select a number of draw')
            return
        }

        let msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.rapidoAddress,
            {
                register: {
                    numbers: [...fourNumbers, ...oneNumber],
                    multiplier: String(parseInt(multiplier) * 1000000),
                    live_round: parseInt(nrOfDraws),
                    //address: None
                },
            },
            { uluna: (multiplier * 5000) * nrOfDraws * 1000000 },
        )
        state.wallet
            .post({
                msgs: [msg],
            })
            .then((e) => {
                if (e.success) {
                    playSuccess()
                    toast.success('Ticket succesfully validated!')
                    switchToDefault(true)
                    dispatch({
                        type: 'setIsBuyingRapidoTicket',
                        message: true,
                    })
                } else {
                    toast.error('Something went wrong, please try again')
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e)
            })
    }

    const checkLottoNumbers = (game_id) => {
        dispatch({
            type: 'setIsBuyingRapidoTicket',
            message: true,
        })
        let msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.rapidoAddress,
            {
                collect: {
                    round: lotteryId,
                    player: state.wallet.walletAddress,
                    game_id: [game_id],
                },
            },
        )

        state.wallet
            .post({
                msgs: [msg],
            })
            .then((e) => {
                if (e.success) {
                    toast.success('Successfully checked lottery numbers!')
                } else {
                    toast.error('Something went wrong, please try again')
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
    }

    return (
        <>
            {(fourNumbers.length > 0 || oneNumber.length > 0) &&
            isLotteryLive ? (
                <div
                    className="card-footer pb-3"                   
                >
                    <div className="row">
                        <div className="col-12 text-start mt-1">
                            <p className="fs-6 fw-bold">Receipt</p>
                        </div>
                        {/* <div className="col-6 text-start d-flex">
                            <p className="mb-0 align-self-center text-muted">
                                Combination
                            </p>
                        </div>
                        <div className="col-6 text-end">
                            <div className="col-12 mb-2">
                                {[1, 2, 3, 4, 5].map((obj, k) => {
                                    return (
                                        <span
                                            key={k}
                                            className={
                                                'rapido-combi-nr' +
                                                (obj == 5 ? ' g' : '')
                                            }
                                        >
                                            <span
                                                className="d-block"
                                                style={{
                                                    background: '#7a5ec7',
                                                    fontSize: '13px',
                                                    fontWeight: 300,
                                                }}
                                            >
                                                {obj}
                                            </span>
                                            {obj <= 4 ? (
                                                fourNumbers[obj - 1] ? (
                                                    fourNumbers[obj - 1]
                                                ) : (
                                                    <Lightning
                                                        size={15}
                                                        style={{
                                                            position:
                                                                'relative',
                                                            top: '-1px',
                                                            marginRight: 1,
                                                        }}
                                                    />
                                                )
                                            ) : oneNumber[0] ? (
                                                oneNumber[0]
                                            ) : (
                                                <Star
                                                    size={15}
                                                    style={{
                                                        position: 'relative',
                                                        top: '-1px',
                                                        marginRight: 1,
                                                    }}
                                                />
                                            )}
                                        </span>
                                    )
                                })}
                            </div>
                        </div> */}
                        <div className="col-6 text-start">
                            <p>Cost</p>
                        </div>
                        <div className="col-6 text-end">
                            <p className="fw-bold">
                                {numeral((multiplier * 5000)  * nrOfDraws).format('0,0')} LUNA
                            </p>
                        </div>
                        <div className="col-8 text-start">
                            <p>Potential winnings per draw</p>
                        </div>
                        <div className="col-4 text-end">
                            <p className="fw-bold">
                                {numeral(100_000 * multiplier).format('0,0')} UST
                            </p>
                        </div>
                        <div col-8 text-start>
                            <p>Before starting take a look at <a href="https://docs.loterra.io/save-luna">https://docs.loterra.io/save-luna</a></p>
                        </div>

                        <div className="col-12">
                            {state.wallet &&
                                state.wallet.hasOwnProperty('walletAddress') &&
                                winningCombination == null && (
                                    <button
                                        onClick={() => validateTheTicket(1)}
                                        className="btn btn-special w-100"
                                        style={{
                                            background: '#0046ff',
                                        }}
                                    >
                                        Enter To Win
                                    </button>

                                )}
                            {state.wallet &&
                                !state.wallet.hasOwnProperty('walletAddress') &&
                                winningCombination == null && (
                                    <button
                                        className="btn btn-special w-100"
                                        style={{ background: '#0046ff' }}
                                        onClick={() =>
                                            toast.error(
                                                'Please connect your wallet',
                                            )
                                        }
                                    >
                                        Connect wallet
                                    </button>
                                )}
                        </div>

                    </div>
                </div>
            ) : (
                <div>
                    {/*
                        GAME RESPONSE SAMPLE
                        {
                            "number": [
                            3,
                            10,
                            9,
                            13
                            ],
                            "bonus": 6,
                            "multiplier": "1",
                            "resolved": false,
                            "game_id": 0
                        }*/}
                    {userGames.length != 0 && winningCombination != null && lotteryStats && lotteryStats[lotteryId] !== undefined && lotteryStats[lotteryId].counter_player != null? (
                        <>
                            <p className="fs-6 fw-bold text-center mb-2">
                                Your plays
                            </p>
                            <div style={{height: "150px", overflow:'hidden'}}>
                                <Swiper
                                    nested={true}
                                    grabCursor= {true}
                                    style={{"width": '100%'}}
                                    breakpointsbase="container"
                                    direction="vertical"
                                    spaceBetween={55}
                                    navigation={{
                                        nextEl: '.swiper-next-in-card',
                                        prevEl: '.swiper-prev-in-card',
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
                                    onSlideChange={(swiper) =>
                                        console.log(
                                            'slide change',
                                            swiper.realIndex,
                                        )
                                    }
                                    onSwiper={(swiper) => console.log(swiper)}
                                >
                                    {userGames.length > 0 &&
                                        userGames.map((game, k) => {
                                            return (
                                                <SwiperSlide key={k}>
                                                    <div key={game.game_id + k}>
                                                        <div>
                                                            <div className="btn-holder w-100 pt-4">
                                                                <span>
                                                                    #
                                                                    {game.game_id +
                                                                        1}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        'nr-btn smaller' +
                                                                        (game
                                                                            .number[0] ==
                                                                        winningCombination[0]
                                                                            ? ' active'
                                                                            : '')
                                                                    }
                                                                    style={{
                                                                        padding:
                                                                            '10px',
                                                                    }}
                                                                >
                                                                    {game.number[0]}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        'nr-btn smaller' +
                                                                        (game
                                                                            .number[1] ==
                                                                        winningCombination[1]
                                                                            ? ' active'
                                                                            : '')
                                                                    }
                                                                    style={{
                                                                        padding:
                                                                            '10px',
                                                                    }}
                                                                >
                                                                    {game.number[1]}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        'nr-btn smaller' +
                                                                        (game
                                                                            .number[2] ==
                                                                        winningCombination[2]
                                                                            ? ' active'
                                                                            : '')
                                                                    }
                                                                    style={{
                                                                        padding:
                                                                            '10px',
                                                                    }}
                                                                >
                                                                    {game.number[2]}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        'nr-btn smaller' +
                                                                        (game
                                                                            .number[3] ==
                                                                        winningCombination[3]
                                                                            ? ' active'
                                                                            : '')
                                                                    }
                                                                    style={{
                                                                        padding:
                                                                            '10px',
                                                                    }}
                                                                >
                                                                    {game.number[3]}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        'nr-btn smaller' +
                                                                        (game.bonus ==
                                                                        bonusNumber
                                                                            ? ' active-g'
                                                                            : '')
                                                                    }
                                                                    style={{
                                                                        padding:
                                                                            '10px',
                                                                    }}
                                                                >
                                                                    {game.bonus}
                                                                </span>
                                                            </div>

                                                            <div className="w-100 px-4 mt-4">
                                                                <button
                                                                    className="btn btn-default w-100"
                                                                    style={{
                                                                        background:
                                                                            'rgb(122, 94, 199)',
                                                                    }}
                                                                    disabled={
                                                                        game.resolved
                                                                    }
                                                                    onClick={() =>
                                                                        checkLottoNumbers(
                                                                            game.game_id,
                                                                        )
                                                                    }
                                                                >
                                                                    {' '}
                                                                    Resolve lotto
                                                                    numbers{' '}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })}
                                    <SwiperSlide key={"button-load-more"}>
                                        <button
                                            className="btn btn-default w-100 mb-4 mt-2 btn-sm"
                                            disabled={isLastItem}
                                            onClick={() =>
                                                loadMore(
                                                    userGames[userGames.length - 1]
                                                        .game_id,
                                                )
                                            }
                                        >
                                            {' '}
                                            Load More{' '}
                                        </button>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </>
    )
}
