import { WasmAPI } from '@terra-money/terra.js';
import { ArrowLeft, Article, Circle } from 'phosphor-react';
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {  
    Link,
    useParams
  } from "react-router-dom";
import BodyLoader from '../../components/BodyLoader';
import ProposalProgress from '../../components/Proposal/ProposalProgress';
import VoteForm from '../../components/Proposal/VoteForm';
import SimpleSpinner from '../../components/SimpleSpinner';
import { useStore } from '../../store';

export default (props) => {

    const { state, dispatch } = useStore()
    const [proposal, setProposal] = useState({})

    let { pollid } = useParams();    

    const terra = state.lcd_client
    const api = new WasmAPI(terra.apiRequester)

    const getProposalData = async (id) => {
        const proposal_data = await api.contractQuery(
            'terra1s4twvkqy0eel5saah64wxezpckm7v9535jjshy',
            {
                proposal: {
                    proposal_id:parseInt(id),
                },
            },
        )
        console.log(proposal_data)
        setProposal(proposal_data)
    }

    useMemo(() => {
        if(pollid){
            getProposalData(pollid)
        }
    },[pollid])

    return(
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 my-5">
                        <Link to="/dao" className="btn btn-default float-end mt-md-2">
                            <ArrowLeft size={14} style={{top:0}}/> Overview
                        </Link>
                        <h1 className="fw-bold fs-1 mb-0 text-center text-md-start">           
                            <Article 
                            size={55}
                            color={'rgb(139, 246, 194)'}
                            style={{
                            marginRight:5,
                            }}
                            />
                            poll {pollid}
                        </h1>
                    { proposal.hasOwnProperty('title') ?
                    <div className="card lota-card mt-4">
                        <div className="card-body pb-5">
                            <span className="badge progress-badge active">
                                <p>
                                    <Circle size={18} weight="fill" /> Active
                                </p>
                            </span>
                            <p className="fs-3 fw-bold mt-3">{proposal.title}</p>
                            <p className="fs-6 fw-normal text-muted text-uppercase mb-0">Description</p>
                            <p>
                            {proposal.description}
                            </p>
                            <p className="fs-6 fw-normal text-muted text-uppercase mb-0">Predefined option</p>
                            <p>Selected option title here</p>          
                            <p className="fs-6 fw-normal text-muted text-uppercase mb-1">Details</p>
                            <ProposalProgress />      
                            <p className="fs-6 fw-normal text-muted text-uppercase mb-0">End date</p>
                            <p>12-12-2022</p>          
                            <p className="fs-3 fw-normal mb-2 py-3 mt-3" style={{borderTop:'1px solid #40337a'}}>Vote on proposal</p>
                            <VoteForm proposalId={1}/>
                        </div>
                    </div>   
                    :
                    <SimpleSpinner/>
                    }                 
                    </div>
                </div>
            </div>
        </>
    )
} 