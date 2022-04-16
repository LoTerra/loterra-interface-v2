import React from 'react'
import { useStore } from '../store'
import { MsgExecuteContract } from '@terra-money/terra.js'
import { Switch, Route, Link, useLocation, NavLink } from 'react-router-dom'

import { Info, Circle, CheckCircle, XCircle } from 'phosphor-react'
import SimpleProposalProgress from './Proposal/SimpleProposalProgress'

export default function ProposalItem(props) {
    const { data, i, fees } = props
    const { state, dispatch } = useStore()

    const vote = (approve, id) => {
        const msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.loterraContractAddress,
            {
                vote: {
                    poll_id: id,
                    approve,
                },
            },
        )
        state.wallet
            .post({
                msgs: [msg],
                fee: fees,
                // gasPrices: obj.gasPrices(),
                // gasAdjustment: 1.5,
            })
            .then((e) => {
                if (e.success) {
                    // showNotification('Vote approved','success',4000)
                } else {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e.message)
                //showNotification(e.message,'error',4000)
            })
    }

    function percentageVotesYes(yes, no) {
        const total = parseInt(yes) + parseInt(no)

        return (yes / total) * 100
    }

    function percentageVotesNo(yes, no) {
        const total = parseInt(yes) + parseInt(no)
        return (no / total) * 100
    }

    return (
        <Link to={'/poll/'+i} className="proposal-item-link">
        <div
            className={
                data.status == 'InProgress'
                    ? 'proposal-item'
                    : 'proposal-item op'
            }
            key={i}
        >
            <div className="row">
                <div className="col-12">
                    <h4>
                        
                        {data.status == 'InProgress' && (
                            <span className="badge progress-badge active">
                                <p>
                                    <Circle size={18} weight="fill" /> Active
                                </p>
                            </span>
                        )}
                        {data.status == 'Passed' && (
                            <span className="badge progress-badge passed">
                                <p>
                                    <CheckCircle size={18} weight="fill" />{' '}
                                    Passed
                                </p>
                            </span>
                        )}
                        {data.status == 'RejectedByCreator' && (
                            <span className="badge progress-badge rejected">
                                <p>
                                    <XCircle size={18} weight="fill" /> Rejected
                                </p>
                            </span>
                        )}
                    </h4>
                    <h4>Proposal number {data.nr}</h4>
                    <SimpleProposalProgress/>
                    <p className="small"><strong>Estimated endtime:</strong> <span className="text-muted">12-12-2022</span></p>
                    <div>

                    </div>
                    {/* <p className="desc">{data.description}</p>
                    {data.status !== 'InProgress' && (
                        <button
                            className="btn btn-plain float-end"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={'#collapseProposal' + i}
                            aria-expanded="false"
                            aria-controls={'collapseProposal' + i}
                        >
                            <Info size={24} /> Show info
                        </button>
                    )} */}
                </div>
                {/* <div
                    className={
                        'col-12 collapse' +
                        (data.status !== 'InProgress' ? '' : ' show')
                    }
                    id={'collapseProposal' + i}
                > */}
                    {/* <div className="row">
                        <div className="col-md-8">
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>Creator</td>
                                            <td>{data.creator}</td>
                                        </tr>
                                        <tr>
                                            <td>End block height</td>
                                            <td>{data.end_height}</td>
                                        </tr>
                                        <tr>
                                            <td>Amount</td>
                                            <td>{data.amount}</td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>{data.status}</td>
                                        </tr>
                                        <tr>
                                            <td>Recipient</td>
                                            <td>
                                                {data.migration_address
                                                    ? data.migration_address
                                                    : 'NO'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Prize per rank</td>
                                            <td>
                                                [
                                                {data.prize_per_rank.toString()}
                                                ]
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Proposal</td>
                                            <td>{data.proposal}</td>
                                        </tr>
                                        <tr>
                                            <td>Yes votes</td>
                                            <td>{data.yes_vote}</td>
                                        </tr>
                                        <tr>
                                            <td>No votes</td>
                                            <td>{data.no_vote}</td>
                                        </tr>
                                        <tr>
                                            <td>Instant approval</td>
                                            <td>
                                                {(
                                                    (parseInt(
                                                        data.weight_yes_vote,
                                                    ) *
                                                        100) /
                                                    parseInt(
                                                        state.staking
                                                            .total_balance,
                                                    )
                                                ).toFixed(0)}
                                                % of 50%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Instant rejection</td>
                                            <td>
                                                {(
                                                    (parseInt(
                                                        data.weight_no_vote,
                                                    ) *
                                                        100) /
                                                    parseInt(
                                                        state.staking
                                                            .total_balance,
                                                    )
                                                ).toFixed(0)}
                                                % of 33%
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-4 text-center d-flex">
                            <div className="vote-box align-self-center w-100">
                                <h4 className="mb-3">Vote</h4>
                                <div className="progress">
                                    <div
                                        className="progress-bar special"
                                        role="progressbar"
                                        style={{
                                            width:
                                                percentageVotesYes(
                                                    data.weight_yes_vote,
                                                    data.weight_no_vote,
                                                ) + '%',
                                        }}
                                        aria-valuenow={percentageVotesYes(
                                            data.weight_yes_vote,
                                            data.weight_no_vote,
                                        )}
                                        aria-valuemin="0"
                                        aria-valuemax={
                                            data.weight_yes_vote +
                                            data.weight_no_vote
                                        }
                                    >
                                        YES
                                    </div>
                                    <div
                                        className="progress-bar danger"
                                        role="progressbar"
                                        style={{
                                            width:
                                                percentageVotesNo(
                                                    data.weight_yes_vote,
                                                    data.weight_no_vote,
                                                ) + '%',
                                        }}
                                        aria-valuenow={percentageVotesNo(
                                            data.weight_yes_vote,
                                            data.weight_no_vote,
                                        )}
                                        aria-valuemin="0"
                                        aria-valuemax={
                                            data.weight_yes_vote +
                                            data.weight_no_vote
                                        }
                                    >
                                        NO
                                    </div>
                                </div>

                                {data.status == 'InProgress' && (
                                    <div className="btn-group w-100">
                                        {state.wallet.walletAddress &&
                                        data.status != 'Passed' &&
                                        data.status != 'Rejected' ? (
                                            <>
                                                <button
                                                    className="btn btn-plain"
                                                    onClick={() =>
                                                        vote(true, data.nr)
                                                    }
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    className="btn btn-plain"
                                                    onClick={() =>
                                                        vote(false, data.nr)
                                                    }
                                                >
                                                    No
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="btn btn-plain"
                                                disabled
                                            >
                                                {data.status}
                                            </button>
                                        )}
                                        {state.wallet.walletAddress ===
                                            undefined && (
                                            <>
                                                <button className="btn btn-plain">
                                                    Connect wallet
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div> */}
                {/* </div> */}
            </div>
        </div>
        </Link>
    )
}
