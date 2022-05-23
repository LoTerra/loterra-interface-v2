import { Check, Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'

export default function RapidoCardHeader(props) {
    const { lotteryId, winningCombination, isLotteryLive, formatTime, lotteryStats } = props

    const { state, dispatch } = useStore()

    return (
        <div className="card-header" style={{ borderBottom: 0 }}>
            <div className="row">
                <div className="col-6 text-start">
                    {isLotteryLive ? (
                        <p
                            className="mb-0 rounded"
                            style={{
                                background: 'rgb(242 210 48)',
                                padding: '5px',
                                marginTop: '-23px',
                                width: '100px',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize:14
                            }}
                        >
                            <span style={{color:"rgb(0 70 255)"}}>Active</span>
                        </p>
                    ) :
                        winningCombination == null && lotteryStats && lotteryStats[lotteryId] !== undefined && lotteryStats[lotteryId].counter_player == null && state.rapidoCurrentRound != lotteryId ? (
                                <p
                                    className="mb-0 rounded"
                                    style={{
                                        background: 'rgb(175 175 175)',
                                        padding: '5px',
                                        color: 'rgb(18 18 18)',
                                        marginTop: '-23px',
                                        width: '100px',
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        fontSize:14
                                    }}
                                >
                                    Canceled
                                </p>
                            ) :
                        winningCombination == null ? (
                        <p
                            className="mb-0 rounded"
                            style={{
                                background: '#f2d230',
                                padding: '5px', 
                                color: 'rgb(33 10 92)',
                                marginTop: '-23px',
                                width: '100px',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize:14
                            }}
                        >
                            <span style={{color:"#048ABF"}}>Resolving</span>
                        </p>
                    ) : (
                        <p
                            className="mb-0 rounded"
                            style={{
                                background: 'rgb(14 60 165)',
                                padding: '5px',
                                color: '#fff',
                                marginTop: '-23px',
                                width: '100px',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize:14
                            }}
                        >
                          <Check size={16} weight={'bold'} style={{position:'relative',top:-2}} color="rgb(242, 210, 48)"/>  Finished
                        </p>
                    )}
                    <p
                        className="fs-5 mb-0 mt-1 fw-regular"
                        style={{ opacity: 0.5 }}
                    >
                        #{lotteryId}
                    </p>
                </div>
                <div className="col-6 text-end">
                    {isLotteryLive ? (
                        <>
                            <p
                                className="small mb-0"
                                style={{ opacity: 0.5 }}
                            >
                                Round ends in
                            </p>
                            {formatTime()}
                        </>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </div>
    )
}
