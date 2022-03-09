import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'
import RapidoCardBody from './RapidoCardBody'
import RapidoCardFooter from './RapidoCardFooter'
import RapidoCardHeader from './RapidoCardHeader'


export default function RapidoCard(props) {
    const {lotteryId, winningCombination, bonusNumber} = props;
    const {state,dispatch} = useStore()

    const [fourNumbers, setFourNumbers] = useState([])
    const [oneNumber, setOneNumber] = useState([])
    const [multiplier, setMultiplier] = useState(1)
    const [nrOfDraws, setNrOfDraws] = useState(1)

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


    return (
        <div className={'card rapido-card'}>
            <RapidoCardHeader 
            lotteryId={lotteryId}
            winningCombination={winningCombination}
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
            />
            <RapidoCardFooter
            enterDraw={() => enterDraw()}
            multiplier={multiplier}
            nrOfDraws={nrOfDraws}
            fourNumbers={fourNumbers}
            oneNumber={oneNumber}
            winningCombination={winningCombination}
            />
            
        </div>
    )
}
