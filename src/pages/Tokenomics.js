import { LCDClient, WasmAPI } from '@terra-money/terra.js';
import numeral from 'numeral';
import { useStore } from '../store'
import { Head } from 'react-static'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {ChartLine} from 'phosphor-react'

const BURNED_LOTA = 4301383550000

export default () => {

    const { state, dispatch } = useStore()
    const [lotaPrice, setLotaPrice] = useState(0)
    const terra = state.lcd_client
    const api = new WasmAPI(terra.apiRequester)
    const loterra_contract_address = 'terra1q2k29wwcz055q4ftx4eucsq6tg9wtulprjg75w'
    const loterra_pool_address = 'terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta'

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

    const fetchContractQuery = useCallback(async () => {
        try {
            //Get current lota price
            const currentLotaPrice = await api.contractQuery(
                loterra_pool_address,
                {
                    pool: {},
                },
            )
            setLotaPrice(currentLotaPrice)
        } catch(e){
            console.log(e)
        }
    }, [])

    function circulatingSupply() {
        let total =
            (parseInt(state.tokenInfo.total_supply) - BURNED_LOTA) / 1000000
        let daoFunds = parseInt(state.daoFunds / 1000000)
        let sum = total - daoFunds
        return sum
    }

    function daoFunds() {
        let daoFunds = parseInt(state.daoFunds / 1000000)
        return daoFunds
    }

    function totalSupply() {
        let total =
            (parseInt(state.tokenInfo.total_supply) - BURNED_LOTA) / 1000000
        return total
    }

    function marketCap() {
        if (lotaPrice.assets) {
            let sum =
                (lotaPrice.assets[1].amount / lotaPrice.assets[0].amount) *
                circulatingSupply()
            return sum
        }
    }

    useEffect(() => {
        fetchContractQuery()   
    }, [fetchContractQuery])

    return (
        <>
            <div className="w-100 py-3 py-md-5 text-center">
                <h1 className="mb-0 fw-bold" style={{textShadow:'1px 1px 10px #14053b'}}>Tokenomics</h1>
                <h2 className="my-2 fw-regular fs-6 mb-0">LOTA is the governance token of the LoTerra ecosystem gaming lottery, token give the power to vote proposals. LOTA holders are owners of the LoTerra ecosystem casino, their job is to ensure the ecosystem is working well, they can control lotteries configurations and get staking rewards for responsibilities and management.</h2>
            </div>
            <div className="container-fluid">
                <div className="card-body">
                    <div className="col-12 text-center">
                        <h3 className="fw-bold">Information</h3>
                    </div>
                    <div className="row">
                        <div className="col-md-2 mb-3">
                            <div className="lota-stats">
                                <p>Name</p>
                                <h5>
                                    LoTerra
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-2 mb-3">
                            <div className="lota-stats">
                                <p>Symbol</p>
                                <h5>
                                    LOTA
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-2 mb-3">
                            <div className="lota-stats">
                                <p>Blockchain</p>
                                <h5>
                                    Terra
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-2 mb-3">
                            <div className="lota-stats">
                                <p>Token Type</p>
                                <h5>
                                    cw20
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-2 mb-3">
                            <div className="lota-stats">
                                <p>decimals</p>
                                <h5>
                                    6
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-2 mb-3">
                            <div className="lota-stats">
                                <p>Role</p>
                                <h5>
                                    Utility
                                </h5>
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            <h3 className="fw-bold">Token Supply</h3>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="lota-stats mb-4 mb-md-0">
                                {lotaPrice.assets && (
                                    <>
                                        <p>Total supply</p>
                                        <h5>
                                            {numeral(totalSupply()).format('0,0.00',)}
                                            <span>LOTA</span>
                                        </h5>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="lota-stats">
                                <p>DAO funds</p>
                                <h5>
                                    {numeral(daoFunds()).format('0,0.00',)}
                                    <span>LOTA</span>
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="lota-stats">
                                <p>Circulating SUPPLY</p>
                                <h5>
                                    {numeral(circulatingSupply()).format('0,0.00',)}
                                    <span>LOTA</span>
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="lota-stats">
                                <p>Market Cap</p>
                                <h5>
                                    {numeral(marketCap()).format('0,0.00',)}
                                    <span>UST</span>
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-12 mb-3">
                            <div className="lota-stats">
                                {lotaPrice.assets && (
                                    <>
                                        <p>Price</p>
                                        <h5>
                                            {numeral(lotaPrice.assets[1].amount / lotaPrice.assets[0].amount,).format('0.000')}
                                            <span>UST</span>
                                        </h5>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-md-12 text-center">
                            <a
                                href="https://coinhall.org/charts/terra/terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta"
                                target="_blank"
                                className="btn btn-plain"
                                style={{
                                    color: 'rgb(166, 159, 187)',
                                    fontSize: '16px',
                                }}
                            >
                                <ChartLine
                                    size={21}
                                    style={{
                                        position: 'relative',
                                        top: '-2px',
                                        marginRight: '3px',
                                    }}
                                />
                                View chart
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}