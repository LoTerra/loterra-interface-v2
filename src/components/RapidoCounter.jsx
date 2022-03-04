import React, { useState, useEffect } from 'react'
import { useTimer } from 'react-timer-hook';

export default function RapidoCounter(props) {

    const {expiryTimestamp} = props;

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
        <>
        {expiryTimestamp > new Date() ? (
        <span>{days.toString().padStart(2, 0)}:{hours.toString().padStart(2, 0)}:{minutes.toString().padStart(2, 0)}:{seconds.toString().padStart(2, 0)}</span>
        ) : 'Expired' }
        </>
    )
}
