import { WasmAPI } from '@terra-money/terra.js';
import { ArrowLeft, Article, CheckCircle, Circle, XCircle } from 'phosphor-react';
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {  
    Link,
    useParams
  } from "react-router-dom";
import BodyLoader from '../../components/BodyLoader';
import ProposalProgress from '../../components/Proposal/ProposalProgress';
import VoteForm from '../../components/Proposal/VoteForm';
import SimpleSpinner from '../../components/SimpleSpinner';
import { formatTimestamp } from '../../helpers/Helpers';
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

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 my-5">
                        <Link
                            to="/dao"
                            className="btn btn-default float-end mt-md-2"
                        >
                            <ArrowLeft size={14} style={{ top: 0 }} /> Overview
                        </Link>
                        <h1 className="fw-bold fs-1 mb-0 text-center text-md-start">
                            <Article
                                size={55}
                                color={'rgb(139, 246, 194)'}
                                style={{
                                    marginRight: 5,
                                }}
                            />
                            poll {pollid}
                        </h1>
                        {proposal.hasOwnProperty('title') ? (
                            <div className="card lota-card mt-4">
                                <div className="card-body pb-5">
                                    {proposal.status == 'InProgress' && (
                                        <span className="badge progress-badge active">
                                            <p>
                                                <Circle
                                                    size={18}
                                                    weight="fill"
                                                />{' '}
                                                Active
                                            </p>
                                        </span>
                                    )}
                                    {proposal.status == 'executed' && (
                                        <span className="badge progress-badge passed">
                                            <p>
                                                <CheckCircle
                                                    size={18}
                                                    weight="fill"
                                                />{' '}
                                                Passed
                                            </p>
                                        </span>
                                    )}
                                    {proposal.status == 'RejectedByCreator' && (
                                        <span className="badge progress-badge rejected">
                                            <p>
                                                <XCircle
                                                    size={18}
                                                    weight="fill"
                                                />{' '}
                                                Rejected
                                            </p>
                                        </span>
                                    )}
                                    <p className="fs-3 fw-bold mt-3">
                                        {proposal.title}
                                    </p>
                                    <p className="fs-6 fw-normal text-muted text-uppercase mb-0">
                                        Description
                                    </p>
                                    <p>{proposal.description}</p>
                                    <p className="fs-6 fw-normal text-muted text-uppercase mb-0">
                                        Predefined option
                                    </p>
                                    <div className="p-3 rounded"
                                    style={{
                                        background:'#10062d96',
                                        fontSize:14,
                                        color:'#8bf6c2d1'
                                    }}
                                    >
                                        <p>
                                            <pre>
                                                {JSON.stringify(
                                                    proposal.msgs,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        </p>
                                    </div>
                                    <p className="fs-6 fw-normal text-muted text-uppercase mb-1 mt-3">
                                        Details
                                    </p>
                                    <ProposalProgress />
                                    <p className="fs-6 fw-normal text-muted text-uppercase mb-0">
                                        End date
                                    </p>
                                    <p>
                                        {formatTimestamp(
                                            proposal.expires.at_time,
                                        )}
                                    </p>
                                    {proposal.status == 'InProgress' ? (
                                        <>
                                            <p
                                                className="fs-3 fw-normal mb-2 py-3 mt-3"
                                                style={{
                                                    borderTop:
                                                        '1px solid #40337a',
                                                }}
                                            >
                                                Vote on proposal
                                            </p>
                                            <VoteForm proposalId={1} />
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        ) : (
                            <SimpleSpinner />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
} 