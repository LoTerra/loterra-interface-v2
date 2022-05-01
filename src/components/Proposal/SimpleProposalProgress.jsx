import React from 'react'
import ProgressIndicator from './ProgressIndicator'
import ProgressBar from './ProgressBar'

export default function SimpleProposalProgress(props) {


    return (
        <div className="proposal-progress mt-3 mb-3">
            <div className="progress-bar-holder position-relative mt-4 w-100 mb-2">
                <ProgressBar amount={15}/>   
                <ProgressIndicator amount={10}/> 
            </div>
            <div className="row">
                <div className="col-6 text-start">
                    <p className="mb-0 text-muted"><strong>Voted</strong> 10%</p>
                </div>
                <div className="col-6 text-end d-flex">
                    <p className="ms-auto mb-0 text-muted">
                    <span><strong>Yes</strong> 10% </span>
                    <span><strong>No</strong> 10% </span>
                    </p>
                </div>
            </div>
        </div>
    )
}
