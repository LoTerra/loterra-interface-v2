import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'


export default function RapidoCardHeader(props) {
    const {lotteryId, winningCombination, isLotteryLive} = props;

    const {state,dispatch} = useStore()


    return (
        <div className="card-header"
        style={{borderBottom:0}}
        >                             
                <div className="row">
                    <div className="col-6 text-start">

                    { isLotteryLive ?
                        <p className="mb-0 rounded"
                        style={{
                            background:'rgb(23, 185, 107)',
                            padding:'5px',
                            color:'#fff',
                            marginTop:'-23px',
                            width:'100px',
                            textAlign:'center',
                            fontWeight:700
                        }}
                        >Active</p>
                        : winningCombination == null ?
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
                        >Resolving</p>
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
                    {/* <div className="col-6 text-end">        
                    { winningCombination == null ?
                        <>
                        <p className="mb-0 text-muted">Next draw</p>
                        <p className="fs-5 mb-0 fw-bold">00:00</p>
                        </>
                        :
                        <>
                        </>
                    }                                       
                    </div> */}
                </div>
            </div>
        )
}