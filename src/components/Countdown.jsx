import React, { useState, useEffect, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'
import numeral from 'numeral'

export default function Countdown(props) {
    const { expiryTimestamp } = props

    const { seconds, minutes, hours, days, restart } = useTimer({
        autoStart: false,
        expiryTimestamp,
        onExpire: () => console.warn('onExpire called'),
    })
    const start = new Date(
        new Date(expiryTimestamp).getTime() - 84 * 60 * 60 * 1000,
    )
    const now = Date.now()
    const end = new Date(expiryTimestamp).getTime()
    let percentageTillRebase = Math.round(((now - start) / (end - start)) * 100)
    //console.log(percentageTillRebase)
    useEffect(() => {
        //console.log(expiryTimestamp)
        if (
            expiryTimestamp >
            1 /** in ordder to avoid unnecessary re-rendering/ layout */
        )
            restart(expiryTimestamp)
    }, [expiryTimestamp])

    return (
        <div className="countdown">
            {/* <div className="col-12 text-center mb-2">
                    <div className="title">Next draw in</div>
                </div>
                <div className="col-12">
                    <div className="progress"> */}
            {/* <div
                            className="progress-bar special"
                            role="progressbar"
                            style={{ width: percentageTillRebase + '%' }}
                            aria-valuenow={percentageTillRebase}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        > */}
            {/* {numeral(percentageTillRebase).format('0')}% */}
            {/* </div> */}
            {/* </div>
                </div> */}

            {expiryTimestamp > new Date() ? (
                <div className="row text-center">
                    <div className="col-3 mb-3 p-1">
                        <div className="card base-card-light">
                            <div className="card-body">
                                <div className="font-bold time" x-text="days">
                                    {expiryTimestamp > 1
                                        ? days.toString().padStart(2, 0)
                                        : '-'}
                                </div>
                                <div className="text-sm time-low">Days</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-3 mb-3 p-1">
                        <div className="card base-card-light">
                            <div className="card-body">
                                <div className="font-bold time" x-text="hours">
                                    {expiryTimestamp > 1
                                        ? hours.toString().padStart(2, 0)
                                        : '-'}
                                </div>
                                <div className="text-sm time-low">Hours</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-3 mb-3 p-1">
                        <div className="card base-card-light">
                            <div className="card-body">
                                <div
                                    className="font-bold time"
                                    x-text="minutes"
                                >
                                    {expiryTimestamp > 1
                                        ? minutes.toString().padStart(2, 0)
                                        : '-'}
                                </div>
                                <div className="text-sm time-low">Minutes</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-3 mb-3 p-1">
                        <div className="card base-card-light">
                            <div className="card-body">
                                <div
                                    className="font-bold time"
                                    x-text="seconds"
                                >
                                    {expiryTimestamp > 1
                                        ? seconds.toString().padStart(2, 0)
                                        : '-'}
                                </div>
                                <div className="text-sm time-low">Seconds</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row text-center">
                    <div className="col px-1">
                        <div className="font-bold time">
                            <div>On sale soon</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
