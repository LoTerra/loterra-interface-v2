import { Trash } from 'phosphor-react'
import React, {useEffect, useState} from 'react'
import { useStore } from '../../store'
import RapidoCardBody from './RapidoCardBody'
import RapidoCardFooter from './RapidoCardFooter'
import RapidoCardHeader from './RapidoCardHeader'
import {WasmAPI} from "@terra-money/terra.js";


export default function RapidoCard(props) {

    const {lotteryId, winningCombination, bonusNumber, drawTime, isLotteryLive} = props;
    const {state,dispatch} = useStore()

    const [fourNumbers, setFourNumbers] = useState([])
    const [oneNumber, setOneNumber] = useState([])
    const [multiplier, setMultiplier] = useState(1)
    const [nrOfDraws, setNrOfDraws] = useState(1)
    const [userGames, setUserGames] = useState([]);
    const [isLastItem, setIsLastItem] = useState(false);

    const api = new WasmAPI(state.lcd_client_testnet.apiRequester)

    const selectFourNumbers = (nr) => {
        if(checkInFour(nr)){
            console.log('found')
            var array = [...fourNumbers]; // make a separate copy of the array
            var index = array.indexOf(nr)
            if (index !== -1) {
                array.splice(index, 1);
                setFourNumbers(array);
                return ;
            }
        }
        if(fourNumbers.length <= 3){
            setFourNumbers([...fourNumbers,nr])
        } else {
            alert('deselect a number, max is 4')
        }
        
        console.log(fourNumbers)
    }

    function currentLottery(){
        if (isLotteryLive){
            dispatch({ type: 'setRapidoCurrentTimeRound', message: drawTime })
        }
    }

    const checkInFour = (nr) => {
        return fourNumbers.indexOf(nr) > -1
    }

    const selectOneNumber = (nr) => {  
            setOneNumber([nr])       
        console.log(oneNumber)
    }

    const selectMultiplier = (multiplier) => {
        setMultiplier(multiplier)
    }

    const selectNrOfDraws = (nr) => {
        setNrOfDraws(nr)
    }

    const checkInOne = (nr) => {
        return oneNumber.indexOf(nr) > -1
    }
    

    const enterDraw = () => {
        alert('hello sir kwon!')
    }


    async function get_user_combination(last_element){
        const default_limit = 5
        let query = {
            games: {
                round: lotteryId,
                player: state.wallet.walletAddress,
                limit: default_limit
            }
        }

        if (last_element){
            query.games.start_after = last_element
        }

        let rapido_games = await api.contractQuery(
            state.rapidoAddress,
            query
        );

        if (rapido_games.length != 0){
            if (last_element){
                setUserGames([...userGames, ...rapido_games])

            }else{
                setUserGames([...rapido_games])
            }
        }

        if (rapido_games.length < 5) {
            setIsLastItem(true)
        }else {
            setIsLastItem(false)
        }
    }

    useEffect(() => {
        setUserGames([])
        get_user_combination()
        currentLottery()
    }, [state.wallet.walletAddress, state.rapidoCurrentRound])

    return (
        <div className={'card rapido-card' + (isLotteryLive ? ' active' : '' )}>
            <RapidoCardHeader 
            lotteryId={lotteryId}
            winningCombination={winningCombination}
            isLotteryLive={isLotteryLive}
            />
            <RapidoCardBody
                checkInFour={(a) => checkInFour(a)}
                checkInOne={(a) => checkInOne(a)}
                selectMultiplier={(a) => selectMultiplier(a)}
                selectNrOfDraws={(a) => selectNrOfDraws(a)}
                selectOneNumber={(a) => selectOneNumber(a)}
                selectFourNumbers={(a) => selectFourNumbers(a)}
                fourNumbers={fourNumbers}
                oneNumber={oneNumber}
                multiplier={multiplier}
                nrOfDraws={nrOfDraws}
                winningCombination={winningCombination}
                bonusNumber={bonusNumber}
                lotteryId={lotteryId}
                isLotteryLive={isLotteryLive}
            />
            <RapidoCardFooter
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
            />
            
        </div>
    )
}
