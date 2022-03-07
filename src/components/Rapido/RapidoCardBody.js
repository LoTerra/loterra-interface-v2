import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'


export default function RapidoCardBody(props) {


    const {state,dispatch} = useStore()

    const {
        checkInFour,
        checkInOne,
        selectMultiplier,
        selectNrOfDraws,
        selectOneNumber,
        selectFourNumbers,
        fourNumbers,
        oneNumber,
        multiplier,
        nrOfDraws
    } = props;
  


return (
    <div className={'card-body'}>
                <div className="row px-2">
                    <div className="col-12 p-2 mb-3" style={{border:'3px solid #fe00fe', borderRadius:'10px'}}>
                    <p className="fs-6 fw-bold text-center mb-0 label-four">Tick 4 numbers</p>
                        <div className="btn-holder">
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((obj,k) =>{
                            return (
                                <button type="button" key={k} className={'nr-btn smaller' + (checkInFour(obj) ? ' active': '')} value={obj} onClick={(e) => selectFourNumbers(obj)}>{obj}</button>
                            )
                        })
                        }
                        </div>
                    </div>
                    <div className="col-12 p-2" style={{border:'3px solid #01bd65', borderRadius:'10px'}}>
                    <p className="fs-6 fw-bold text-center mb-0 label-one">Tick 1 numbers</p>
                        <div className="btn-holder">
                        {[1,2,3,4,5,6,7,8].map((obj,k) =>{
                            return (
                                <button type="button" key={k} className={'nr-btn smaller' + (checkInOne(obj) ? ' active-g': '')} value={obj} onClick={(e) => selectOneNumber(obj)}>{obj}</button>
                            )
                        })
                        }
                        </div>
                    </div>
                    
                    <div className="col-12 mt-2">
                        <div className="row">
                            <div className="col-12">
                            <p className="fs-6 fw-bold text-start mt-3 mb-0">Settings</p>
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
                            <p className="fs-6 fw-bold text-start mt-3 mb-1">Your combination</p>
                            </div>
                    <div className="col-12">
                    {[1,2,3,4,5].map((obj,k) =>{
                            return (
                                <span key={k} className={"rapido-combi-nr" + (obj == 5 ? ' g' : '')}>
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
)
                    }