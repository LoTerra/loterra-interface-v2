import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import axios from 'axios'
import LpStaking from './StakingForm/LpStaking'
import Staking from './StakingForm/Staking'
import { Coin } from 'phosphor-react'

export default function StakingForm(props) {
    const { showNotification } = props
    const [heightBlock, setBlockHeight] = useState(0)
    const { state, dispatch } = useStore()

    async function blockHeight() {
        const latestBlocks = await axios.get(
            'https://lcd.terra.dev/blocks/latest',
        )
        setBlockHeight(latestBlocks.data.block.header.height)
        //console.log('Block HEIGHT',latestBlocks)
    }

    useEffect(() => {
        blockHeight()
    }, [])

    return (
        <div>
            <h3 className="mt-4 fw-bold">Staking</h3>
            <Staking
            showNotification={showNotification}
            heightBlock={heightBlock}
            />
            <h3 className="mt-4 fw-bold">LP Staking</h3>
            <LpStaking 
            showNotification={showNotification}
            />
        {/* <div className="card lota-card staking">            
            <div className="card-body">
                <div className="row">
                    <div className="col-12 text-center">
                        <ul
                            className="nav nav-pills nav-fill mb-3"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link active"
                                    id="pills-staking-tab"
                                    href="#pills-staking"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-staking"
                                >
                                    Staking
                                </a>
                            </li>

                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link"
                                    id="pills-lpstaking-tab"
                                    href="#pills-lpstaking"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-lpstaking"
                                >
                                    LP Staking
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="tab-content" id="pills-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="pills-staking"
                            role="tabpanel"
                            aria-labelledby="pills-staking-tab"
                        >
                            <Staking
                                showNotification={showNotification}
                                heightBlock={heightBlock}
                            />
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-lpstaking"
                            role="tabpanel"
                            aria-labelledby="pills-lpstaking-tab"
                        >
                            <LpStaking showNotification={showNotification} />
                        </div>
                    </div>

                    <div className="col-md-12 my-2 text-start">
                        <span
                            className="badge rounded-pill"
                            style={{
                                backgroundColor: '#251757',
                                display: 'inline-block',
                                color: '#a39dbf',
                                padding: '8px',
                            }}
                        >
                            Latest block height: {heightBlock}
                        </span>
                    </div>
                </div>
            </div>
        </div> */}
        </div>
    )
}
