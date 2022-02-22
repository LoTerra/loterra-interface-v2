import React, { useState, useEffect } from 'react'
import {useStore} from "../../store";
import { Prohibit, PlayCircle } from 'phosphor-react';
import { Progress } from 'bootstrap';

export default function SpaceWagerCardHeader(props) {

    const { state, dispatch } = useStore()
    const {obj, currentTimeRound} = props;

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

    function remainingTime(currentTimeRound) {
        let timeBetween = currentTimeRound * 1000  - (Date.now() - 300000)
            const seconds = Math.floor((timeBetween / 1000))
            const minutes = Math.floor((timeBetween / 1000 / 60) % 60)
            let remainingTime = (parseInt(minutes) / 60) + seconds

            let percentage = ((parseInt(remainingTime) * 100) / 300)
            
            return percentage
            
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now())
            setGlobalState()
            remainingTime(currentTimeRound)
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
                        <p>
                            <PlayCircle size={23} style={{position:'relative', top:-1, marginRight:5}} weight={'bold'}/> 
                            NEXT
                        </p>
                    </div>
                    <div className="col-6 text-end">
                        <p>#{obj[0]}</p>
                    </div>
                </div>
            }
            { obj[1].closing_time * 1000 < Date.now() && obj[1].closing_time * 1000 > Date.now() - 300000 &&
                <div className="row">
                    <div className="col-6 text-start">
                        <p>
                            <PlayCircle size={23} style={{position:'relative', top:-1, marginRight:5}} weight={'bold'}/> 
                            LIVE
                        </p>
                    </div>
                    <div className="col-6 text-end">
                        <p>#{obj[0]}</p>
                    </div>
                    <div className="col-12">
                        <div className="progress">
                            <progress 
                                className='progress-bar'
                                color='#000000'
                                value={remainingTime(currentTimeRound)}
                                max={100}
                                style={{width:'100%'}}
                            />
                        </div>
                        
                    </div>
                </div>
            }
            { obj[1].closing_time * 1000 < Date.now() && obj[1].closing_time * 1000 < Date.now() - 300000 &&
                <div className="row">
                    <div className="col-6 text-start">
                        <p>
                            <Prohibit size={23} style={{position:'relative', top:-1, marginRight:5}} weight={'bold'}/> 
                            FINISHED
                        </p>
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

