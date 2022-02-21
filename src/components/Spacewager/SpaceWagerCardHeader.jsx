import React, { useState, useEffect } from 'react'
import {useStore} from "../../store";

export default function SpaceWagerCardHeader(props) {

    const { state, dispatch } = useStore()
    const {obj} = props;

    const [currentTime, setCurrentTime] = useState(Date.now())

    const timeBetween = obj[1].closing_time * 1000  - (currentTime - 300000)
    const seconds = Math.floor((timeBetween / 1000) % 60)
    const minutes = Math.floor((timeBetween / 1000 / 60) % 60)
    let format_minutes = minutes < 10 ? "0" + minutes : minutes;
    let format_seconds = seconds < 10 ? "0" + seconds : seconds;

    const hours = Math.floor((timeBetween / (1000 * 60 * 60)) % 24)
    const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24))

    const one_percent = parseInt(obj[1].closing_time * 1000) / 100
    const percentage = parseInt(currentTime / one_percent);

    function setGlobalState(){

        if (obj[1].closing_time * 1000 < Date.now() && obj[1].closing_time * 1000 > Date.now() - 300000) {
            dispatch({ type: 'setSpaceWagerCurrentTimeRound', message: obj[1].closing_time })
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now())
            setGlobalState()
            //   console.log(currentTime, expiryTimestamp)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
        <div className="card-header p-3">
                        { obj[1].closing_time * 1000 > Date.now() &&
                            <div className="row">
                                <div className="col-6 text-start">
                                    <p>NEXT</p>
                                </div>
                            </div>
                        }
                        { obj[1].closing_time * 1000 < Date.now() && obj[1].closing_time * 1000 > Date.now() - 300000 &&
                            <div className="row">
                                <div className="col-6 text-start">
                                    <p>LIVE</p>
                                </div>
                                <div className="col-6 text-end">
                                    <p>{format_minutes}:{format_seconds} #{obj[0]}</p>
                                </div>
                                <div className="col-12">
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar" style={{width:'100%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        }
                        { obj[1].closing_time * 1000 < Date.now() && obj[1].closing_time * 1000 < Date.now() - 300000 &&
                            <div className="row">
                                <div className="col-6 text-start">
                                    <p>FINISHED</p>
                                </div>
                                <div className="col-6 text-end">
                                    <p>#{obj[0]}</p>
                                </div>
                            </div>
                        }
                    </div>
    </>
    )
}

