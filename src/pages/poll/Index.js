import { ArrowLeft, Article, Circle } from 'phosphor-react';
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {  
    Link,
    useParams
  } from "react-router-dom";
import ProposalProgress from '../../components/Proposal/ProposalProgress';
import VoteForm from '../../components/Proposal/VoteForm';

export default (props) => {

    let { pollid } = useParams();    

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
                    <div className="card lota-card mt-4">
                        <div className="card-body pb-5">
                            <span className="badge progress-badge active">
                                <p>
                                    <Circle size={18} weight="fill" /> Active
                                </p>
                            </span>
                            <p className="fs-3 fw-bold mt-3">This is a test proposal</p>
                            <p className="fs-6 fw-normal text-muted text-uppercase mb-0">Description</p>
                            <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed nisi porta, volutpat augue quis, scelerisque quam. In hac habitasse platea dictumst. Sed auctor id dolor non viverra.
                            Vestibulum congue, purus non convallis vulputate, mi ipsum mollis dolor, eget molestie eros ex at mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed placerat aliquam dolor sed venenatis. Quisque non tristique diam.
                            </p>
                            <p className="fs-6 fw-normal text-muted text-uppercase mb-0">Predefined option</p>
                            <p>Selected option title here</p>          
                            <p className="fs-6 fw-normal text-muted text-uppercase mb-1">Details</p>
                            <ProposalProgress />                  
                            <p className="fs-3 fw-normal mb-2 py-3 mt-3" style={{borderTop:'1px solid #40337a'}}>Vote on proposal</p>
                            <VoteForm proposalId={1}/>
                        </div>
                    </div>                    
                    </div>
                </div>
            </div>
        </>
    )
} 