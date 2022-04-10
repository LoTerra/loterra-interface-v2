import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import axios from 'axios'
import LpStaking from './StakingForm/LpStaking'
import Staking from './StakingForm/Staking'
import { Coin } from 'phosphor-react'
import NewStaking from './StakingForm/NewStaking'

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
        // <div className="card lota-card staking">
        //     <div className="card-header">
        //         <div className="card-header-icon">
        //             <Coin size={90} color="#20FF93" />
        //         </div>
        //         <h3>Staking</h3>
        //     </div>
        //     <div className="card-body">
        //         <div className="row">
        //             <div className="col-12 text-center">
        //                 <ul
        //                     className="nav nav-pills nav-fill mb-3"
        //                     id="pills-tab"
        //                     role="tablist"
        //                 >
        //                     <li className="nav-item" role="presentation">
        //                         <a
        //                             className="nav-link active"
        //                             id="pills-staking-tab"
        //                             href="#pills-staking"
        //                             data-bs-toggle="pill"
        //                             data-bs-target="#pills-staking"
        //                         >
        //                             Staking
        //                         </a>
        //                     </li>

        //                     <li className="nav-item" role="presentation">
        //                         <a
        //                             className="nav-link"
        //                             id="pills-lpstaking-tab"
        //                             href="#pills-lpstaking"
        //                             data-bs-toggle="pill"
        //                             data-bs-target="#pills-lpstaking"
        //                         >
        //                             LP Staking <label>NEW</label>
        //                         </a>
        //                     </li>
        //                 </ul>
        //             </div>
        //             <div className="tab-content" id="pills-tabContent">
        //                 <div
        //                     className="tab-pane fade show active"
        //                     id="pills-staking"
        //                     role="tabpanel"
        //                     aria-labelledby="pills-staking-tab"
        //                 >
        //                     <Staking
        //                         showNotification={showNotification}
        //                         heightBlock={heightBlock}
        //                     />
        //                 </div>
        //                 <div
        //                     className="tab-pane fade"
        //                     id="pills-lpstaking"
        //                     role="tabpanel"
        //                     aria-labelledby="pills-lpstaking-tab"
        //                 >
        //                     <LpStaking showNotification={showNotification} />
        //                 </div>
        //             </div>

        //             <div className="col-md-12 my-2 text-start">
        //                 <span
        //                     className="badge rounded-pill"
        //                     style={{
        //                         backgroundColor: '#251757',
        //                         display: 'inline-block',
        //                         color: '#a39dbf',
        //                         padding: '8px',
        //                     }}
        //                 >
        //                     Latest block height: {heightBlock}
        //                 </span>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        

        <>
        <h1 className="fw-bold fs-1 mb-0 text-center text-md-start">
            <Coin 
            size={55}
            color={'rgb(139, 246, 194)'}
            style={{
                marginRight:5,
                transform:'rotate(33deg)'
            }}
            />
            Staking
        </h1>
        <p className="mb-4 fs-5 fw-normal text-muted text-center text-md-start">Earn interests and be part of our DAO</p>
            <h2 className="fw-medium mt-4 fs-4 fw-bolder"
            style={{
                borderTop:'1px solid #8978b33d',
                paddingTop: 20
            }}
            >
            <span 
                className="badge"
                style={{
                    background:'rgb(137 120 179)',
                    color:'rgb(33 10 92)',
                    fontSize:16,
                    marginRight:5
                }}
                >
                OLD
                </span> 
                Single asset staking
            </h2>
            <Staking
            showNotification={showNotification}
            heightBlock={heightBlock}
            />    
            <h2 className="fw-medium mt-5 fs-4 fw-bolder"
             style={{
                borderTop:'1px solid #8978b33d',
                paddingTop: 20
            }}
            >
                <span 
                className="badge"
                style={{
                    background:'rgb(139, 246, 194)',
                    color:'rgb(16, 0, 59)',
                    fontSize:16,
                    marginRight:5
                }}
                >
                NEW
                </span> 
                Single asset staking
            </h2>
            <NewStaking 
            showNotification={showNotification} 
            />    
            <h2 className="fw-medium mt-5 fs-4 fw-bolder"
             style={{
                borderTop:'1px solid #8978b33d',
                paddingTop: 20
            }}
            >LP Staking</h2>
            <LpStaking 
            showNotification={showNotification} 
            />
        </>
    )
}
