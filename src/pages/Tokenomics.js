import { LCDClient, WasmAPI } from '@terra-money/terra.js';
import numeral from 'numeral';
import { useStore } from '../store'
import { Head } from 'react-static'
import React, { useState, useEffect, useMemo, useRef } from 'react'


function tokenInfo(){

    let render = (
        <tr>
            <td className="text-center">LoTerra</td>
            <td className="text-center">LOTA</td>
            <td className="text-center">cw20</td>
            <td className="text-center">6</td>
            <td className="text-center">Utility</td>
            <td className="text-center">Terra</td>
        </tr>
    )

    return (
        <>
            { render }
        </>
    )
}

function tokenSupply(){

    let render = (
        <tr>
            <td className="text-start">1,939,548.765705 LOTA</td>
            <td className="text-center">0.0</td>
            <td className="text-end">0.0</td>
        </tr>
    )

    return (
        <>
            { render }
        </>
    )
}

export default () => {
    return (
        <>
            <div className="w-100 py-3 py-md-5 text-center">
                <h1 className="mb-0 fw-bold" style={{textShadow:'1px 1px 10px #14053b'}}>Tokenomics</h1>
                <h2 className="my-2 fw-regular fs-6 mb-0">LOTA is the governance token of the LoTerra ecosystem gaming lottery, token give the power to vote proposals. LOTA holders are owners of the LoTerra ecosystem casino, their job is to ensure the ecosystem is working well, they can control lotteries configurations and get staking rewards for responsibilities and management.</h2>
            </div>
            <div className="container-fluid">
                <div className="w-100 py-4">
                    <div className="row">
                            <div className="col-12 text-start">
                                <h3 className="fw-bold">Token info</h3>
                            </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table text-white">
                            <thead>
                                <tr>
                                    <th style={{minWidth:100}} className="text-center">Name</th>
                                    <th style={{minWidth:100}} className="text-center">Symbol</th>
                                    <th style={{minWidth:100}} className="text-center">Token type</th>
                                    <th style={{minWidth:100}} className="text-center">Decimals</th>
                                    <th style={{minWidth:100}} className="text-center">Role</th>
                                    <th style={{minWidth:100}} className="text-center">Blockchain</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tokenInfo()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-100 py-4">
                    <div className="col-12 text-start">
                        <h3 className="fw-bold">Token supply</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="table text-white">
                            <thead>
                                <tr>
                                    <th style={{minWidth:80}} className="text-star">Total supply</th>
                                    <th style={{minWidth:80}} className="text-center">Circulating Supply</th>
                                    <th style={{minWidth:80}} className="text-end">DAO funds</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tokenSupply()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}