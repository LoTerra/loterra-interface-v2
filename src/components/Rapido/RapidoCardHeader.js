import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'


export default function RapidoCardHeader(props) {
    const {lotteryId, winningCombination} = props;

    const {state,dispatch} = useStore()


    return (
        <div className="card-header"
        style={{
            background:'#27498C',
        }}
        >                             
                <div className="row">
                    <div className="col-6 text-start">
                    { winningCombination == null ?
                        <p className="mb-0 rounded"
                        style={{
                            background:'#A67244',
                            padding:'5px',
                            color:'#fff',
                            marginTop:'-23px',
                            width:'100px',
                            textAlign:'center',
                            fontWeight:700
                        }}
                        >Active</p>
                        :
                        <p className="mb-0 rounded"
                        style={{
                            background:'rgb(33 10 92)',
                            padding:'5px',
                            color:'#fff',
                            marginTop:'-23px',
                            width:'100px',
                            textAlign:'center',
                            fontWeight:700
                        }}
                        >Finished</p>
                    }
                        <p className="fs-4 mb-0 fw-bold">#{lotteryId}</p>
                    </div>
                    <div className="col-6 text-end">        
                    { winningCombination == null ?
                        <>
                        <p className="mb-0 text-muted">Next draw</p>
                        <p className="fs-5 mb-0 fw-bold">00:00</p>
                        </>
                        :
                        <>
                        </>
                    }                                       
                    </div>
                </div>
            </div>
        )
}