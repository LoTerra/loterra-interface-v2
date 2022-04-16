import React from 'react'
import { CheckCircle, XCircle } from 'phosphor-react'

export default function VoteForm(props) {

    const {proposalId} = props;

    const setVote =(type) => {

    }

    return (
        <div className="row">
            <div className="col-6">
                <button type="button" onClick={() => setVote('yes')} className="btn btn-default w-100 fw-bold">YES</button>
            </div>
            <div className="col-6">
                <button type="button" onClick={() => setVote('no')} className="btn btn-default w-100 fw-bold">NO</button>
            </div>
        </div>
    )
}
