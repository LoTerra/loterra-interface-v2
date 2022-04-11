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
                                background: 'rgb(191 4 107)',
                                padding: '5px',
                                marginTop: '-23px',
                                width: '100px',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize:14
                            }}
                        >
                            <span style={{color:"#F2D230"}}>Active</span>
                        </p>
                    ) :
                        winningCombination == null && lotteryStats && lotteryStats[lotteryId].counter_player == null && state.rapidoCurrentRound != lotteryId ? (
                                <p
                                    className="mb-0 rounded"
                                    style={{
                                        background: 'rgb(37 12 103)',
                                        padding: '5px',
                                        color: 'rgb(255 255 255 / 26%)',
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
                                background: 'rgb(40 12 114)',
                                padding: '5px',
                                color: 'rgb(155 129 225)',
                                marginTop: '-23px',
                                width: '100px',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize:14
                            }}
                        >
                          <Check size={16} style={{position:'relative',top:-2}} color="rgb(242, 210, 48)"/>  Finished
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
                                style={{ color: '#fff', opacity: 0.5 }}
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
