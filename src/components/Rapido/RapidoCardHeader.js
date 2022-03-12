import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'

export default function RapidoCardHeader(props) {
    const { lotteryId, winningCombination, isLotteryLive, formatTime } = props

    const { state, dispatch } = useStore()

    return (
        <div className="card-header" style={{ borderBottom: 0 }}>
            <div className="row">
                <div className="col-6 text-start">
                    {isLotteryLive ? (
                        <p
                            className="mb-0 rounded"
                            style={{
                                background: 'rgb(61 221 144)',
                                padding: '5px',
                                color: 'rgb(24 7 66)',
                                marginTop: '-23px',
                                width: '100px',
                                textAlign: 'center',
                                fontWeight: 700,
                                boxShadow:'0px 0px 12px #77f0b6'
                            }}
                        >
                            Active
                        </p>
                    ) : winningCombination == null ? (
                        <p
                            className="mb-0 rounded"
                            style={{
                                background: 'rgb(240 53 240)',
                                padding: '5px',
                                color: '#fff',
                                marginTop: '-23px',
                                width: '100px',
                                textAlign: 'center',
                                fontWeight: 700,
                            }}
                        >
                            Resolving
                        </p>
                    ) : (
                        <p
                            className="mb-0 rounded"
                            style={{
                                background: 'rgb(33 10 92)',
                                padding: '5px',
                                color: 'rgb(255 255 255 / 47%)', 
                                marginTop: '-23px',
                                width: '100px',
                                textAlign: 'center',
                                fontWeight: 700,
                            }}
                        >
                            Finished
                        </p>
                    )}
                    <p className="fs-5 mb-0 mt-1 fw-regular" style={{opacity:0.5}}>#{lotteryId}</p>
                </div>
                <div className="col-6 text-end">        
                    { isLotteryLive ?
                        <>
                        <p className="small mb-0" style={{color:'#fff', opacity:0.5}}>Round ends in</p>
                        {formatTime()}
                        </>
                        :
                        ''
                    }                                       
                    </div>
            </div>
        </div>
    )
}
