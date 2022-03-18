import React, { useState } from 'react'
import { useStore } from '../../store'
import Nouislider from 'nouislider-react'
import 'nouislider/distribute/nouislider.css'

import { Ticket } from 'phosphor-react'

export default function Personal() {
    const { state, dispatch } = useStore()

    const [amount, setAmount] = useState(1000)
    const [percentage, setPercentage] = useState(50)
    const onSlideChange = (render, handle, value, un, percent) => {
        setPercentage(percent[0].toFixed(2))
    }

    const removeDoGether = (e) => {
        console.log('Remove Dogether with: ', amount, percentage)
    }

    return (
        <>
            <div className="dogether-settings-info">
                <div className="row">
                    <div className="col-6">
                        <p className="m-0">Current UST in Dogether pool</p>
                        <h3 className="text-start">1000 UST</h3>
                    </div>
                    <div className="col-6">
                        <p className="m-0" style={{ color: '#F2D230' }}>
                            Current Profit UST
                        </p>
                        <h3 className="text-start" style={{ color: '#F2D230' }}>
                            100 UST
                        </h3>
                    </div>
                    <div className="col-12">
                        <p>Your current dogether stats</p>
                    </div>
                    <div className="col-4 mb-3">
                        <div className="card stats-card">
                            <div className="card-body">
                                <small className="d-block">
                                    PERCENTAGE DOGETHER
                                </small>
                                <h4>{percentage}%</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mb-3">
                        <div className="card stats-card">
                            <div className="card-body">
                                <small className="d-block">
                                    NR TICKETS A DRAW
                                </small>
                                <h4>
                                    <Ticket
                                        size={30}
                                        color={'#ffffff'}
                                        style={{
                                            position: 'relative',
                                            top: '-3px',
                                            marginRight: '4px',
                                        }}
                                    />
                                    {(
                                        (((((amount / 100) * percentage) /
                                            100) *
                                            20) /
                                            356) *
                                        3
                                    ).toFixed(2)}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mb-3">
                        <div className="card stats-card">
                            <div className="card-body">
                                <small className="d-block">
                                    NR TICKETS A YEAR
                                </small>
                                <h4>
                                    <Ticket
                                        size={30}
                                        color={'#ffffff'}
                                        style={{
                                            position: 'relative',
                                            top: '-3px',
                                            marginRight: '4px',
                                        }}
                                    />
                                    {(
                                        ((((amount / 100) * percentage) / 100) *
                                            20) /
                                        1
                                    ).toFixed(2)}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 my-3">
                        <div className="row">
                            <div className="col-12">
                                <p style={{ color: '#F2D230' }}>
                                    + Average profits
                                </p>
                            </div>
                            <div className="col-4">
                                <div className="card stats-card">
                                    <div className="card-body">
                                        <small
                                            className="d-block"
                                            style={{ color: '#F2D230' }}
                                        >
                                            DAILY
                                        </small>
                                        <h4>
                                            {(
                                                (((((amount / 100) *
                                                    (100 - percentage)) /
                                                    100) *
                                                    20) /
                                                    365) *
                                                1
                                            ).toFixed(2)}{' '}
                                            UST
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card stats-card">
                                    <div className="card-body">
                                        <small
                                            className="d-block"
                                            style={{ color: '#F2D230' }}
                                        >
                                            MONTHLY
                                        </small>
                                        <h4>
                                            {(
                                                (((((amount / 100) *
                                                    (100 - percentage)) /
                                                    100) *
                                                    20) /
                                                    365) *
                                                30
                                            ).toFixed(2)}{' '}
                                            UST
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card stats-card">
                                    <div className="card-body">
                                        <small
                                            className="d-block"
                                            style={{ color: '#F2D230' }}
                                        >
                                            YEARLY
                                        </small>
                                        <h4>
                                            {(
                                                (((amount / 100) *
                                                    (100 - percentage)) /
                                                    100) *
                                                20
                                            ).toFixed(2)}{' '}
                                            UST
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <h5 className="mt-4 mb-2">
                                    Change your dogether settings
                                </h5>
                                <div className="input-group mb-3">
                                    <span
                                        className="input-group-text"
                                        id="basic-addon1"
                                    >
                                        <img
                                            src="/UST.svg"
                                            width="30px"
                                            className="img-fluid"
                                        />
                                    </span>
                                    <input
                                        type="number"
                                        className="form-control amount-input-staking"
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        value={amount}
                                        autoComplete="off"
                                        placeholder="0.00"
                                        name="amount"
                                    />
                                </div>
                                <Nouislider
                                    className="slider-round"
                                    connect={[true, false]}
                                    start={percentage}
                                    onSlide={onSlideChange}
                                    step={1}
                                    range={{
                                        min: 0,
                                        max: 100,
                                    }}
                                    pips={{
                                        mode: 'values',
                                        values: [0, 50, 100],
                                        density: 4,
                                    }}
                                />
                                <button
                                    className="btn btn-special w-100 mt-4"
                                    onClick={(e) => removeDoGether()}
                                >
                                    Change Dogether
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <p>{amount}</p>
            <p>{percentage}</p> */}
            </div>
        </>
    )
}
