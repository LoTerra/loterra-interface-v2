import { Trash, X } from 'phosphor-react'
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
                <div className="col-12 p-2 mb-3" style={{border:'3px solid #048abf', borderRadius:'10px'}}>
                    <p className="fs-6 fw-bold text-center mb-0 label-four">Select 4 numbers</p>
                    <div className="col-12">
                        <div className="btn-holder text-end">
                            <button type="button" className={'nr-btn smaller'}> 
                                <X size={'18'} /> 
                            </button> 
                        </div>
                    </div>
                    <div className="btn-holder">
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((obj,k) =>{
                            return (
                                <button type="button" key={k} className={'nr-btn smaller'} value={obj} onClick={(e) => selectFourNumbers(obj)}>{obj}</button>
                            )
                        })}
                    </div>
                </div>
                <div className="col-12 p-2" style={{border:'3px solid #f2d230', borderRadius:'10px'}}>
                <p className="fs-6 fw-bold text-center mb-0 label-one">Select 1 star</p>
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
                            <button key={k} className={'nr-btn medium' + (multiplier == obj ? ' active-i' : '')} onClick={(e) => selectMultiplier(obj)}>{obj}UST</button>
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
                                {[1,2,3,4,5,10,20,30,40,50].map((obj,k) =>{
                                    return (
                                        <button key={k} className={'nr-btn medium-s' + (nrOfDraws == obj ? ' active-i' : '')} onClick={(e) => selectNrOfDraws(obj)}>{obj}</button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>      
            </div>    
        </div>
    )
}