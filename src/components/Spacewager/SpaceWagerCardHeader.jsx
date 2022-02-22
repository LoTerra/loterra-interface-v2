import React, { useState, useEffect } from 'react'
import {useStore} from "../../store";
import { Prohibit, PlayCircle } from 'phosphor-react';

export default function SpaceWagerCardHeader(props) {

    const { state, dispatch } = useStore()
    const {obj, isLivePrediction, isNextPrediction, isPastPrediction} = props;

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
        if (isNextPrediction) {
            dispatch({ type: 'setSpaceWagerCurrentTimeRound', message: obj[1].closing_time })
        }
    }

    function remainingTime() {
        if (isLivePrediction || isPastPrediction && obj[1].success == null){
            let timeBetween = obj[1].closing_time * 1000  - (Date.now() - 300000)
            const seconds = Math.floor((timeBetween / 1000))
            const minutes = Math.floor((timeBetween / 1000 / 60) % 60)
            let remainingTime = (parseInt(minutes) / 60) + seconds

            let percentage = ((parseInt(remainingTime) * 100) / 300)

            return percentage
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now())
            setGlobalState()
            remainingTime()
            //   console.log(currentTime, expiryTimestamp)
        }, 1000)

        return () => clearInterval(interval)
    }, [isLivePrediction])

    return (
        <>
        <div className="card-header p-3">
                        {isPastPrediction && obj[1].success == null &&
                            <div className="row">
                                <div className="col-6 text-start">
                                    <p>Resolving...</p>
                                </div>
                                <div className="col-6 text-end">
                                    <p>#{obj[0]}</p>
                                </div>
                            </div>
                        }
                        { isNextPrediction &&
                            <div className="row">
                                <div className="col-6 text-start">
                                    <div>
                                        <PlayCircle size={23} style={{position:'relative', top:-1, marginRight:5}} weight={'bold'}/>
                                        <p>NEXT</p>
                                    </div>
                                </div>
                                <div className="col-6 text-end">
                                    <p>#{obj[0]}</p>
                                </div>
                            </div>
                        }
                        { isLivePrediction &&
                            <div className="row">
                                <div className="col-6 text-start">
                                    <p>LIVE</p>
                                </div>
                                <div className="col-6 text-end">
                                    <p>{format_minutes}:{format_seconds} #{obj[0]}</p>
                                </div>
                                <div className="col-12">
                                    <div className="progress">
                                        <div
                                            className='progress-bar'
                                            color='#000000'
                                            value={remainingTime()}
                                            max={100}
                                            style={{width:remainingTime()+'%'}}
                                        >
                                            </div>
                                    </div>
                                </div>
                            </div>
                        }
                        { isPastPrediction && obj[1].success != null &&
                            <div className="row">
                                <div className="col-6 text-start">
                                    <p>
                                        FINISHED
                                    </p>
                                </div>
                                <div className="col-6 text-end">
                                    <p>#{obj[0]}</p>
                                </div>
                                {/*<div className="col-12 text-start">*/}
                                {/*    <p>*/}
                                {/*        Success:*/}
                                {/*        { obj[1].success && " true" ||  " false" }*/}
                                {/*    </p>*/}
                                {/*</div>*/}

                            </div>
                        }
        </div>
    </>
    )
}

