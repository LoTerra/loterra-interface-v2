import React from 'react'
import { CheckCircle, XCircle } from 'phosphor-react'

export default function ProgressBar(props) {



    return (
        <div className="proposal-progress mt-3">
            <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
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
