import React, { useState } from 'react'
import { useStore } from '../store'
import numeral from 'numeral'
import {
    LCDClient,
    MsgExecuteContract,
    Fee,
    WasmAPI,
    BankAPI,
} from '@terra-money/terra.js'

import {
    Trophy,
    ArrowCircleLeft,
    ArrowCircleRight,
    NumberCircleTwo,
    NumberCircleOne,
    NumberCircleThree,
    NumberCircleFour,
    NumberCircleFive,
    NumberCircleSix,
    CheckCircle,
} from 'phosphor-react'
import PriceLoader from './PriceLoader'
import WinnerRow from './WinnerRow'
const loterra_contract_address = 'terra1q2k29wwcz055q4ftx4eucsq6tg9wtulprjg75w'

export default function JackpotResults() {
    const { state, dispatch } = useStore()

    function getPrizePerRank(nr) {
        let rank = nr - 1
        return numeral(
            (state.config.prize_rank_winner_percentage[rank] *
                parseInt(state.historicalJackpot)) /
                100,
        ).format('0,0.00')
    }
    function getAltePrizePerRank(nr) {
        let rank = nr - 1

        return numeral(
            (state.config.prize_rank_winner_percentage[rank] *
                parseInt(state.historicalJackpotAlte)) /
                100,
        ).format('0,0.00')
    }
    function getRawAltePrizePerRank(nr) {
        let rank = nr - 1

        return (
            (state.config.prize_rank_winner_percentage[rank] *
                parseInt(state.historicalJackpotAlte)) /
            100
        )
    }
    function getRawPrizePerRankNet(nr) {
        let rank = nr - 1
        return (
            (state.config.prize_rank_winner_percentage[rank] *
                parseInt(state.historicalJackpot) -
                (state.config.prize_rank_winner_percentage[rank] *
                    parseInt(state.historicalJackpot) *
                    state.config.token_holder_percentage_fee_reward) /
                    100) /
            100
        )
    }

    function getPrizePerRankNet(nr) {
        let rank = nr - 1
        return numeral(
            (state.config.prize_rank_winner_percentage[rank] *
                parseInt(state.historicalJackpot) -
                (state.config.prize_rank_winner_percentage[rank] *
                    parseInt(state.historicalJackpot) *
                    state.config.token_holder_percentage_fee_reward) /
                    100) /
                100,
        ).format('0,0.00')
    }

    function getPrizePerRankAlteNet(nr) {
        let rank = nr - 1
        return numeral(
            (state.config.prize_rank_winner_percentage[rank] *
                parseInt(state.historicalJackpotAlte) -
                (state.config.prize_rank_winner_percentage[rank] *
                    parseInt(state.historicalJackpotAlte) *
                    state.config.token_holder_percentage_fee_reward) /
                    100) /
                100,
        ).format('0,0.00')
    }
    function getPrizePerRankTax(nr) {
        let rank = nr - 1
        return numeral(
            ((state.config.prize_rank_winner_percentage[rank] *
                parseInt(state.historicalJackpot)) /
                100) *
                (state.config.token_holder_percentage_fee_reward / 100),
        ).format('0,0.00')
    }
    function getPrizePerRankAlteTax(nr) {
        let rank = nr - 1
        return numeral(
            ((state.config.prize_rank_winner_percentage[rank] *
                parseInt(state.historicalJackpotAlte)) /
                100) *
                (state.config.token_holder_percentage_fee_reward / 100),
        ).format('0,0.00')
    }

    async function winnerData(type) {
        try {
            const api = new WasmAPI(state.lcd_client.apiRequester)
            let id = parseInt(
                state.historicalJackpotLotteryId == 0
                    ? state.currentLotteryId - 1
                    : state.historicalJackpotLotteryId,
            )
            if (type == 'prev' && id !== 1) {
                id = id - 1
            }
            if (
                type == 'next' &&
                state.historicalJackpotLotteryId < state.currentLotteryId &&
                state.historicalJackpotLotteryId !== 0
            ) {
                id = id + 1
            }
            if (type == 'current') {
                id = state.currentLotteryId - 1
            }
            //console.log(id)
            dispatch({ type: 'setHistoricalJackpotLotteryId', message: id })

            const winningCombination = await api.contractQuery(
                loterra_contract_address,
                {
                    winning_combination: { lottery_id: id },
                },
            )
            dispatch({
                type: 'setWinningCombination',
                message: winningCombination,
            })

            const { winners } = await api.contractQuery(
                loterra_contract_address,
                {
                    winner: {
                        lottery_id: id,
                    },
                },
            )
            dispatch({ type: 'setAllWinners', message: winners })

            const jackpotInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    jackpot: {
                        lottery_id: id,
                    },
                },
            )

            dispatch({
                type: 'setHistoricalJackpot',
                message: parseInt(jackpotInfo) / 1000000,
            })

            const jackpotAlteInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    jackpot_alte: {
                        lottery_id: id,
                    },
                },
            )
            dispatch({
                type: 'setHistoricalJackpotAlte',
                message: parseInt(jackpotAlteInfo) / 1000000,
            })
        } catch (e) {
            console.log(e, 'no found')
        }
    }

    function getRawNumberOfRankWinners(nr) {
        let nrWinners = 0
        state.allWinners.map((obj) => {
            obj.claims.ranks.map((r) => {
                if (r == nr) {
                    nrWinners++
                }
            })
        })
        return nrWinners
    }

    function getNumberOfRankWinners(nr) {
        let nrWinners = 0
        state.allWinners.map((obj) => {
            obj.claims.ranks.map((r) => {
                if (r == nr) {
                    nrWinners++
                }
            })
        })
        return (
            <>
                <span
                    style={{
                        background: '#ff36ff',
                        padding: '5px',
                        borderRadius: '3px',
                        marginRight: '5px',
                    }}
                >
                    #{nr}
                </span>
                <span
                    style={{
                        color: '#4ee19b',
                    }}
                >
                    <Trophy
                        style={{
                            color: '#4ee19b',
                            position: 'relative',
                            top: '-2px',
                            marginRight: '4px',
                        }}
                        size={21}
                    />
                    {nrWinners}
                </span>
            </>
        )
    }

    return (
        <div className="container" style={{ marginTop: '7rem' }}>
            <div className="card lota-card">
                <div className="card-header text-center">
                    <div className="card-header-icon">
                        <Trophy size={90} color="#20FF93" />
                    </div>
                    <h3>
                        Latest Jackpot Results
                        {state.historicalJackpotLotteryId !== 0 &&
                            state.historicalJackpotLotteryId !==
                                state.currentLotteryId - 1 && (
                                <small
                                    className="d-block"
                                    style={{
                                        fontSize: '14px',
                                        color: '#ff36ff',
                                    }}
                                >
                                    Results from Lottery{' '}
                                    <strong>
                                        #{state.historicalJackpotLotteryId}
                                    </strong>
                                </small>
                            )}
                    </h3>
                    <div className="btn-group w-100">
                        <button
                            className="btn btn-default"
                            disabled={
                                state.historicalJackpotLotteryId == 1
                                    ? true
                                    : false
                            }
                            onClick={() => winnerData('prev')}
                        >
                            <ArrowCircleLeft size={24} />
                        </button>
                        <button
                            className="btn btn-default"
                            disabled={
                                state.historicalJackpotLotteryId == 0 ||
                                state.historicalJackpotLotteryId ==
                                    state.currentLotteryId - 1
                                    ? true
                                    : false
                            }
                            onClick={() => winnerData('current')}
                        >
                            Latest
                        </button>
                        <button
                            className="btn btn-default"
                            disabled={
                                state.historicalJackpotLotteryId == 0 ||
                                state.historicalJackpotLotteryId ==
                                    state.currentLotteryId - 1
                                    ? true
                                    : false
                            }
                            onClick={() => winnerData('next')}
                        >
                            <ArrowCircleRight size={24} />
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="w-100 text-center latest-combination">
                        <h4 style={{ color: '#ff36ff' }}>
                            Winning combination
                        </h4>
                        <p>
                            {state.winningCombination ? (
                                state.winningCombination
                                    .split('')
                                    .map((obj, i) => {
                                        return <span key={i + 'c'}>{obj}</span>
                                    })
                            ) : (
                                <PriceLoader />
                            )}
                        </p>
                    </div>
                    <h4 className="mt-4">Rewards</h4>
                    <div className="table-responsive">
                        <table className="table text-white mb-3">
                            <thead>
                                <tr>
                                    <th>Ranks</th>
                                    <th>Symbols</th>
                                    <th>Gross prizes</th>
                                    <th>Net prizes</th>
                                    <th>LOTA tax</th>
                                </tr>
                            </thead>
                            {state.config.prize_rank_winner_percentage && (
                                <tbody>
                                    <tr>
                                        <th
                                            scope="row"
                                            className="text-white"
                                            style={{
                                                minWidth: '130px',
                                            }}
                                        >
                                            {getNumberOfRankWinners(1)}
                                            {getRawNumberOfRankWinners(1) !==
                                                0 && (
                                                <div className="prize-info">
                                                    <p className="prize-title">
                                                        NET PRIZES
                                                    </p>
                                                    <p className="ust-prize">
                                                        {getRawNumberOfRankWinners(
                                                            1,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawPrizePerRankNet(
                                                                    1,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        1,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>UST</span>
                                                    </p>
                                                    <p className="alte-prize">
                                                        +{' '}
                                                        {getRawNumberOfRankWinners(
                                                            1,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawAltePrizePerRank(
                                                                    1,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        1,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>ALTE</span>
                                                    </p>
                                                </div>
                                            )}
                                        </th>
                                        <td
                                            style={{
                                                color: '#FF36FF',
                                                minWidth: '130px',
                                            }}
                                        >
                                            6 Symbols
                                            <div className="position-info">
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                            </div>
                                        </td>
                                        <td
                                            style={{
                                                minWidth: '130px',
                                            }}
                                        >
                                            {getPrizePerRank(1)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                + {getAltePrizePerRank(1)}
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankNet(1)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                +{' '}
                                                {
                                                    getAltePrizePerRank(
                                                        1,
                                                    ) /*getPrizePerRankAlteNet(1)*/
                                                }
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankTax(1)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                {getPrizePerRankAlteTax(1)}
                                                ALTE (TAX COMING SOON)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="text-white">
                                            {getNumberOfRankWinners(2)}
                                            {getRawNumberOfRankWinners(2) !==
                                                0 && (
                                                <div className="prize-info">
                                                    <p className="prize-title">
                                                        NET PRIZES
                                                    </p>
                                                    <p className="ust-prize">
                                                        {getRawNumberOfRankWinners(
                                                            2,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawPrizePerRankNet(
                                                                    2,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        2,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>UST</span>
                                                    </p>
                                                    <p className="alte-prize">
                                                        +{' '}
                                                        {getRawNumberOfRankWinners(
                                                            2,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawAltePrizePerRank(
                                                                    2,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        2,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>ALTE</span>
                                                    </p>
                                                </div>
                                            )}
                                        </th>
                                        <td
                                            style={{
                                                color: '#FF36FF',
                                                minWidth: '100px',
                                            }}
                                        >
                                            5 Symbols
                                            <div className="position-info">
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <NumberCircleSix
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {getPrizePerRank(2)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                + {getAltePrizePerRank(2)}
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankNet(2)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                +{' '}
                                                {
                                                    getAltePrizePerRank(
                                                        2,
                                                    ) /*getPrizePerRankAlteNet(2)*/
                                                }
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankTax(2)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                {getPrizePerRankAlteTax(2)}
                                                ALTE (TAX COMING SOON)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="text-white">
                                            {getNumberOfRankWinners(3)}
                                            {getRawNumberOfRankWinners(3) !==
                                                0 && (
                                                <div className="prize-info">
                                                    <p className="prize-title">
                                                        NET PRIZES
                                                    </p>
                                                    <p className="ust-prize">
                                                        {getRawNumberOfRankWinners(
                                                            3,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawPrizePerRankNet(
                                                                    3,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        3,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>UST</span>
                                                    </p>
                                                    <p className="alte-prize">
                                                        +{' '}
                                                        {getRawNumberOfRankWinners(
                                                            3,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawAltePrizePerRank(
                                                                    3,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        3,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>ALTE</span>
                                                    </p>
                                                </div>
                                            )}
                                        </th>
                                        <td
                                            style={{
                                                color: '#FF36FF',
                                                minWidth: '100px',
                                            }}
                                        >
                                            4 Symbols
                                            <div className="position-info">
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <NumberCircleFive
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleSix
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {getPrizePerRank(3)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                + {getAltePrizePerRank(3)}
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankNet(3)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                +{' '}
                                                {
                                                    getAltePrizePerRank(
                                                        3,
                                                    ) /*getPrizePerRankAlteNet(3)*/
                                                }
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankTax(3)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                {getPrizePerRankAlteTax(3)}
                                                ALTE (TAX COMING SOON)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="text-white">
                                            {getNumberOfRankWinners(4)}
                                            {getRawNumberOfRankWinners(4) !==
                                                0 && (
                                                <div className="prize-info">
                                                    <p className="prize-title">
                                                        NET PRIZES
                                                    </p>
                                                    <p className="ust-prize">
                                                        {getRawNumberOfRankWinners(
                                                            4,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawPrizePerRankNet(
                                                                    4,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        4,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>UST</span>
                                                    </p>
                                                    <p className="alte-prize">
                                                        +{' '}
                                                        {getRawNumberOfRankWinners(
                                                            4,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawAltePrizePerRank(
                                                                    4,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        4,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>ALTE</span>
                                                    </p>
                                                </div>
                                            )}
                                        </th>
                                        <td
                                            style={{
                                                color: '#FF36FF',
                                                minWidth: '100px',
                                            }}
                                        >
                                            3 Symbols
                                            <div className="position-info">
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <NumberCircleFour
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleFive
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleSix
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {getPrizePerRank(4)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                + {getAltePrizePerRank(4)}
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankNet(4)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                +{' '}
                                                {
                                                    getAltePrizePerRank(
                                                        4,
                                                    ) /*getPrizePerRankAlteNet(4)*/
                                                }
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankTax(4)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                {getPrizePerRankAlteTax(4)}
                                                ALTE (TAX COMING SOON)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="text-white">
                                            {getNumberOfRankWinners(5)}
                                            {getRawNumberOfRankWinners(5) !==
                                                0 && (
                                                <div className="prize-info">
                                                    <p className="prize-title">
                                                        NET PRIZES
                                                    </p>
                                                    <p className="ust-prize">
                                                        {getRawNumberOfRankWinners(
                                                            5,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawPrizePerRankNet(
                                                                    5,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        5,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>UST</span>
                                                    </p>
                                                    <p className="alte-prize">
                                                        +{' '}
                                                        {getRawNumberOfRankWinners(
                                                            5,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawAltePrizePerRank(
                                                                    5,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        5,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>ALTE</span>
                                                    </p>
                                                </div>
                                            )}
                                        </th>
                                        <td
                                            style={{
                                                color: '#FF36FF',
                                                minWidth: '100px',
                                            }}
                                        >
                                            2 Symbols
                                            <div className="position-info">
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <NumberCircleThree
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleFour
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleFive
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleSix
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {getPrizePerRank(5)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                + {getAltePrizePerRank(5)}
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankNet(5)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                +{' '}
                                                {
                                                    getAltePrizePerRank(
                                                        5,
                                                    ) /*getPrizePerRankAlteNet(5)*/
                                                }
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankTax(5)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                {getPrizePerRankAlteTax(5)}
                                                ALTE (TAX COMING SOON)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="text-white">
                                            {getNumberOfRankWinners(6)}
                                            {getRawNumberOfRankWinners(6) !==
                                                0 && (
                                                <div className="prize-info">
                                                    <p className="prize-title">
                                                        NET PRIZES
                                                    </p>
                                                    <p className="ust-prize">
                                                        {getRawNumberOfRankWinners(
                                                            6,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawPrizePerRankNet(
                                                                    6,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        6,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>UST</span>
                                                    </p>
                                                    <p className="alte-prize">
                                                        +{' '}
                                                        {getRawNumberOfRankWinners(
                                                            6,
                                                        ) +
                                                            'x ' +
                                                            numeral(
                                                                getRawAltePrizePerRank(
                                                                    6,
                                                                ) /
                                                                    getRawNumberOfRankWinners(
                                                                        6,
                                                                    ),
                                                            ).format('0,0.00')}
                                                        <span>ALTE</span>
                                                    </p>
                                                </div>
                                            )}
                                        </th>
                                        <td
                                            style={{
                                                color: '#FF36FF',
                                                minWidth: '100px',
                                            }}
                                        >
                                            1 Symbols
                                            <div className="position-info">
                                                <CheckCircle
                                                    style={{
                                                        opacity: 1,
                                                        color: '#4ee19b',
                                                    }}
                                                    size={18}
                                                />
                                                <NumberCircleTwo
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleThree
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleFour
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleFive
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                                <NumberCircleSix
                                                    style={{ opacity: 0.7 }}
                                                    size={18}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {getPrizePerRank(6)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                + {getAltePrizePerRank(6)}
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankNet(6)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                +{' '}
                                                {
                                                    getAltePrizePerRank(
                                                        6,
                                                    ) /*getPrizePerRankAlteNet(6)*/
                                                }
                                                <span>ALTE</span>
                                            </span>
                                        </td>
                                        <td>
                                            {getPrizePerRankTax(6)}
                                            <span>UST</span>
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    display: 'block',
                                                    color: '#dcef14',
                                                    opacity: 1,
                                                }}
                                            >
                                                {getPrizePerRankAlteTax(6)}
                                                ALTE (TAX COMING SOON)
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                    <h4 className="mt-4">Winners</h4>
                    <div
                        className="table-responsive"
                        style={{ height: '500px' }}
                    >
                        <table className="table text-white winners-table">
                            <thead>
                                <tr>
                                    <th scope="col">Rank</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Collected</th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.allWinners &&
                                    state.allWinners.map((obj, key) => {
                                        return <WinnerRow a={key} obj={obj} />
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
