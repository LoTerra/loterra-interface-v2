import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'


export default function RapidoCardFooter(props) {


    const {state,dispatch} = useStore()
    const {enterDraw,multiplier,nrOfDraws,fourNumbers,oneNumber} = props;


    return (
        <div className="card-footer pb-3" style={{background:'linear-gradient(45deg, #210a5c, transparent)'}}>
                    <div className="row">
                        <div className="col-12 text-center mt-1">
                            <p className="fs-6 fw-bold">Receipt</p>
                        </div>
                        <div className="col-6 text-start d-flex">
                            <p className="mb-0 align-self-center">Combination</p>
                        </div>
                        <div className="col-6 text-end">
                        <div className="col-12 mb-2">
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
                        <div className="col-6 text-start">
                            <p>Cost</p>
                        </div>
                        <div className="col-6 text-end">
                            <p className="fw-bold">{multiplier * nrOfDraws} ust</p>
                        </div>
                        <div className="col-6 text-start">
                            <p>Potential winners</p>
                        </div>
                        <div className="col-6 text-end">
                            <p className="fw-bold">60 000 ust</p>
                        </div>
                        <div className="col-12">
                            <button className="btn btn-special w-100" style={{background:'#01bd65'}} onClick={(e) => enterDraw()}>Enter</button>    
                        </div>
                    </div>
            </div>
        )
}