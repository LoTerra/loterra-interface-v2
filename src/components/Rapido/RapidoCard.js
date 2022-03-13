import { Trash } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { useStore } from '../../store'
import RapidoCardBody from './RapidoCardBody'
import RapidoCardFooter from './RapidoCardFooter'
import RapidoCardHeader from './RapidoCardHeader'
import { WasmAPI } from '@terra-money/terra.js'

export default function RapidoCard(props) {
    const {
        lotteryId,
        winningCombination,
        bonusNumber,
        drawTime,
        isLotteryLive,
        formatTime,
    } = props
    const { state, dispatch } = useStore()

    const [fourNumbers, setFourNumbers] = useState([])
    const [oneNumber, setOneNumber] = useState([])
    const [multiplier, setMultiplier] = useState(1)
    const [nrOfDraws, setNrOfDraws] = useState(1)
    const [userGames, setUserGames] = useState([])
    const [isLastItem, setIsLastItem] = useState(false)
    const [toDefault, setToDefault] = useState(false)

    const api = new WasmAPI(state.lcd_client_testnet.apiRequester)

    const selectFourNumbers = (nr) => {
        setFourNumbers(nr)
    }

    function currentLottery() {
        if (isLotteryLive) {
            dispatch({ type: 'setRapidoCurrentTimeRound', message: drawTime })
        }
    }

    const selectOneNumber = (nr) => {
        setOneNumber(nr)
        console.log(oneNumber)
    }

    const selectMultiplier = (multiplier) => {
        setMultiplier(multiplier)
    }

    const selectNrOfDraws = (nr) => {
        setNrOfDraws(nr)
    }
    async function get_user_combination(last_element) {
        const default_limit = 5
        let query = {
            games: {
                round: lotteryId,
                player: state.wallet.walletAddress,
                limit: default_limit,
            },
        }

        if (last_element) {
            query.games.start_after = last_element
        }

        let rapido_games = await api.contractQuery(state.rapidoAddress, query)

        if (rapido_games.length != 0) {
            console.log('rapido user games', rapido_games)
            if (last_element) {
                setUserGames([...userGames, ...rapido_games])
            } else {
                setUserGames([...rapido_games])
            }
        }

        if (rapido_games.length < 5) {
            setIsLastItem(true)
        } else {
            setIsLastItem(false)
        }
    }

    function switchToDefault(){
        setToDefault(true)
        setNrOfDraws(1)
        setMultiplier(1)
    }

    useEffect(() => {
        setUserGames([])
        get_user_combination()
        currentLottery()
    }, [state.wallet.walletAddress, state.rapidoCurrentRound])

    return (
        <div
            className={
                'card rapido-card' +
                (isLotteryLive
                    ? ' active'
                    : winningCombination == null
                    ? ' resolving'
                    : '')
            }
        >
            <RapidoCardHeader
                lotteryId={lotteryId}
                winningCombination={winningCombination}
                isLotteryLive={isLotteryLive}
                formatTime={formatTime}
            />
            <RapidoCardBody
                toDefault={toDefault}
                selectMultiplier={(a) => selectMultiplier(a)}
                selectNrOfDraws={(a) => selectNrOfDraws(a)}
                selectOneNumber={(a) => selectOneNumber(a)}
                selectFourNumbers={(a) => selectFourNumbers(a)}
                fourNumbers={fourNumbers}
                oneNumber={oneNumber}
                multiplier={multiplier}
                nrOfDraws={nrOfDraws}
                userGames={userGames}
                winningCombination={winningCombination}
                bonusNumber={bonusNumber}
                lotteryId={lotteryId}
                isLotteryLive={isLotteryLive}
            />
            <RapidoCardFooter
                switchToDefault={() => switchToDefault()}
                enterDraw={() => enterDraw()}
                multiplier={multiplier}
                nrOfDraws={nrOfDraws}
                fourNumbers={fourNumbers}
                oneNumber={oneNumber}
                winningCombination={winningCombination}
                isLotteryLive={isLotteryLive}
                userGames={userGames}
                loadMore={get_user_combination}
                isLastItem={isLastItem}
                lotteryId={lotteryId}
                bonusNumber={bonusNumber}
            />
        </div>
    )
}
