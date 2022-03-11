import React, { useEffect, useState, useCallback, useRef } from 'react'
import { ArrowSquareOut, Ticket } from 'phosphor-react'
import axios from 'axios'
import { STATEMENT_OR_BLOCK_KEYS } from '@babel/types'

export default () => {
    const [traders, setTraders] = useState(0)

    async function getHomePageData() {
        try {
            const result = await axios.get(
                'https://privilege.digital/api/lota-get-all-orders',
            )
            //   console.log(result.data);
            setTraders(result.data.orders)
        } catch (error) {
            console.error(error)
        }
    }

    const getRank = (nr) => {
        //Add 1 to not get 0
        let rank = nr + 1

        return rank
    }

    const getRankPrize = (nr) => {
        let rank = nr + 1
        if (rank === 1) {
            return '20000'
        }
        if (rank === 2) {
            return '10000'
        }
        if (rank === 3) {
            return '3000'
        }
        if (rank === 4) {
            return '2000'
        }
        if (rank === 5) {
            return '1000'
        }
        if (rank >= 6 && rank <= 10) {
            return '400'
        }
        if (rank >= 11 && rank <= 40) {
            return '66.66'
        }
        return 0
    }

    const getRankClass = (nr) => {
        //Add 1 to not get 0
        let rank = nr + 1

        if (rank <= 5) {
            return 'big'
        } else {
            return 'normal'
        }
    }

    const getTradingVolume = () => {
        let count = 0
        traders.map((obj) => {
            count = count + obj.volume_amount
        })
        return (count / 1000000).toFixed(2)
    }

    useEffect(() => {
        document.body.classList.add('trading-competition-body')
        getHomePageData()
    }, [])
    return (
        <div className="trading-competition-wrapper">
            <div className="container trading-competition">
                <div className="trading-competition-intro">
                    <h3 className="title text-center">Trading competition</h3>
                    <div className="row text-center">
                        <div className="col-12 mb-2 text-center d-flex">
                            <div className="d-block align-self-center w-100">
                                <a
                                    href="https://dex.loop.markets/"
                                    target="_blank"
                                >
                                    <img
                                        src="https://dex.loop.markets/static/media/logo_lg.0455595b.svg"
                                        style={{
                                            width: '100%',
                                            maxWidth: '150px',
                                        }}
                                    />
                                </a>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 mx-auto mt-2">
                            <a
                                className="btn btn-outline-primary d-inline-block mx-auto"
                                href="https://docs.loterra.io/events/trading-competition"
                                target="_blank"
                            >
                                <ArrowSquareOut
                                    size={18}
                                    style={{
                                        marginTop: '-4px',
                                        marginRight: '4px',
                                    }}
                                />
                                Rules & Documentation
                            </a>
                        </div>
                        <div className="col-12 text-center">
                            <span
                                className="info"
                                style={{
                                    textTransform: 'uppercase',
                                    border: 0,
                                }}
                            >
                                <strong>Competition Period:</strong> 22nd
                                December 2021 00:00 UTC till 28th December 2021
                                23:59 UTC
                            </span>
                        </div>
                        <div className="col-12 mt-3 mb-3 text-white">
                            <h2 className="heading-table">Competition stats</h2>
                        </div>
                        <div className="col-6">
                            <div className="card stats-card">
                                <div className="card-body">
                                    <h3>
                                        <span style={{ display: 'block' }}>
                                            Total Players
                                        </span>
                                        {traders.length}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card stats-card">
                                <div className="card-body">
                                    <h3>
                                        <span style={{ display: 'block' }}>
                                            Total Volume
                                        </span>
                                        {traders && getTradingVolume()}{' '}
                                        <small
                                            style={{
                                                fontSize: '13px',
                                                opacity: 0.6,
                                            }}
                                        >
                                            LOOP + LOTA
                                        </small>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table trading-competition-table mb-5">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Volume</th>
                                <th>Prize</th>
                                <th className="text-end">Trader</th>
                            </tr>
                        </thead>
                        <tbody>
                            {traders &&
                                traders
                                    .sort((a, b) => {
                                        return b.volume_amount - a.volume_amount
                                    })
                                    .slice(0, 100)
                                    .map((obj, index) => {
                                        return (
                                            <tr
                                                className={getRankClass(index)}
                                                key={index}
                                            >
                                                <td
                                                    className="rank"
                                                    style={{ minWidth: '50px' }}
                                                >
                                                    <span
                                                        style={{
                                                            opacity: 1,
                                                            background:
                                                                '#ff36ff',
                                                            padding: '5px',
                                                            borderRadius: '3px',
                                                            marginRight: '5px',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        #{getRank(index)}
                                                    </span>
                                                </td>
                                                <td
                                                    className="amount"
                                                    style={{
                                                        minWidth: '200px',
                                                    }}
                                                >
                                                    {(
                                                        obj.volume_amount /
                                                        1000000
                                                    ).toFixed(2)}{' '}
                                                    <small
                                                        style={{
                                                            fontSize: '13px',
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        LOOP + LOTA
                                                    </small>
                                                </td>
                                                <td
                                                    className="prize"
                                                    style={{
                                                        minWidth: '100px',
                                                    }}
                                                >
                                                    <p>
                                                        ${getRankPrize(index)}{' '}
                                                        in LOTA
                                                    </p>
                                                </td>
                                                <td className="trader-address text-end">
                                                    {obj._id}
                                                </td>
                                            </tr>
                                        )
                                    })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
