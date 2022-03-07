import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'


export default function RapidoCardFooter(props) {


    const {state,dispatch} = useStore()
    const {enterDraw,multiplier,nrOfDraws,fourNumbers,oneNumber} = props;


    return (
        <div className="card-footer pb-3" style={{background:'#27498C'}}>
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
                                    
                                    <span className="d-block" style={{background:'#27498C',fontSize:'13px',fontWeight:300}}>
                                        {obj}
                                    </span>
                                    {
                                    obj <= 4 ? 
                                        fourNumbers[obj - 1] ? fourNumbers[obj - 1] : '*'
                                    : 
                                        oneNumber[0] ? oneNumber[0] : '*'
                                    }
                                </span>
                            )
                        })
                        }   
                    </div>
                        </div>
                        <div className="col-6 text-start">
                            <p>Cost</p>
                        </div>
                        <div className="col-6 text-end">
                            <p className="fw-bold">{multiplier * nrOfDraws} UST</p>
                        </div>
                        <div className="col-6 text-start">
                            <p>Potential winnings per draw</p>
                        </div>
                        <div className="col-6 text-end">
                            <p className="fw-bold">{(10_000 * multiplier)} UST</p>
                        </div>
                        <div className="col-12">
                            <button className="btn btn-special w-100" style={{background:'#A67244'}} onClick={(e) => enterDraw()}>Enter</button>    
                        </div>
                    </div>
            </div>
        )
}