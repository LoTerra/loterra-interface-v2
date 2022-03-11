import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    X,
    Ticket,
    UserCircle,
    Info,
    TwitterLogo,
    TelegramLogo,
    WhatsappLogo,
    ArrowCircleLeft,
    ArrowCircleRight,
} from 'phosphor-react'
import {
    LCDClient,
    MsgExecuteContract,
    Fee,
    WasmAPI,
} from '@terra-money/terra.js'
import { useStore } from '../store'
import SocialShare from './SocialShare'
import PriceLoader from './PriceLoader'
import numeral from 'numeral'

let useConnectedWallet = {}
if (typeof document !== 'undefined') {
    useConnectedWallet =
        require('@terra-money/wallet-provider').useConnectedWallet
}

export default function UserModal(props) {
    const [result, setResult] = useState('')
    const [claimed, setClaimed] = useState(false)
    const [ticketLoad, setTicketLoad] = useState()
    const { state, dispatch } = useStore()

    let connectedWallet = ''
    if (typeof document !== 'undefined') {
        connectedWallet = useConnectedWallet()
    }

    const { open, toggleModal } = props

    const isPlayer = state.allPlayers.includes(connectedWallet.walletAddress)
    const isWinner = state.allWinners.includes(connectedWallet.walletAddress)

    const timeStampHalf =
        state.config.block_time_play * 1000 -
        state.config.every_block_time_play / 2
    const addToGas = 5300
    const obj = new Fee(300_000, { uusd: 273600 + addToGas })
    function claim() {
        const msg = new MsgExecuteContract(
            connectedWallet.walletAddress,
            state.loterraContractAddress,
            {
                claim: {},
            },
        )

        connectedWallet
            .post({
                msgs: [msg],
                fee: obj,
                // gasPrices: obj.gasPrices(),
                // gasAdjustment: 1.5,
            })
            .then((e) => {
                if (e.success) {
                    setResult(
                        `Claim success, please verify transaction on the blockchain explorer https://finder.terra.money/columbus-4/tx/${e.result.txhash}`,
                    )
                    setClaimed(true)
                } else {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e.message)
                setResult(e.message)
            })
    }

    async function lotteryCombinations(type) {
        setTicketLoad(true)
        try {
            const api = new WasmAPI(state.lcd_client.apiRequester)
            let id = parseInt(
                state.historicalTicketLotteryId == 0
                    ? state.currentLotteryId
                    : state.historicalTicketLotteryId,
            )
            if (type == 'prev' && id !== 1) {
                id = id - 1
            }
            if (
                type == 'next' &&
                state.historicalTicketLotteryId < state.currentLotteryId &&
                state.historicalTicketLotteryId !== 0
            ) {
                id = id + 1
            }
            if (type == 'current') {
                id = state.currentLotteryId
            }
            // console.log(id)
            dispatch({ type: 'setHistoricalTicketLotteryId', message: id })

            const combinations = await api.contractQuery(
                state.loterraContractAddress,
                {
                    combination: {
                        lottery_id: id,
                        address: state.wallet.walletAddress,
                    },
                },
            )
            // console.log(combinations)
            dispatch({ type: 'setAllCombinations', message: combinations })
            setTicketLoad(false)
        } catch (e) {
            console.log(e, 'no tickets found')
            dispatch({ type: 'setAllCombinations', message: [] })
            setTicketLoad(false)
        }
    }

    function getRanks(ranks) {
        const rank1 = []
        const rank2 = []
        const rank3 = []
        const rank4 = []
        const rank5 = []
        const rank6 = []
        ranks.map((obj, i) => {
            if (obj == 6) {
                rank6.push(obj)
            }
            if (obj == 5) {
                rank5.push(obj)
            }
            if (obj == 4) {
                rank4.push(obj)
            }
            if (obj == 3) {
                rank3.push(obj)
            }
            if (obj == 2) {
                rank2.push(obj)
            }
            if (obj == 1) {
                rank1.push(obj)
            }
        })

        const ranksArray = [rank6, rank5, rank4, rank3, rank2, rank1]

        function getComboText(rank, amount) {
            let text = ''
            if (rank == 1) {
                text =
                    state.comboTextOne[parseInt(amount)] != undefined
                        ? state.comboTextOne[parseInt(amount - 1)]
                        : state.comboTextOne[state.comboTextFour.length - 1]
            }
            if (rank == 2) {
                text =
                    state.comboTextTwo[parseInt(amount)] != undefined
                        ? state.comboTextTwo[parseInt(amount - 1)]
                        : state.comboTextTwo[state.comboTextFour.length - 1]
            }
            if (rank == 3) {
                text =
                    state.comboTextThree[parseInt(amount)] != undefined
                        ? state.comboTextThree[parseInt(amount - 1)]
                        : state.comboTextThree[state.comboTextFour.length - 1]
            }
            if (rank == 4) {
                text =
                    state.comboTextFour[parseInt(amount)] != undefined
                        ? state.comboTextFour[parseInt(amount - 1)]
                        : state.comboTextFour[state.comboTextFour.length - 1]
            }
            if (rank == 5) {
                text =
                    state.comboTextFive[parseInt(amount)] != undefined
                        ? state.comboTextFive[parseInt(amount - 1)]
                        : state.comboTextFive[state.comboTextFour.length - 1]
            }
            if (rank == 6) {
                text =
                    state.comboTextSix[parseInt(amount)] != undefined
                        ? state.comboTextSix[parseInt(amount - 1)]
                        : state.comboTextSix[state.comboTextFour.length - 1]
            }
            return text
        }

        function getAmountClass(amount) {
            let name = ''

            for (let index = 0; index < state.amountClasses.length; index++) {
                const element = state.amountClasses[index]
                if (element.amount == amount) {
                    name = element.class
                }
            }

            return name
        }

        function comboTextResponse(rank, amount) {
            let result = ''
            for (let index = 0; index < state.rankClasses.length; index++) {
                const element = state.rankClasses[index]
                if (parseInt(rank) == element.rank) {
                    result =
                        '<span class="combo-text ' +
                        element.class +
                        ' ' +
                        getAmountClass(amount) +
                        '">' +
                        getComboText(rank, amount) +
                        '</span>'
                    return result
                }
            }
        }

        let html = ''
        for (let index = 0; index < ranksArray.length; index++) {
            const element = ranksArray[index]
            if (element.length > 0) {
                html += '<span class="combo-box">'
                html +=
                    '<span class="main">' +
                    element[0] +
                    '</span>' +
                    '<span class="special">x' +
                    element.length +
                    '</span>'
                html += comboTextResponse(element[0], element.length)
                html += '</span>'
            }
        }

        return html
    }

    function showWinnerPrizes() {
        let html = getRanks(state.youWon.claims.ranks)
        return (
            <div className="combos">
                <span dangerouslySetInnerHTML={{ __html: html }}></span>
            </div>
        )
    }

    function calculateTotalPrizesInDollars() {
        let totalPrizes = 0
        //Loop through winner claims to calculate total prices

        function calcNumberRankFallen(nr) {
            let found = 0
            let recentWinners = state.allRecentWinners
            //Test purposes
            // recentWinners = [
            // {address:"terra1an23yxwkfda0m5dmkcxpyrqux83cw5esg9ex86",claims:{claimed:true,ranks:[4,4]}},
            // {address:"terra1an23yxwkfda0m5dmkcxpyrqux83cw5esg9ex8=6",claims:{claimed:true,ranks:[4]}},
            // {address:"terra1an23yxwkfda0m5dmkcxpyrqux83cw5esg9ex8=6",claims:{claimed:true,ranks:[4]}},
            // {address:"terra1an23yxwkfda0m5dmkcxpyrqux83cw5esg9ex8=6",claims:{claimed:true,ranks:[4]}},
            // ]
            recentWinners.map((obj) => {
                obj.claims.ranks.map((rank) => {
                    if (rank == nr) {
                        found++
                    }
                })
            })
            return found
        }

        function getPrizePerRankGross(nr) {
            let rank = nr - 1
            let total =
                (state.config.prize_rank_winner_percentage[rank] *
                    parseInt(state.lastDrawnJackpot) -
                    (state.config.prize_rank_winner_percentage[rank] *
                        parseInt(state.lastDrawnJackpot) *
                        state.config.token_holder_percentage_fee_reward) /
                        100) /
                100
            let divideBy = calcNumberRankFallen(nr)
            if (divideBy !== 0) {
                return parseFloat(total / divideBy)
            } else {
                return total
            }
        }

        state.youWon.claims.ranks.map((obj) => {
            totalPrizes += getPrizePerRankGross(obj)
        })

        return <>${numeral(totalPrizes).format('0,0.00')}</>
    }

    // function collect(){
    //     const msg = new MsgExecuteContract(
    //         connectedWallet.walletAddress,
    //         state.loterraContractAddress,
    //         {
    //             collect: {},
    //         })

    //     connectedWallet.post({
    //         msgs: [msg],
    //         fee: obj
    //         // gasPrices: obj.gasPrices(),
    //         // gasAdjustment: 1.5,
    //     }).then(e => {
    //         if (e.success) {
    //             setResult("Collect success")
    //         }
    //         else{
    //             console.log(e)
    //         }
    //         console.log(e)
    //     }).catch(e =>{
    //         console.log(e.message)
    //         setResult(e.message)
    //     })
    // }
    return (
        <>
            <div className={'usermodal' + (open ? ' show' : '')}>
                <button className="toggle" onClick={() => toggleModal()}>
                    <X size={24} />
                </button>
                <div className="usermodal_content">
                    <div className="row">
                        {connectedWallet && connectedWallet.walletAddress && (
                            <>
                                <div className="col-12 text-center claim">
                                    <h4 className="mb-2">
                                        Your Lottery Tickets
                                        {state.allCombinations.combination && (
                                            <p className="m-0">
                                                Number of tickets:{' '}
                                                {
                                                    state.allCombinations
                                                        .combination.length
                                                }
                                            </p>
                                        )}
                                        {state.historicalTicketLotteryId !==
                                            0 &&
                                            state.historicalTicketLotteryId !==
                                                state.currentLotteryId && (
                                                <small
                                                    className="d-block"
                                                    style={{
                                                        fontSize: '14px',
                                                        color: '#ff36ff',
                                                    }}
                                                >
                                                    Tickets from Lottery{' '}
                                                    <strong>
                                                        #
                                                        {
                                                            state.historicalTicketLotteryId
                                                        }
                                                    </strong>
                                                </small>
                                            )}
                                    </h4>
                                    {state.youWon &&
                                        state.config
                                            .prize_rank_winner_percentage &&
                                        state.allRecentWinners.length > 0 && (
                                            <div className="text-center winner-box">
                                                <p className="winner-box-heading">
                                                    <strong>
                                                        YOU WON!{' '}
                                                        {state.lastDrawnJackpot !==
                                                            0 &&
                                                            calculateTotalPrizesInDollars()}
                                                    </strong>{' '}
                                                    <span>
                                                        Latest draw prizes
                                                    </span>
                                                </p>
                                                {showWinnerPrizes()}
                                            </div>
                                        )}
                                    <div className="btn-group w-100">
                                        <button
                                            className="btn btn-default"
                                            disabled={
                                                state.historicalTicketLotteryId ==
                                                1
                                                    ? true
                                                    : false
                                            }
                                            onClick={() =>
                                                lotteryCombinations('prev')
                                            }
                                        >
                                            <ArrowCircleLeft size={24} />
                                        </button>
                                        <button
                                            className="btn btn-default"
                                            disabled={
                                                state.historicalTicketLotteryId ==
                                                    0 ||
                                                state.historicalTicketLotteryId ==
                                                    state.currentLotteryId
                                                    ? true
                                                    : false
                                            }
                                            onClick={() =>
                                                lotteryCombinations('current')
                                            }
                                        >
                                            Current
                                        </button>
                                        <button
                                            className="btn btn-default"
                                            disabled={
                                                state.historicalTicketLotteryId ==
                                                    0 ||
                                                state.historicalTicketLotteryId ==
                                                    state.currentLotteryId
                                                    ? true
                                                    : false
                                            }
                                            onClick={() =>
                                                lotteryCombinations('next')
                                            }
                                        >
                                            <ArrowCircleRight size={24} />
                                        </button>
                                    </div>
                                    <ul className="list-group text-left">
                                        {ticketLoad ? (
                                            <PriceLoader />
                                        ) : state.allCombinations
                                              .combination ? (
                                            state.allCombinations.combination.map(
                                                (element, i) => (
                                                    <li
                                                        key={i}
                                                        className="list-group-item"
                                                    >
                                                        <Ticket
                                                            size={18}
                                                            color={'#20FF93'}
                                                        />
                                                        {element}
                                                    </li>
                                                ),
                                            )
                                        ) : (
                                            <li className="list-group-item">
                                                <Ticket
                                                    size={18}
                                                    color={'#20FF93'}
                                                />
                                                No tickets found
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="col-12 text-center mt-4 claim">
                                    <span
                                        className="info text-start"
                                        style={{
                                            color: '#FF36FF',
                                            borderColor: '#FF36FF',
                                        }}
                                    >
                                        <Info
                                            size={14}
                                            weight="fill"
                                            className="me-1"
                                            style={{
                                                position: 'relative',
                                                top: '-2px',
                                            }}
                                        />
                                        <strong>
                                            How to Claim and Collect?
                                        </strong>
                                        <br />
                                        Our LoTerra BOT will claim and collect
                                        automatically, afterwards the BOT
                                        deposits winning prizes to your wallet.
                                        This process takes up to max 2 days from
                                        draw.
                                    </span>
                                    {/* <h4>Claim & Collect</h4>
                                    <p>Our LoTerra BOT will claim automatically and deposit winning prizes in your wallet.</p> */}
                                    {/* {
                                       1==1 ?
                                            <button className="btn btn-special w-100 mb-3" style={{boxShadow:'none'}} onClick={() => claim()} >Claim</button> :
                                            <button className="btn btn-special w-100 mb-3" style={{boxShadow:'none'}} disabled>Claim closed</button>
                                    }
                                    {
                                       1 == 1 ?
                                            <button className="btn btn-special-green w-100 mb-3" style={{boxShadow:'none'}} onClick={() => collect()}>Collect</button> :
                                            <button className="btn btn-special-green w-100 mb-3" style={{boxShadow:'none'}} disabled>Collect closed</button>
                                    }
                                    {result} */}
                                </div>
                                <div className="col-12 mt-3">
                                    <SocialShare />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div
                className={'backdrop' + (open ? ' show' : '')}
                onClick={() => toggleModal()}
            ></div>
        </>
    )
}
