import React from 'react'
import ProgressIndicator from './ProgressIndicator'
import ProgressBar from './ProgressBar'

export default function ProposalProgress(props) {


    return (
        <div className="proposal-progress mt-3 mb-3">
            <div className="progress-bar-holder position-relative w-100 mb-4 mt-4">
                <ProgressBar amount={15}/>
                <ProgressIndicator amount={10}/>
            </div>
            <div className="row py-3">
                <div className="col-md-4 text-start">
                        <p className="fs-6 fw-normal text-muted text-uppercase mb-0">Voted</p>
                        <p className="mb-0 fs-2 fw-normal">12%</p>
                        <p className="small text-muted mb-0">Quorum 10%</p>
                </div>
                <div className="col-md-4 text-start" style={{borderLeft:'4px solid #3fb553'}}>                             
                    <p className="fs-6 fw-normal text-muted text-uppercase mb-0">YES</p>
                    <p className="mb-0 fs-2 fw-normal">12%</p>
                    <p className="small text-muted mb-0">10M LOTA</p>
            
                </div>
                <div className="col-md-4 text-start" style={{borderLeft:'4px solid #b53f3f'}}>        
                        <p className="fs-6 fw-normal text-muted text-uppercase mb-0">NO</p>
                        <p className="mb-0 fs-2 fw-normal">12%</p>
                        <p className="small text-muted mb-0">10M LOTA</p>
                </div>
            </div>
        </div>
    )
}
