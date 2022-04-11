import React, { useCallback, useEffect, useState } from 'react'
import ProposalItem from '../components/ProposalItem'
import { useStore } from '../store'
import { Fee, WasmAPI } from '@terra-money/terra.js'
import Footer from '../components/Footer'
import BodyLoader from '../components/BodyLoader'
import { Bank, Info } from 'phosphor-react'
import numeral from 'numeral'
import { Link } from 'react-router-dom'

export default () => {
    const { state, dispatch } = useStore()
    const [lotaPrice, setLotaPrice] = useState(0)

    const addToGas = 5800
    const obj = new Fee(700_000, { uusd: 319200 + addToGas })

    const terra = state.lcd_client
    const api = new WasmAPI(terra.apiRequester)

    const fetchData = useCallback(async () => {
    const currentLotaPrice = await api.contractQuery(
        state.loterraPoolAddress,
        {
            pool: {},
        },
    )
    setLotaPrice(currentLotaPrice)
    });

    function getStaked() {
        let staked = parseInt(state.staking.total_balance) / 1000000
        let sum = staked
        return sum
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])
  
    return (
        <>

        <div className="container">
            <div className="row">
                <div className="col-md-12 my-5">
                    <div className="row">
                        <div className="col-md-6">
                            <h1 className="fw-bold fs-1 mb-0 text-center text-md-start">           
                                <Bank 
                                size={55}
                                color={'rgb(139, 246, 194)'}
                                style={{
                                marginRight:5,
                                }}
                                />
                                DAO
                            </h1>
                            <p className="mb-4 fs-5 fw-normal text-muted text-center text-md-start">Together we decide</p>     
                        </div>
                        <div className="col-md-6 text-end d-flex">
                            {/* <Link to={'/poll/create'} className="btn btn-default align-self-center ms-auto">Create proposal</Link> */}
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-12 text-center">
                            <div className="card lota-card">
                                <div className="card-body">
                                    <p className="fs-1 fw-bold mb-0">Coming soon</p>
                                    <p className="text-muted">We are currently working on the new DAO page</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="staking-rewards-info">                
                                <h2>Current LOTA price</h2>
                                <p className="fs-6">{lotaPrice.assets && numeral(
                                                    lotaPrice.assets[1].amount /
                                                        lotaPrice.assets[0]
                                                            .amount,
                                                ).format('0.000')}<span className="text-muted ms-1">UST</span></p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="staking-rewards-info">                
                                <h2>Total staked LOTA</h2>
                                <p className="fs-6">{state.tokenInfo
                                .total_supply
                                ? numeral(
                                getStaked(),
                                ).format(
                                '0.0,00',
                                )
                                : '0'}<span className="text-muted ms-1">LOTA</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <h4>Polls</h4>
                        </div>
                        <ProposalItem 
                        data={{
                            nr: 1,
                            status:'InProgress',
                            prize_per_rank: 0
                        }}
                        i={0}
                        fees={0}
                        />
                    </div> */}

                </div>
            </div>
        </div>


            {/* <section className="proposals" style={{ marginTop: '90px' }}>
                <div className="container">
                    <div className="card lota-card proposals">
                        <div className="card-header text-center">
                            <div className="card-header-icon">
                                <Bank size={90} color="#20FF93" />
                            </div>
                            <h3>DAO</h3>
                            <h5>
                                Decentralized gaming ecosystem managed by LOTA
                                stakers
                            </h5>
                            <h6
                                style={{
                                    color: '#ff36ff',
                                    marginBottom: '20px',
                                    fontWeight: 'normal',
                                }}
                            >
                                <strong>Make decisions together!</strong> Manage
                                the casino, set the price, up the ticket price
                                or go cheap, extract max profits
                            </h6>
                            <span className="info text-start">
                                <Info
                                    size={14}
                                    weight="fill"
                                    className="me-1"
                                />
                                Join our telegram community and discuss. In
                                order for a proposal beeing created we will
                                create firstly a poll in the{' '}
                                <a href="https://t.me/LoTerra" target="_blank">
                                    telegram channel
                                </a>{' '}
                                when this poll reaches 500+ votes with a winning
                                percentage above 15% the proposal will be
                                created on Loterra and LOTA stakers are able to
                                vote.
                            </span>
                        </div>

                        <div className="card-body">
                            {state.allProposals.length !== 0 ? (
                                state.allProposals
                                    .slice(0)
                                    .reverse()
                                    .sort((a, b) =>
                                        a.status == 'InProgress' ? -1 : 1,
                                    )
                                    .map((element, key) => {
                                        return (
                                            <ProposalItem
                                                fees={obj}
                                                data={element}
                                                i={key}
                                                key={key}
                                            />
                                        )
                                    })
                            ) : (
                                <BodyLoader />
                            )}
                        </div>
                    </div>
                </div>
            </section> */}
            {/* <Footer /> */}
        </>
    )
}
