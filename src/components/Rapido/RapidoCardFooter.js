import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'


export default function RapidoCardFooter(props) {


    const {state,dispatch} = useStore()
    const {enterDraw,multiplier,nrOfDraws} = props;


    return (
        <div className="card-footer pb-3" style={{background:'linear-gradient(45deg, #210a5c, transparent)'}}>
                    <div className="row">
                        <div className="col-12 text-center mt-1">
                            <p className="fs-6 fw-bold">Receipt</p>
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