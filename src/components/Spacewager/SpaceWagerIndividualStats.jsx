import React, { useState, useEffect } from 'react'
import {useStore} from "../../store";
import { Prohibit, PlayCircle, Info, Trophy } from 'phosphor-react';
import { WasmAPI } from '@terra-money/terra.js';
import numeral from 'numeral';



export default function SpaceWagerIndividualStats(props) {

    const {state,dispatch} = useStore()
    const api = new WasmAPI(state.lcd_client.apiRequester)
    const [individualStats, setIndividualStats] = useState();

    async function getSpacewagerLeaderboardIndividual(){
        try {
            let spacewager_individual_data = await api.contractQuery(
                state.spaceWagerAddress,
                {
                    player: {
                       address: state.wallet.walletAddress
                    }
                }
            ).then(a => {
                console.log('individual stats',a)
                setIndividualStats(a)
            }).catch(e => {
                console.log(e)
            });
        } catch(e) {
            console.log(e)
        }        
    }

    const stats_div = (title,value,icon) => {
        return (
            <div className="col-4 p-0 p-md-4">
                    <div className="card lota-card">
                        <div className="card-body p-2 p-md-3">                                      
                           
                                <p className="mb-0 text-muted small">{title}</p>
                                {state.wallet && state.wallet.walletAddress ?
                                    <p className="mb-0 fs-2 fw-bold">{value}</p>
                                    :
                                    <p className="mb-0 fs-6 fw-normal">Connect wallet</p>
                                }                                
                  
                    </div>
                    </div>
                </div>
        )
    }

    useEffect(() => {
        if(state.wallet && state.wallet.walletAddress){
            getSpacewagerLeaderboardIndividual()
        }
    },[state.wallet])

    return (
        <div className="container-fluid my-5">
                <h3 className="fw-bold">Player stats</h3>
        { individualStats &&
        <div className="row">            
            {stats_div('Games won', individualStats.game_won, <Trophy size={50} style={{lineHeight:0}}/>)}
            {stats_div('Games lost', individualStats.game_over, <Trophy size={50} style={{lineHeight:0}}/>)}
            {stats_div('Game rewards', (
                <>
                {numeral(parseFloat(individualStats.game_rewards / 1000000)).format('0,0.00')}<span style={{fontSize:'14px'}}>UST</span>
                </>
            ), <Trophy size={50} style={{lineHeight:0}}/>)}
        </div>
        }
        </div>
    )
}