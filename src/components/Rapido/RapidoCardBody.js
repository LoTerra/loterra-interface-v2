import { Trash, X } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { useStore } from '../../store'
import {WasmAPI} from "@terra-money/terra.js";


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
        nrOfDraws,
        winningCombination,
        bonusNumber,
        lotteryId,
        isLotteryLive
    } = props;


    return (
        <div className={'card-body'}>
            { isLotteryLive ?
            <div className="row px-2">
                <div className="col-12 p-2 mb-3" style={{border:'3px solid #048ABF', borderRadius:'10px'}}>
                    <p className="fs-6 fw-bold text-center mb-0 label-four">Select 4 numbers</p>
                    <div className="btn-holder">
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((obj,k) =>{
                            return (
                                <button type="button" key={k} className={'nr-btn smaller' + (checkInFour(obj) ? ' active': '')} value={obj} onClick={(e) => selectFourNumbers(obj)}>{obj}</button>
                            )
                        })}
                    </div>
                </div>
                <div className="col-12 p-2" style={{border:'3px solid #F2D230', borderRadius:'10px'}}>
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
                
                <div className="col-12 mt-2 p-0">                  
                    <div className="btn-holder text-end">
                    {[1,2,5].map((obj,k) =>{
                        return (
                        <button key={k} className={'nr-btn medium' + (multiplier == obj ? ' active-i' : '')} onClick={(e) => selectMultiplier(obj)}>
                            <span className="d-block small"
                            style={{
                                fontSize:'12px',
                                opacity:0.6,
                                fontWeight:400,
                                marginBottom:'-4px'
                            }}
                            >Multiplier</span>
                            x{obj} {' '} UST
                        </button>
                        )
                    })}                      
                    </div>
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-7 d-flex">
                            <p className="mb-0 align-self-center">Number of draw</p>
                        </div>
                        <div className="col-5">
                            <select className="form-control text-center" onChange={(e) => selectNrOfDraws(e.target.value)}>
                            {[1,2,3,4,5,10,20,30,40,50].map((obj,k) =>{
                                    return (
                                        <option key={k} value={obj}>{obj}</option>
                                    )
                                })}
                            </select>
                        </div>
                        {/* <div className="col-7">
                            <div className="btn-holder text-end">
                                {[1,2,3,4,5,10,20,30,40,50].map((obj,k) =>{
                                    return (
                                        <button key={k} className={'nr-btn medium-s' + (nrOfDraws == obj ? ' active-i' : '')} onClick={(e) => selectNrOfDraws(obj)}>{obj}</button>
                                    )
                                })}
                            </div>
                        </div> */}
                    </div>
                </div>      
            </div>
                : winningCombination != null && !isLotteryLive ?
            <div className="col-12 text-center">
                <div className="col-12 mb-2">
                    <div className={'rapido-winning-combination'}>
                        { winningCombination.map((nr,k) => {
                            return (
                                <span key={k} className="rapido-combi-nr big">{nr}</span>
                            )
                        })}
                        <span className="rapido-combi-nr g big">{bonusNumber}</span>
                    </div>
                </div>
            </div>
                    :
            <div className="col-12 text-center">
                <div className="col-12 mb-2">
                    <div className={'rapido-winning-combination'}>
                        Draw is happening
                        May the luck be with you!
                    </div>
                </div>
            </div>

            }    

        </div>
    )
}