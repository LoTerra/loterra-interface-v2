import { LCDClient, WasmAPI } from '@terra-money/terra.js';
import numeral from 'numeral';
import { useStore } from '../store'
import { Head } from 'react-static'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, Question, Cards, Calendar } from 'phosphor-react'
import RafflesCard from '../components/Raffles/RafflesCard';

export default () => {

    const { state, dispatch } = useStore()
    const terra = state.lcd_client
    const api = new WasmAPI(terra.apiRequester)
    const [raffles,setRaffles] = useState([]);

    return (
        <>
            <div className="container">
                <div className="w-100 py-3 py-md-5 text-center">
                    <h1 className="mb-0 fw-bold" style={{textShadow:'1px 1px 10px #14053b'}}>Raffles</h1>
                    <h2 className="my-2 fw-regular fs-6 mb-0">NFTs & Event Tickets</h2>
                </div>
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
                                <Cards size={24} style={{position:'relative',top:-2}} weight={'bold'}/>
                                {' '}
                                NFTs
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
                                <Calendar size={24} style={{position:'relative',top:-2}} weight={'bold'}/>
                                {' '}
                                Events
                            </a>
                        </li>
                    </ul>
                </div> 
                
            </div>
            <div className="row mb-2 position-relative">
                    <RafflesCard
                    id='1'
                    obj='3'
                    />
                   
            </div>
            
        </>
    )
}