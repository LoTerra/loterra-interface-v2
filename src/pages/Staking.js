import React, { useEffect, useState, useCallback, useContext } from 'react'

import { Pie, Line } from 'react-chartjs-2'
import ProposalModal from '../components/ProposalModal'
import { Plus, Info } from 'phosphor-react'
import ProposalItem from '../components/ProposalItem'
import { lineOptions, lineData, pieData } from '../components/chart/Chart.js'
import { useStore } from '../store'
import {
    LCDClient,
    MsgExecuteContract,
    Fee,
    WasmAPI,
} from '@terra-money/terra.js'
import numeral from 'numeral'
import Notification from '../components/Notification'
import Footer from '../components/Footer'
import { parse } from 'postcss'
import ApyStats from '../components/ApyStats'
import axios from 'axios'
import StakingForm from '../components/StakingForm'
import PieLoader from '../components/PieLoader'

const BURNED_LOTA = 4301383550000

export default () => {
    const addToGas = 5800
    const obj = new Fee(700_000, { uusd: 319200 + addToGas })
    const [notification, setNotification] = useState({
        type: 'success',
        message: '',
        show: false,
    })
    const { state, dispatch } = useStore()
    const [modal, setModal] = useState(false)

    function hideNotification() {
        setNotification({
            message: notification.message,
            type: notification.type,
            show: false,
        })
    }

    function showNotification(message, type, duration) {
        //console.log('fired notification')
        setNotification({
            message: message,
            type: type,
            show: true,
        })
        //console.log(notification)
        //Disable after $var seconds
        setTimeout(() => {
            setNotification({
                message: message,
                type: type,
                show: false,
            })
            // console.log('disabled',notification)
        }, duration)
    }

    function getTotalStakedLP() {
        if (state.poolInfo.total_share && state.stateLPStaking.total_balance) {
            const ratio =
                state.poolInfo.total_share / state.poolInfo.assets[0].amount
            const inLota = state.stateLPStaking.total_balance / ratio

            console.log('state.poolInfo')
            console.log(inLota / 1000000)
            return inLota / 1000000
        }
        return 0
    }

    function getNotStaked() {
        let staked = parseInt(state.staking.total_balance) / 1000000
        let sum = staked
        return sum
    }

    function getStakedNr() {
        let total =
            (parseInt(state.tokenInfo.total_supply) - BURNED_LOTA) / 1000000
        //console.log("parseInt(state.tokenInfo.balance) - BURNED_LOTA")
        //console.log(state.tokenInfo.total_supply)
        let staked = parseInt(state.staking.total_balance) / 1000000
        let daoFunds = parseInt(state.daoFunds / 1000000)
        let lotaFundsLP = parseInt(state.stakingLoterraFunds / 1000000)
        let alteredFundsLP = parseInt(state.stakingAlteredFunds / 1000000)
        let totalStakedLP = getTotalStakedLP()
        let sum =
            total -
            staked -
            daoFunds -
            lotaFundsLP -
            alteredFundsLP -
            totalStakedLP
        return sum
    }

    function getDaoFunds() {
        return parseInt(state.daoFunds / 1000000)
    }
    function getLPFunds() {
        let lotaFundsLP = parseInt(state.stakingLoterraFunds / 1000000)
        let alteredFundsLP = parseInt(state.stakingAlteredFunds / 1000000)
        return lotaFundsLP + alteredFundsLP
    }

    return (
        <>
            <div className="hero staking">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            {/* <img
                                src="/van.png"
                                className="van img-fluid mx-auto d-block"
                                style={{ marginBottom: '40px' }}
                            />
                            <h1>Staking</h1> */}
                            <StakingForm
                                showNotification={(message, type, dur) =>
                                    showNotification(message, type, dur)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <div
                                className="card lota-card staking-rewards"
                                style={{ background: 'transparent' }}
                            >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-12 d-flex">
                                            {state.tokenInfo.total_supply &&
                                            state.poolInfo.total_share ? (
                                                <div className="align-self-center w-100">
                                                    <div className="pie-stats">
                                                        <div className="row">
                                                            <div className="col-6 text-white">
                                                                <span className="circle-green"></span>
                                                                Available
                                                            </div>
                                                            <div className="col-6">
                                                                {state.tokenInfo
                                                                    .total_supply
                                                                    ? numeral(
                                                                          getStakedNr(),
                                                                      ).format(
                                                                          '0.0,00',
                                                                      )
                                                                    : '0'}
                                                            </div>
                                                            <div className="col-6 text-white">
                                                                <span className="circle-pink"></span>
                                                                DAO
                                                            </div>
                                                            <div className="col-6">
                                                                {state.tokenInfo
                                                                    .total_supply
                                                                    ? numeral(
                                                                          getDaoFunds(),
                                                                      ).format(
                                                                          '0.0,00',
                                                                      )
                                                                    : '0'}
                                                            </div>
                                                            <div className="col-6 text-white">
                                                                <span className="circle-blue"></span>
                                                                LP funds
                                                            </div>
                                                            <div className="col-6">
                                                                {state.tokenInfo
                                                                    .total_supply
                                                                    ? numeral(
                                                                          getLPFunds(),
                                                                      ).format(
                                                                          '0.0,00',
                                                                      )
                                                                    : '0'}
                                                            </div>
                                                            <div className="col-6 text-white">
                                                                <span className="circle-yellow"></span>
                                                                LP staked
                                                            </div>
                                                            <div className="col-6">
                                                                {state.tokenInfo
                                                                    .total_supply
                                                                    ? numeral(
                                                                          getTotalStakedLP(),
                                                                      ).format(
                                                                          '0.0,00',
                                                                      )
                                                                    : '0'}
                                                            </div>
                                                            <div className="col-6 text-white">
                                                                <span className="circle-grey"></span>
                                                                Staked
                                                            </div>
                                                            <div className="col-6">
                                                                {state.tokenInfo
                                                                    .total_supply
                                                                    ? numeral(
                                                                          getNotStaked(),
                                                                      ).format(
                                                                          '0.0,00',
                                                                      )
                                                                    : '0'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Pie
                                                        data={pieData}
                                                        data-staked={
                                                            state.tokenInfo
                                                                .total_supply
                                                                ? getStakedNr()
                                                                : '0'
                                                        }
                                                        data-total={
                                                            state.tokenInfo
                                                                .total_supply
                                                                ? getNotStaked()
                                                                : '0'
                                                        }
                                                        data-dao={
                                                            state.tokenInfo
                                                                .total_supply
                                                                ? getDaoFunds()
                                                                : '0'
                                                        }
                                                        data-lpfunds={
                                                            state.tokenInfo
                                                                .total_supply
                                                                ? getLPFunds()
                                                                : '0'
                                                        }
                                                        data-lpstaked={
                                                            state.poolInfo
                                                                .total_share
                                                                ? getTotalStakedLP()
                                                                : '0'
                                                        }
                                                        options={{
                                                            animation: {
                                                                duration: 0,
                                                            },
                                                        }}
                                                        style={{
                                                            maxHeight: '400px',
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <PieLoader />
                                            )}
                                        </div>
                                        {/* <div className="col-md-6">
                                <div className="current-value">
                                    10.00<span>UST</span>
                                </div>
                            <Line data={lineData} options={lineOptions} style={{background:'#10003b', borderRadius:'10px'}}/>
                            </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <section className="apystats my-5">
            <div className="container">
                <div className="card lota-card apy-stats">
                    <ApyStats/>
                </div>
            </div>
        </section> */}

            <ProposalModal open={modal} toggleModal={() => setModal(!modal)} />
            <Notification
                notification={notification}
                close={() => hideNotification()}
            />
        </>
    )
}
