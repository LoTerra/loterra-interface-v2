import React, { useState } from 'react'
import { useStore } from '../../store'
import numeral from 'numeral'
import {
    Bank,
    Check,
    Info,
    Ticket,
    Coin,
    User,
    UsersFour,
} from 'phosphor-react'

// import Nouislider from "nouislider-react";
// import "nouislider/distribute/nouislider.css";
import { Coins, MsgExecuteContract, Fee, WasmAPI } from '@terra-money/terra.js'
import { useEffect } from 'react'
const obj = new Fee(700_000, { uusd: 319200 })

export default function Main(props) {
    const { state, dispatch } = useStore()
    const { showNotification } = props
    const [agreement, setAgreement] = useState(false)
    const [amount, setAmount] = useState(285)
    const [percentage, setPercentage] = useState(100)
    const [dogetherUserStats, setDogetherUserStats] = useState([])
    const [earning, setEarning] = useState(0)

    // const onSlideChange = (render, handle, value, un, percent) => {
    //     setPercentage(percent[0].toFixed(2))
    // }

    const anchorPercentage = 18

    function doGether(e) {
        //   console.log('Dogether with: ', amount, percentage)
        if (!agreement) {
            showNotification('You need to accept the agreement', 'error', 4000)
            return
        }
        if (amount <= 0) return
        let msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.dogetherAddress,
            {
                pool: {},
            },
            { uusd: parseFloat(amount) * 1000000 },
        )
        state.wallet
            .post({
                msgs: [msg],
                gasPrices: obj.gasPrices(),
                gasAdjustment: 1.7,
            })
            .then((e) => {
                if (e.success) {
                    showNotification('Pool success', 'success', 4000)
                } else {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e)
                showNotification(e.message, 'error', 4000)
            })
    }
    function doGetherUnstake() {
        //console.log('Dogether with: ', amount, percentage)
        if (amount <= 0) return
        let msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.dogetherAddress,
            {
                un_pool: { amount: String(parseFloat(amount) * 1000000) },
            },
        )
        state.wallet
            .post({
                msgs: [msg],
                gasPrices: obj.gasPrices(),
                gasAdjustment: 1.7,
            })
            .then((e) => {
                console.log(e)
                if (e.success) {
                    showNotification('UnPool success', 'success', 4000)
                } else {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e)
                showNotification(e.message, 'error', 4000)
            })
    }

    function claimInfo() {
        if (state.holderClaimsDogether) {
            let total_amount_claimable = 0
            state.holderClaimsDogether.map((e) => {
                if (e.release_at.at_height < state.blockHeight) {
                    total_amount_claimable += parseInt(e.amount)
                }
            })
            return total_amount_claimable / 1000000
        }
        return 0
    }
    function pendingClaim() {
        if (state.holderClaimsDogether) {
            let total_amount_pending = 0
            state.holderClaimsDogether.map((e) => {
                if (e.release_at.at_height > state.blockHeight) {
                    total_amount_pending += parseInt(e.amount)
                }
            })
            return total_amount_pending / 1000000
        }
        return 0
    }

    function claimUnstake(amount) {
        const msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.dogetherAddress,
            {
                claim_un_pool: {},
            },
        )
        if (amount) {
            msg.coins = new Coins({ uusd: amount })
        }
        state.wallet
            .post({
                msgs: [msg],
                gasPrices: obj.gasPrices(),
                gasAdjustment: 1.7,
            })
            .then((e) => {
                if (e.success) {
                    showNotification('Claim unPool success', 'success', 4000)
                } else {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e.message)
                showNotification(e.message, 'error', 4000)
            })
    }

    function totalBalance() {
        return state.totalBalancePoolDogether / 1000000
    }

    function userBalance() {
        return parseInt(state.balanceStakeOnDogether) / 1000000
    }

    async function accrued_rewards() {
        const api = new WasmAPI(state.lcd_client.apiRequester)
        let dogether_holder = await api.contractQuery(
            'terra1z2vgthmdy5qlz4cnj9d9d3ajtqeq7uzc0acxrp',
            {
                accrued_rewards: {
                    address: state.wallet.walletAddress,
                },
            },
        )
        setEarning(parseInt(dogether_holder.rewards))
    }

    useEffect(() => {
        if (state.wallet.walletAddress) {
            fetch(
                'https://privilege.digital/api/get-dogether-user?address=' +
                state.wallet.walletAddress,
            )
                .then((response) => response.json())
                .then((data) => setDogetherUserStats(data.user.info))
                .catch((e) => console.log(e))
            accrued_rewards()
        }
    }, [state.wallet.walletAddress])

    return (
        <>
            <div className="col-md-12 mb-4">
                <div className="card lota-card staking dogether-card mt-5"
                     style={{
                         borderRadius: '20px'
                     }}
                >
                    <div className="card-body">
                        <h2 className="text-center">
                            <span className="d-block heading-1"
                                  style={{color: '#F2D230'}}
                            >
                                Current pool balance
                            </span>
                            {totalBalance() ? (
                                <>
                                    <span className="d-block nr-1">
                                        {numeral(totalBalance()).format(
                                            '0,0.00',
                                        )}{' '}
                                        <small>UST</small>
                                    </span>
                                    <span className="d-inline-block nr-2">
                                        <span className="d-block heading-2"
                                              style={{color: '#F2D230'}}
                                        >
                                            Tickets a week
                                        </span>
                                        {numeral(
                                            (((((totalBalance() / 100) *
                                                            percentage) /
                                                        100) *
                                                    anchorPercentage) /
                                                356) *
                                            7,
                                        ).format('0,0.00')}
                                    </span>
                                    <span className="d-inline-block nr-2">
                                        <span className="d-block heading-2"
                                              style={{color: '#F2D230'}}
                                        >
                                            Tickets a year
                                        </span>
                                        {numeral(
                                            ((((totalBalance() / 100) *
                                                        percentage) /
                                                    100) *
                                                anchorPercentage) /
                                            1,
                                        ).format('0,0.00')}
                                    </span>
                                    <span className="d-inline-block nr-3">
                                        <span className="d-block heading-2"
                                              style={{color: '#F2D230'}}
                                        >
                                            Next draw tickets
                                        </span>
                                        {' ' +
                                        new Date(
                                            parseInt(
                                                state.dogetherState
                                                    .next_draw,
                                            ) * 1000,
                                        ).toUTCString()}
                                    </span>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div
                                        className="spinner-border"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            )}
                        </h2>
                    </div>
                    <span className="info mb-3" style={{ color: '#ffffffeb' }}>
                        ⚠️ We are in contact with security audit, until a full
                        audit report we recommend to use Dogether at your own
                        discretion and risk.
                    </span>

                    <div className="row mb-3">
                        <div className="col-md-12">
                            <h3>How it works</h3>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card stats-card d-flex py-3 text-center">
                                <span className="nr">1</span>
                                <Coin
                                    size={48}
                                    color={'#F2D230'}
                                    className="mx-auto"
                                />
                                <p
                                    className="align-self-center w-100 m-0 mt-2"
                                    style={{ fontSize: '14px' }}
                                >
                                    Pool your UST on Dogether
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card stats-card d-flex py-3 text-center">
                                <span className="nr">2</span>
                                <img
                                    src="/anchor.svg"
                                    width="48px"
                                    className="img-fluid mx-auto"
                                />
                                <p
                                    className="align-self-center w-100 m-0 mt-2"
                                    style={{ fontSize: '14px' }}
                                >
                                    Earn yield from UST on Anchor
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card stats-card d-flex py-3 text-center">
                                <span className="nr">3</span>
                                <Ticket
                                    size={48}
                                    color={'#F2D230'}
                                    className="mx-auto"
                                />
                                <p
                                    className="align-self-center w-100 m-0 mt-2"
                                    style={{ fontSize: '14px' }}
                                >
                                    Dogether buys tickets from yield
                                </p>
                            </div>
                        </div>
                    </div>
                    <p
                        className="text-center"
                        style={{
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '12px',
                        }}
                    >
                        <Info size={24} style={{ color:'#ffffff', marginTop: '-4px' }} />{' '}
                        Dogether will automatically buy tickets for LoTerra
                        Lottery, enjoy the possibility to win thousands of
                        $UST prizes every week!
                    </p>

                    <div className="row mb-4">
                        <div className="col-md-12">
                            <h3>Games</h3>
                        </div>
                        <div className="col-md-6 mb-4">
                            <div className="card stats-card d-flex py-3 text-center">
                                <p className="badge-status active"
                                   style={{
                                       background:'#F2D230',
                                       color: '#ffffff'
                                   }}
                                >
                                    Active
                                </p>
                                <User
                                    size={48}
                                    color={'#F2D230'}
                                    className="mx-auto"
                                />
                                <p className="mb-0">
                                    <strong>Solo</strong>
                                </p>
                                <p
                                    className="w-100 m-0"
                                    style={{ fontSize: '14px' }}
                                >
                                    Everything is yours
                                </p>
                            </div>
                        </div>
                        <div
                            className="col-md-6 mb-4"
                            style={{ opacity: 0.5 }}
                        >
                            <div className="card stats-card d-flex py-3 text-center">
                                <p className="badge-status inactive"
                                   style={{
                                       background:'#F2D230',
                                       color: '#ffffff'
                                   }}
                                >
                                    Coming soon
                                </p>
                                <UsersFour
                                    size={48}
                                    color={'#F2D230'}
                                    className="mx-auto"
                                />
                                <p className="mb-0">
                                    <strong>Coop</strong>
                                </p>
                                <p
                                    className="w-100 m-0"
                                    style={{ fontSize: '14px' }}
                                >
                                    Shared between all players
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card lota-card staking dogether-card mt-5"
                 style={{
                     borderRadius: '20px'
                 }}
            >
                <p className="input-heading mt-3" style={{}}>
                    The amount you want to pool
                </p>
                <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1"
                              style={{
                                  background:"#331093"
                              }}
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
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                        autoComplete="off"
                        placeholder="0.00"
                        name="amount"
                    />
                </div>
                {/* <Nouislider className="slider-round"
                                connect={[true, false]}
                                start={percentage}
                                onSlide={onSlideChange}
                                step={1}
                                range={{
                                min: 0,
                                max: 100
                                }}
                                pips={{
                                mode: 'values',
                                values: [0,50, 100],
                                density: 4
                                }}
                                /> */}
                <div className="dogether-settings-info">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="card stats-card">
                                <div className="card-body">
                                    <small className="d-block"
                                           style={{
                                               color: '#ffffff'
                                           }}
                                    >
                                        NR TICKETS A WEEK
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
                                            (((((amount / 100) *
                                                            percentage) /
                                                        100) *
                                                    anchorPercentage) /
                                                356) *
                                            7
                                        ).toFixed(2)}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="card stats-card">
                                <div className="card-body">
                                    <small className="d-block"
                                           style={{
                                               color:'#ffffff'
                                           }}
                                    >
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
                                            ((((amount / 100) *
                                                        percentage) /
                                                    100) *
                                                anchorPercentage) /
                                            1
                                        ).toFixed(2)}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-12 my-3">
                <div className="row">
                    <div className="col-12">
                        <p style={{color:'#82f3be'}}>+ Average profits</p>
                    </div>
                <div className="col-4">
                    <div className="card stats-card">
                        <div className="card-body">
                        <small className="d-block" style={{color:'#82f3be'}}>DAILY</small>
                        <h4>{(amount / 100 * (100 - percentage) / 100 * 20 / 365 * 1).toFixed(2)} UST</h4>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card stats-card">
                        <div className="card-body">
                        <small className="d-block" style={{color:'#82f3be'}}>MONTHLY</small>
                        <h4>{(amount / 100 * (100 - percentage) / 100 * 20 / 365 * 30).toFixed(2)} UST</h4>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card stats-card">
                        <div className="card-body">
                        <small className="d-block" style={{color:'#82f3be'}}>YEARLY</small>
                        <h4>{(amount / 100 * (100 - percentage) / 100 * 20).toFixed(2) } UST</h4>
                        </div>
                    </div>
                </div>
                </div>
                </div> */}
                        <div className="col-md-12">
                            <label
                                className="info"
                                style={{
                                    color: '#a7a2bd',
                                    fontSize: '14px',
                                }}
                            >
                                <input
                                    value={agreement}
                                    type="checkbox"
                                    onChange={(e) =>
                                        setAgreement(!agreement)
                                    }
                                />
                                ⚠️ I agree using Dogether at my own
                                discretion and risk.
                            </label>
                        </div>
                        <div className="col-md-6 mb-3">
                            <button
                                className="btn btn-normal-lg w-100 mt-2"
                                style={{background: '#F2D230'}}
                                onClick={(e) => doGether()}
                                disabled={!agreement}
                            >
                                Pool
                            </button>
                            <strong
                                className="w-100 text-end d-block mt-2"
                                style={{
                                    textDecoration: 'underline',
                                    fontSize: '13px',
                                    opacity: 0.6,

                                }}
                                onClick={() => setAmount(state.ustBalance)}
                            >
                                MAX:{' '}
                                {state.ustBalance
                                    ? state.ustBalance.toFixed(2)
                                    : 0}{' '}
                                UST
                            </strong>
                        </div>
                        <div className="col-md-6 mb-3">
                            <button
                                className="btn btn-plain-lg w-100 mt-2"
                                style={{
                                    background: "#2e0e85"
                                }}
                                onClick={(e) => doGetherUnstake()}
                            >
                                UnPool
                            </button>
                            <strong
                                className="w-100 text-end d-block mt-2"
                                style={{
                                    textDecoration: 'underline',
                                    fontSize: '13px',
                                    opacity: 0.6,
                                }}
                                onClick={() =>
                                    setAmount(
                                        parseInt(
                                            state.balanceStakeOnDogether,
                                        ) / 1000000,
                                    )
                                }
                            >
                                MAX:{' '}
                                {parseInt(state.balanceStakeOnDogether) /
                                1000000}{' '}
                                UST
                            </strong>
                            <small
                                className="w-100 text-end d-block"
                                style={{ color: '#9186c3' }}
                            >
                                Instant unPool or UnPool period 100000
                                blockheight ~7 days
                            </small>
                        </div>

                        {userBalance() > 0 && (
                            <div className="col-md-12 my-3">
                                <div
                                    className="current-dogether-stats"
                                    style={{
                                        color: '#fff',
                                        padding: '7px',
                                        borderRadius: '10px',
                                        border: '3px',
                                        borderColor:'#F2D230'
                                    }}
                                >
                                    <p className="mb-1">
                                        <strong
                                            style={{ color: '#F2D230'}}
                                        >
                                            My Stats
                                        </strong>{' '}
                                    </p>
                                    <p
                                        className="mb-1"
                                        style={{ fontSize: '14px' }}
                                    >
                                        <strong>Deposited</strong>{' '}
                                        {numeral(userBalance()).format(
                                            '0.00',
                                        )}{' '}
                                        UST
                                    </p>
                                    {dogetherUserStats.length > 0 && (
                                        <>
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    <th
                                                        style={{
                                                            padding: 0,
                                                        }}
                                                    >
                                                        Lottery
                                                    </th>
                                                    <th
                                                        style={{
                                                            padding: 0,
                                                        }}
                                                    >
                                                        Nr Tickets
                                                        bought
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {dogetherUserStats.map(
                                                    (obj) => {
                                                        return (
                                                            <tr
                                                                style={{
                                                                    background:
                                                                        'transparent',
                                                                    color: '#fff',
                                                                }}
                                                            >
                                                                <td
                                                                    style={{
                                                                        padding: 0,
                                                                    }}
                                                                >
                                                                    <strong>
                                                                        #
                                                                        {
                                                                            obj.lottery_id
                                                                        }
                                                                    </strong>
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        padding: 0,
                                                                    }}
                                                                >
                                                                    <Ticket
                                                                        size={
                                                                            18
                                                                        }
                                                                        color={
                                                                            '#F2D230'
                                                                        }
                                                                        style={{
                                                                            position:
                                                                                'relative',
                                                                            top: '-2px',
                                                                            marginRight:
                                                                                '4px',
                                                                        }}
                                                                    />
                                                                    <strong>
                                                                        {
                                                                            obj.amount
                                                                        }
                                                                    </strong>
                                                                </td>
                                                            </tr>
                                                        )
                                                    },
                                                )}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                    <small
                                        style={{
                                            marginLeft: '0px',
                                            color: '#a49ab6',
                                        }}
                                    >
                                        Predictions
                                    </small>
                                    <p
                                        className="mb-1"
                                        style={{ fontSize: '14px' }}
                                    >
                                        <strong>Tickets a week</strong>{' '}
                                        {(
                                            (((((userBalance() / 100) *
                                                            percentage) /
                                                        100) *
                                                    anchorPercentage) /
                                                356) *
                                            7
                                        ).toFixed(2)}
                                    </p>
                                    <p
                                        className="mb-1"
                                        style={{ fontSize: '14px' }}
                                    >
                                        <strong>Tickets a year</strong>{' '}
                                        {(
                                            ((((userBalance() / 100) *
                                                        percentage) /
                                                    100) *
                                                anchorPercentage) /
                                            1
                                        ).toFixed(2)}
                                    </p>
                                    <p
                                        className="mb-1"
                                        style={{ fontSize: '14px' }}
                                    >
                                        <strong>Earn compound</strong>{' '}
                                        {numeral(earning / 1000000).format(
                                            '0,0.000000',
                                        )}
                                        Ticket(s) (Updated weekly)
                                    </p>
                                </div>
                            </div>
                        )}
                        {state.holderClaimsDogether &&
                        state.holderClaimsDogether.length > 0 && (
                            <div className="col-md-12 my-3">
                                <div
                                    className="claim-unstake"
                                    style={{
                                        background: '#160842',
                                    }}
                                >
                                    {/* If unPool claiming condition */}
                                    <span className="info">
                                                <Info
                                                    size={14}
                                                    weight="fill"
                                                    className="me-1"
                                                />
                                                Your pending claim amount
                                                available soon:
                                                <strong>
                                                    {pendingClaim()} UST
                                                </strong>
                                                <div
                                                    style={{
                                                        marginTop: '20px',
                                                    }}
                                                >
                                                    List of pending claims
                                                </div>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    paddingLeft:
                                                                        '20px',
                                                                }}
                                                            >
                                                                Amount
                                                            </td>
                                                            <td
                                                                style={{
                                                                    paddingLeft:
                                                                        '20px',
                                                                }}
                                                            >
                                                                Release at
                                                                blockheight
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {state.holderClaimsDogether ? (
                                                            state.holderClaimsDogether.map(
                                                                (e) => {
                                                                    if (
                                                                        e
                                                                            .release_at
                                                                            .at_height >
                                                                        state.blockHeight
                                                                    ) {
                                                                        return (
                                                                            <tr>
                                                                                <td
                                                                                    style={{
                                                                                        paddingLeft:
                                                                                            '20px',
                                                                                    }}
                                                                                >
                                                                                    {parseInt(
                                                                                        e.amount,
                                                                                    ) /
                                                                                    1000000}
                                                                                    UST
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        paddingLeft:
                                                                                            '20px',
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        e
                                                                                            .release_at
                                                                                            .at_height
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                },
                                                            )
                                                        ) : (
                                                            <tr>
                                                                <td>Empty</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </span>
                                    <small className="float-end text-muted mt-2">
                                        Available:
                                        <strong>
                                            {state.wallet &&
                                            state.wallet
                                                .walletAddress &&
                                            claimInfo()}
                                            UST
                                        </strong>
                                    </small>
                                    <button
                                        className="btn btn-default w-100"
                                        disabled={
                                            claimInfo() == 0
                                                ? true
                                                : false
                                        }
                                        onClick={() => claimUnstake()}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Claim unPool
                                    </button>
                                    <button
                                        className="btn btn-default w-100"
                                        disabled={
                                            claimInfo() == 0
                                                ? false
                                                : true
                                        }
                                        onClick={() =>
                                            claimUnstake(
                                                Math.floor(
                                                    ((pendingClaim() *
                                                            1000000 *
                                                            30) /
                                                        100 /
                                                        365) *
                                                    7,
                                                ),
                                            )
                                        }
                                        style={{ marginTop: '10px' }}
                                    >
                                        {claimInfo() == 0
                                            ? `Instant claim unPool (Pay ${numeral(
                                                Math.floor(
                                                    ((pendingClaim() *
                                                            1000000 *
                                                            30) /
                                                        100 /
                                                        365) *
                                                    7,
                                                ) / 1000000,
                                            ).format(
                                                '0,0.000000',
                                            )}UST fees)`
                                            : 'First claim currently available to unlock instant claim'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <small>
                    <strong>Current blockheight:</strong>{' '}
                    {state.blockHeight}
                </small>
            </div>

        </>
    )
}