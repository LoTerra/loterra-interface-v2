import { Pencil, Trash, Trophy, X, XCircle } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { useStore } from '../../store'
import { WasmAPI } from '@terra-money/terra.js'
import { Lightning, Star } from 'phosphor-react'
import Animation from './animation.svg'

export default function RapidoCardBody(props) {
    const { state, dispatch } = useStore()

    const {
        selectMultiplier,
        selectNrOfDraws,
        selectOneNumber,
        selectFourNumbers,
        fourNumbers,
        oneNumber,
        multiplier,
        nrOfDraws,
        userGames,
        winningCombination,
        bonusNumber,
        lotteryId,
        isLotteryLive,
        toDefault,
        switchToDefault,
        lotteryStats
    } = props

    const [numberOne, setNumberOne] = useState('')
    const [numberTwo, setNumberTwo] = useState('')
    const [numberThree, setNumberThree] = useState('')
    const [numberFour, setNumberFour] = useState('')
    const [numberBonus, setNumberBonus] = useState('')

    const selectNumbers = (nr) => {
        if (!numberOne) {
            setNumberOne(nr)
        } else if (!numberTwo) {
            setNumberTwo(nr)
        } else if (!numberThree) {
            setNumberThree(nr)
        } else if (!numberFour) {
            setNumberFour(nr)
        } else {
            alert('deselect a number, max is 4')
        }
    }

    const selectBonus = (nr) => {
        setNumberBonus(nr)
    }

    function removeNumberFromArray(nr) {
        switch (nr) {
            case 1:
                setNumberOne('')
                break
            case 2:
                setNumberTwo('')
                break
            case 3:
                setNumberThree('')
                break
            case 4:
                setNumberFour('')
                break
            case 5:
                setNumberBonus('')
                break
        }
    }

    function checkUserGames(id) {
        if (userGames.length > 0) {
            console.log(
                'found',
                userGames.filter((a) => a.lottery_id == id),
                id,
            )
            if (
                userGames.filter((a) => parseInt(a.lottery_id) == parseInt(id))
                    .lenght > 0
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    useEffect(() => {

        if (toDefault) {
            setNumberOne('')
            setNumberTwo('')
            setNumberThree('')
            setNumberFour('')
            setNumberBonus('')
            switchToDefault(false)
        }

        if (numberOne || numberTwo || numberThree || numberFour) {
            selectFourNumbers([numberOne, numberTwo, numberThree, numberFour])
        } else {
            selectFourNumbers([])
        }

        if (numberBonus) {
            selectOneNumber([numberBonus])
        } else {
            selectOneNumber([])
        }
    }, [numberOne, numberTwo, numberThree, numberFour, numberBonus, toDefault])

    return (
        <div className={'card-body' + (isLotteryLive ? ' pt-0' : '')}>
            {/*{ lotteryId &&*/}
            {/*    <p>{checkUserGames(lotteryId) ? 'You played this' : 'You played not'}</p>*/}
            {/*}*/}
            {isLotteryLive ? (
                <div className="row px-2">
                    <div className="col-12 text-center">
                        <div className="col-12 mb-2">
                            <div className={'rapido-winning-combination'}>
                                <button
                                    type="button"
                                    className="rapido-combi-nr big text-white"
                                    style={{
                                        padding: '0',
                                        border: 'none',                                        
                                        outline: 'none',
                                    }}
                                    onClick={() => removeNumberFromArray(1)}
                                >
                                    {!numberOne ? (
                                        <Lightning
                                            size={25}
                                            weight={'fill'}
                                            style={{
                                                position: 'relative',
                                                opacity: 0.5,
                                                top: '-3px',
                                                marginRight: 1,
                                            }}
                                        />
                                    ) : (
                                        <>
                                            {numberOne}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="rapido-combi-nr big text-white"
                                    style={{
                                        padding: '0',
                                        border: 'none',                              
                                        outline: 'none',
                                    }}
                                    onClick={() => removeNumberFromArray(2)}
                                >
                                    {!numberTwo ? (
                                        <Lightning
                                            size={25}
                                            weight={'fill'}
                                            style={{
                                                position: 'relative',
                                                opacity: 0.5,
                                                top: '-3px',
                                                marginRight: 1,
                                            }}
                                        />
                                    ) : (
                                        <>
                                            {numberTwo}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="rapido-combi-nr big text-white"
                                    style={{
                                        padding: '0',
                                        border: 'none',                                       
                                        outline: 'none',
                                    }}
                                    onClick={() => removeNumberFromArray(3)}
                                >
                                    {!numberThree ? (
                                        <Lightning
                                            size={25}
                                            weight={'fill'}
                                            style={{
                                                position: 'relative',
                                                opacity: 0.5,
                                                top: '-3px',
                                                marginRight: 1,
                                            }}
                                        />
                                    ) : (
                                        <>
                                            {numberThree}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="rapido-combi-nr big text-white"
                                    style={{
                                        padding: '0',
                                        border: 'none',                            
                                        outline: 'none',
                                    }}
                                    onClick={() => removeNumberFromArray(4)}
                                >
                                    {!numberFour ? (
                                        <Lightning
                                            size={25}
                                            weight={'fill'}
                                            style={{
                                                position: 'relative',
                                                opacity: 0.5,
                                                top: '-3px',
                                                marginRight: 1,
                                            }}
                                        />
                                    ) : (
                                        <>
                                            {numberFour}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="rapido-combi-nr g big text-white"
                                    style={{
                                        padding: '0',
                                        border: 'none',                                      
                                        outline: 'none',
                                    }}
                                    onClick={() => removeNumberFromArray(5)}
                                >
                                    {!numberBonus ? (
                                        <Star
                                            size={25}
                                            weight={'fill'}
                                            style={{
                                                position: 'relative',
                                                opacity: 0.5,
                                                top: '-3px',
                                                marginRight: 1,
                                            }}
                                        />
                                    ) : (
                                        <>
                                        {numberBonus}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        hidden={
                            numberOne && numberTwo && numberThree && numberFour
                        }
                        className="col-12 p-2 mb-3"
                        style={{
                            border: '3px solid #048ABF',
                            borderRadius: '10px',
                            background: '#210a5c69',
                        }}
                    >
                        <p className="fs-6 fw-bold text-center mb-0 label-four">
                            Select 4 numbers
                        </p>
                        <div className="btn-holder">
                            {[
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                                15, 16,
                            ].map((obj, k) => {
                                return (
                                    <button
                                        type="button"
                                        key={k}
                                        className={'nr-btn smaller'}
                                        value={obj}
                                        onClick={(e) => selectNumbers(obj)}
                                    >
                                        {obj}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div
                        hidden={
                            numberBonus ||
                            !numberOne ||
                            !numberTwo ||
                            !numberThree ||
                            !numberFour
                        }
                        className="col-12 p-2"
                        style={{
                            border: '3px solid #F2D230',
                            borderRadius: '10px',
                            background: '#210a5c69',
                        }}
                    >
                        <p className="fs-6 fw-bold text-center mb-0 label-one">
                            Tick 1 star
                        </p>
                        <div className="btn-holder">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((obj, k) => {
                                return (
                                    <button
                                        type="button"
                                        key={k}
                                        className={
                                            'nr-btn smaller' +
                                            (numberBonus == obj
                                                ? ' active-g'
                                                : '')
                                        }
                                        value={obj}
                                        onClick={(e) => selectBonus(obj)}
                                    >
                                        {obj}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="col-12 mt-2 p-0">
                        <div className="btn-holder text-end">
                            {[1, 2, 5].map((obj, k) => {
                                return (
                                    <button
                                        key={k}
                                        className={
                                            'nr-btn medium multiplier' +
                                            (multiplier == obj
                                                ? ' active-i'
                                                : '')
                                        }
                                        onClick={(e) => selectMultiplier(obj)}
                                    >
                                        <span
                                            className="d-block small"
                                            style={{
                                                fontSize: '12px',
                                                opacity: 0.6,
                                                fontWeight: 400,
                                                marginBottom: '-4px',
                                            }}
                                        >
                                            Multiplier
                                        </span>
                                        x{obj} UST
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="row">
                            <div className="col-7 d-flex">
                                <p className="mb-0 align-self-center fw-bold">
                                    Number of draws:
                                </p>
                            </div>
                            <div className="col-5">
                                <select
                                    style={{fontSize: "x-large", fontWeight: "bold"}}
                                    className="form-control text-center"
                                    onChange={(e) =>
                                        selectNrOfDraws(e.target.value)
                                    }
                                >
                                    {[1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 100, 200, 300, 555, 777].map(
                                        (obj, k) => {
                                            return (
                                                <option key={k} value={obj}>
                                                    {obj}
                                                </option>
                                            )
                                        },
                                    )}
                                </select>
                            </div>
                            {/* <div className="col-7">
                            <div className="btn-holder text-end">
                                {[1,2,3,4,5,10,20,30,40,50].map((obj,k) =>{
                                    return (
                                        <button key={k} className={'nr-btn medium-s' + (nrOfDraws == obj ? ' active-i' : '')} onClick={(e) => selectNrOfDraws(obj)}>{obj}</button>
                                    )
                                })}
                            </div>
                        </div> */}
                        </div>
                    </div>
                </div>
            ) :
                winningCombination == null && !isLotteryLive && lotteryStats && lotteryStats[lotteryId].count_player == null && state.rapidoCurrentRound != lotteryId?

                (
                    <div className="col-12 text-center">
                        <div className="col-12 mb-2">
                            <div className={'rapido-winning-combination'}>
                                <p className="small text-muted">
                                    This Draw’s closing transaction has been
                                    canceled because no player detected
                                </p>
                            </div>
                        </div>
                    </div>
                )

                :  winningCombination != null && !isLotteryLive ? (
                        <div className="col-12 text-center">
                            {/*<img src="/trophy.gif" alt="Trophy..." width="50%" height="50%"/>*/}
                            <Trophy
                                size={55}
                                weight="fill"
                                fill={'#f2d230'}
                                className="mx-auto mb-3"
                            />
                            <h4 className="fs-5">Winning number</h4>
                            <div className="col-12 mb-2">
                                <div className={'rapido-winning-combination'}>
                                    {winningCombination.map((nr, k) => {
                                        return (
                                            <span
                                                key={k}
                                                className="rapido-combi-nr medium"
                                            >
                                        {nr}
                                    </span>
                                        )
                                    })}
                                    <span className="rapido-combi-nr g medium">
                                {bonusNumber}
                            </span>

                                </div>
                            </div>
                        </div>
                    )
                : (
                <div className="col-12 text-center">
                    <div className="col-12 mb-2">
                        <div className={'rapido-winning-combination'}>
                            <div className="resolving-svg">
                                {/*<Animation/>*/}
                                <div className="circle-loader">
                                    <div className="circle-loader-container">
                                        <span className="circle b"></span>
                                        <span className="circle b"></span>
                                        <span className="circle b"></span>
                                        <span className="circle y"></span>
                                        <span className="circle y"></span>
                                    </div>
                                </div>
                            </div>
                            <p className="small text-muted">
                                This Draw’s closing transaction has been
                                submitted to the blockchain, and is awaiting
                                confirmation. May the luck be with you!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
