import { Trash } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { useStore } from '../../store'
import RapidoCardBody from './RapidoCardBody'
import RapidoCardFooter from './RapidoCardFooter'
import RapidoCardHeader from './RapidoCardHeader'
import { WasmAPI } from '@terra-money/terra.js'

import useSound from 'use-sound'
import multiplierSfx from './sounds/navigation_selection-complete-celebration.mp3';
import buttonSfx from './sounds/ui_tap-variant-01.mp3';

export default function RapidoCard(props) {
    const {
        lotteryId,
        winningCombination,
        bonusNumber,
        drawTime,
        isLotteryLive,
        formatTime,
        lotteryStats
    } = props
    const { state, dispatch } = useStore()

    //Sounds
    const [playMultiplier] = useSound(buttonSfx);   
    const [playButtonClick] = useSound(buttonSfx);

    const [fourNumbers, setFourNumbers] = useState([])
    const [oneNumber, setOneNumber] = useState([])
    const [multiplier, setMultiplier] = useState(1)
    const [nrOfDraws, setNrOfDraws] = useState(1)
    const [userGames, setUserGames] = useState([])
    const [isLastItem, setIsLastItem] = useState(false)
    const [toDefault, setToDefault] = useState(false)

    const api = new WasmAPI(state.lcd_client.apiRequester)

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
        playMultiplier()
        setMultiplier(multiplier)
    }

    const selectNrOfDraws = (nr) => {
        playButtonClick()
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

    function switchToDefault(d){
        setToDefault(d)
    }

    useEffect(() => {
        setUserGames([])
        setTimeout(() => {
            get_user_combination()
            dispatch({
                type: 'setLoaderResolveLottoNumber',
                message: false,
            })
        }, 6000)
        currentLottery()
    }, [state.wallet.walletAddress, state.rapidoCurrentRound, state.loaderResolveLottoNumber])

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
                lotteryStats={lotteryStats}
            />
            <RapidoCardBody
                toDefault={toDefault}
                switchToDefault={(d) => switchToDefault(d)}
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
                lotteryStats={lotteryStats}
            />
            <RapidoCardFooter
                switchToDefault={(d) => switchToDefault(d)}
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
                lotteryStats={lotteryStats}
            />
        </div>
    )
}
