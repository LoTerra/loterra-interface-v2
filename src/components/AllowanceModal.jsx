import React, { useState, useEffect, useMemo } from 'react'
import { X, Ticket, UserCircle, Info } from 'phosphor-react'
import {
    Fee,
    MsgExecuteContract,
    LCDClient,
    WasmAPI,
    BankAPI,
} from '@terra-money/terra.js'
import { useStore } from '../store'

export default function AllowanceModal(props) {
    const { open, prefill, toggleModal, showNotification } = props
    const { state, dispatch } = useStore()
    const [prefillValue, setPrefillValue] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault()
        increaseUserAllowance(prefillValue == 0 ? prefill : prefillValue)
    }

    function increaseUserAllowance(val) {
        const addToGas = 5800
        const obj = new Fee(700_000, { uusd: 319200 + addToGas })
        const msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            'terra15tztd7v9cmv0rhyh37g843j8vfuzp8kw0k5lqv',
            {
                increase_allowance: {
                    spender: state.loterraContractAddress,
                    amount: (parseFloat(val) * 1000000).toString(),
                },
            },
        )

        state.wallet
            .post({
                msgs: [msg],
                fee: obj,
                // gasPrices: obj.gasPrices(),
                // gasAdjustment: 1.5,
            })
            .then((e) => {
                if (e.success) {
                    //setResult("register combination success")
                    toggleModal()
                    showNotification(
                        'Increase allowance success',
                        'success',
                        4000,
                    )
                    //   window.location.reload();
                } else {
                    //setResult("register combination error")
                    toggleModal()
                    showNotification('Increase allowance error', 'error', 4000)
                }
            })
    }

    function handleChange(e) {
        setPrefillValue(e.target.value)
        //console.log(prefillValue)
    }

    return (
        <>
            <div className={'allowancemodal' + (open ? ' show' : '')}>
                <button className="toggle" onClick={() => toggleModal()}>
                    <X size={36} />
                </button>

                <div className="allowancemodal_heading text-center">
                    <h2>Approval needed</h2>
                </div>
                <div className="allowancemodal_content">
                    <span className="info mb-2">
                        <Info size={14} weight="fill" className="me-1" />
                        You need to approve the lottery contract to burn 🔥 ALTE
                        from your wallet, You can set this amount to your own
                        likings (it should be at least the amount of bonus
                        ALTE).
                    </span>
                    <form
                        className="allowancemodal_form"
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        <div className="col-12">
                            <label>Amount</label>
                            <input
                                name="allowance_amount"
                                value={
                                    prefillValue == 0 && prefill
                                        ? prefill
                                        : prefillValue
                                }
                                type="number"
                                min={prefill ? prefill : prefillValue}
                                className="form-control"
                                onChange={(e) => handleChange(e)}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-special w-100 mt-4"
                                style={{ boxShadow: 'none' }}
                            >
                                Approve ALTE 🔥
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div
                className={'backdrop' + (open ? ' show' : '')}
                style={{ zIndex: 88 }}
                onClick={() => toggleModal()}
            ></div>
        </>
    )
}
