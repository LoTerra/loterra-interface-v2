import React, { useState } from 'react'
import { useStore } from '../../store'


export default function RapidoCard() {


    const {state,dispatch} = useStore()

    const [fourNumbers, setFourNumbers] = useState([])
    const [oneNumber, setOneNumber] = useState([])

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
        if(checkInOne(nr)){
            console.log('found')
            var array = [...oneNumber]; // make a separate copy of the array
            var index = array.indexOf(nr)
            if (index !== -1) {
                array.splice(index, 1);
                setOneNumber(array);
                return ;
            }
        }
        if(oneNumber.length <= 0){
            setOneNumber([...oneNumber,nr])
        } else {
            alert('deselect a number, max is 1')
        }
        
        console.log(oneNumber)
    }

    const checkInOne = (nr) => {
        return oneNumber.indexOf(nr) > -1
    }


    return (
        <div className={'card rapido-card'}>
            <div className={'card-body'}>
                <div className="row">
                    <div className="col-12">
                        <p className="text-center">Tick 4 numbers</p>
                        <div className="btn-holder">
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((obj,k) =>{
                            return (
                                <button type="button" key={k} className={'nr-btn smaller' + (checkInFour(obj) ? ' active': '')} value={obj} onClick={(e) => selectFourNumbers(obj)}>{obj}</button>
                            )
                        })
                        }
                        </div>
                    </div>
                    <div className="col-12">
                        <p className="text-center">Tick 1 numbers</p>
                        <div className="btn-holder">
                        {[1,2,3,4,5,6,7,8].map((obj,k) =>{
                            return (
                                <button type="button" key={k} className={'nr-btn smaller' + (checkInOne(obj) ? ' active-g': '')} value={obj} onClick={(e) => selectOneNumber(obj)}>{obj}</button>
                            )
                        })
                        }
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-5">
                                <p>Multiplier</p>
                            </div>
                            <div className="col-7">
                                <div className="btn-holder">
                                    <button className="nr-btn">1ust</button>
                                    <button className="nr-btn">2ust</button>
                                    <button className="nr-btn">5ust</button>    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-5">
                                <p>Number of draw</p>
                            </div>
                            <div className="col-7">
                                <div className="btn-holder">
                                    <button className="nr-btn">1</button>
                                    <button className="nr-btn">2</button>
                                    <button className="nr-btn">3</button>
                                    <button className="nr-btn">4</button>
                                    <button className="nr-btn">5</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <p>Receipt</p>
                    </div>
                    <div className="col-6 text-start">
                        <p>Cost</p>
                    </div>
                    <div className="col-6 text-end">
                        <p>6 ust</p>
                    </div>
                    <div className="col-6 text-start">
                        <p>Potential winners</p>
                    </div>
                    <div className="col-6 text-end">
                        <p>60 000 ust</p>
                    </div>
                    <div className="col-12">
                        <button className="btn btn-primary w-100">Enter</button>    
                    </div>
                </div>    
            </div>
        </div>
    )
}
