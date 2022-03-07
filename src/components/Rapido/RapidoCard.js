import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'


export default function RapidoCard() {


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
            <div className={'card-body'}>
                <div className="row">
                    <div className="col-12">
                    <p className="fs-6 fw-bold text-start">Tick 4 numbers</p>
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
                    <p className="fs-6 fw-bold text-start mt-3">Tick 1 numbers</p>
                        <div className="btn-holder">
                        {[1,2,3,4,5,6,7,8].map((obj,k) =>{
                            return (
                                <button type="button" key={k} className={'nr-btn smaller' + (checkInOne(obj) ? ' active-g': '')} value={obj} onClick={(e) => selectOneNumber(obj)}>{obj}</button>
                            )
                        })
                        }
                        </div>
                    </div>
                    
                    <div className="col-12 mt-3">
                        <div className="row">
                            <div className="col-12">
                            <p className="fs-6 fw-bold text-start mt-3">Settings</p>
                            </div>
                            <div className="col-5 d-flex">
                                <p className="mb-0 align-self-center">Multiplier</p>
                            </div>
                            <div className="col-7">
                                <div className="btn-holder text-end">
                                {[1,2,5].map((obj,k) =>{
                            return (
                                <button key={k} className={'nr-btn medium' + (multiplier == obj ? ' active-g' : '')} onClick={(e) => selectMultiplier(obj)}>{obj}ust</button>
                            )
                        })
                        }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-5 d-flex">
                                <p className="mb-0 align-self-center">Number of draw</p>
                            </div>
                            <div className="col-7">
                                <div className="btn-holder text-end">
                                {[1,2,3,4,5].map((obj,k) =>{
                            return (
                                <button key={k} className={'nr-btn medium-s' + (nrOfDraws == obj ? ' active-g' : '')} onClick={(e) => selectNrOfDraws(obj)}>{obj}</button>
                            )
                        })
                        }
        
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12  mt-3">
                            <p className="fs-5 fw-bold text-start mt-3">Your combination</p>
                            </div>
                    <div className="col-12">
                    {[1,2,3,4,5].map((obj,k) =>{
                            return (
                                <span className={"rapido-combi-nr" + (obj == 5 ? ' g' : '')}>
                                    <span className="d-block" style={{background:'#120338',fontSize:'13px',fontWeight:300}}>{obj}</span>
                                    {
                                    obj <= 4 ? 
                                        fourNumbers[obj - 1] ? fourNumbers[obj - 1] : '*'
                                    : 
                                        oneNumber[0] ? oneNumber[0] : '*'
                                    }</span>
                            )
                        })
                        }   
                    </div>

                    
                </div>    
            </div>
            <div className="card-footer pb-3" style={{background:'#16073e'}}>
                    <div className="row">
                        <div className="col-12 text-center mt-1">
                            <p className="fs-6 fw-bold">Receipt</p>
                        </div>
                        <div className="col-6 text-start">
                            <p>Cost</p>
                        </div>
                        <div className="col-6 text-end">
                            <p>{multiplier * nrOfDraws} ust</p>
                        </div>
                        <div className="col-6 text-start">
                            <p>Potential winners</p>
                        </div>
                        <div className="col-6 text-end">
                            <p>60 000 ust</p>
                        </div>
                        <div className="col-12">
                            <button className="btn btn-special w-100" onClick={(e) => enterDraw()}>Enter</button>    
                        </div>
                    </div>
            </div>
        </div>
    )
}
