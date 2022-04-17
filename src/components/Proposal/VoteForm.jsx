import React from 'react'
import { CheckCircle, XCircle } from 'phosphor-react'
import { useStore } from '../../store';
import { MsgExecuteContract } from '@terra-money/terra.js';

export default function VoteForm(props) {

    const { state, dispatch } = useStore()

    const {proposalId} = props;

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

    return (
        <div className="row">
            <div className="col-6">
                <button type="button" onClick={() => vote(true,proposalId)} className="btn btn-default w-100 fw-bold">YES</button>
            </div>
            <div className="col-6">
                <button type="button" onClick={() => setVote(false,proposalId)} className="btn btn-default w-100 fw-bold">NO</button>
            </div>
        </div>
    )
}
