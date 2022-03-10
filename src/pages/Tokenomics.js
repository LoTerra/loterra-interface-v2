import { LCDClient, WasmAPI } from '@terra-money/terra.js';
import numeral from 'numeral';
import { useStore } from '../store'
import { Head } from 'react-static'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {ChartLine} from 'phosphor-react'

const BURNED_LOTA = 4301383550000

export default () => {

    const { state, dispatch } = useStore()
    const [lotaPriceOnTerraswap, setlotaPriceOnTerraswap] = useState(0)
    const [lotaPriceOnAstroport, setLotaPriceOnAstroport] = useState(0)
    const [lotaPriceOnLoop, setLotaPriceOnLoop] = useState(0)
    const [lotaLoopPriceOnLoop, setLotaLoopPriceOnLoop] = useState(0)
    const [loopPrice, setLoopPrice] = useState(0)
    const terra = state.lcd_client
    const api = new WasmAPI(terra.apiRequester)
    const loterra_contract_address = 'terra1q2k29wwcz055q4ftx4eucsq6tg9wtulprjg75w'
    const loterra_terraswap_pool_address = 'terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta'
    const loterra_astroport_pool_address = 'terra1z7634s8kyyvjjuv7lcgkfy49hamxssxq9f9xw6'
    const loterra_loop_pool_address = 'terra15568nqrqcawm263yqcuuuvj5mh763tp8jyscq3'
    const loterraLoop_loop_pool_address = 'terra1kw95x0l3qw5y7jw3j0h3fy83y56rj68wd8w7rc'
    const loopUst_pool_address = 'terra106a00unep7pvwvcck4wylt4fffjhgkf9a0u6eu'

    const fetchContractQuery = useCallback(async () => {
        try {
            //Get current lota price
            const currentLotaPriceOnTerraswap = await api.contractQuery(
                loterra_terraswap_pool_address,
                {
                    pool: {},
                },
            )
            setlotaPriceOnTerraswap(currentLotaPriceOnTerraswap)
            const currentLotaPriceOnAstroport = await api.contractQuery(
                loterra_astroport_pool_address,
                {
                    pool: {},
                },
            )
            setLotaPriceOnAstroport(currentLotaPriceOnAstroport)
            const currentLotaPriceOnLoop = await api.contractQuery(
                loterra_loop_pool_address,
                {
                    pool: {},
                },
            )
            setLotaPriceOnLoop(currentLotaPriceOnLoop)
            const currentLotaLoopPriceOnLoop = await api.contractQuery(
                loterraLoop_loop_pool_address,
                {
                    pool: {},
                },
            )
            setLotaLoopPriceOnLoop(currentLotaLoopPriceOnLoop)
            
            const currentLoopPrice = await api.contractQuery(
                loopUst_pool_address,
                {
                    pool: {},
                },
            )
            setLoopPrice(currentLoopPrice)
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
        if (lotaPriceOnTerraswap.assets) {
            let sum =
                (lotaPriceOnTerraswap.assets[1].amount / lotaPriceOnTerraswap.assets[0].amount) *
                circulatingSupply()
            return sum
        }
    }

    function loopUstPrice() {
        if (loopPrice.assets && loopPrice.assets) {
            let lotaLoop = lotaLoopPriceOnLoop.assets[0].amount / lotaLoopPriceOnLoop.assets[1].amount
            let loopUst = loopPrice.assets[1].amount / loopPrice.assets[0].amount
            let result = lotaLoop * loopUst 
            return numeral(result).format('0.000')
        }
    }
    
    function loopUstLiquidity() {
        if (loopPrice.assets) {
            let lotaLoop = lotaLoopPriceOnLoop.assets[0].amount * 2 / 1000000
            let loopUst = loopPrice.assets[1].amount / loopPrice.assets[0].amount
            let result = lotaLoop * loopUst 
            return numeral(result).format('0,0.000')
        }
    }

    useEffect(() => {
        fetchContractQuery()  
    }, [fetchContractQuery])

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <title>
                    LoTerra - Decentralized lottery on Terra blockchain!
                </title>
                <meta
                    property="og:title"
                    content="Tokenomics | LOTA token info!"
                />
                <meta
                    property="og:description"
                    content="Tokenomics | LOTA token info!"
                />
                <meta
                    property="og:image"
                    content="https://loterra.io/favicon.ico"
                />
                <meta
                    property="twitter:title"
                    content="Tokenomics | LOTA token info!"
                />
                <meta
                    property="twitter:image"
                    content="https://loterra.io/favicon.ico"
                />
                <meta
                    property="twitter:description"
                    content="Tokenomics | LOTA token info!"
                />
            </Head>
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
                                {lotaPriceOnTerraswap.assets && (
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
                                {lotaPriceOnTerraswap.assets && (
                                    <>
                                        <p>Price</p>
                                        <h5>
                                            {numeral(lotaPriceOnTerraswap.assets[1].amount / lotaPriceOnTerraswap.assets[0].amount).format('0.000')}
                                            <span>UST</span>
                                        </h5>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <h3 className="fw-bold">Market</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="table text-white">
                            <thead>
                            <tr>
                                <th style={{minWidth:50}} className="text-center">#</th>
                                <th style={{minWidth:150}} className="text-center">Source</th>
                                <th style={{minWidth:100}} className="text-center">Pairs</th>
                                <th style={{minWidth:150}} className="text-center">Price</th>
                                <th style={{minWidth:150}} className="text-center">Total Liquidity</th>
                            </tr>
                            </thead>
                            
                            <tbody>
                                <tr>
                                    <td className="text-center">1</td>
                                    <td className="text-center"> 
                                        <>
                                            <button className='btn btn-link p-0' 
                                                onClick={() => window.open("https://app.terraswap.io/swap?to=&type=swap&from=uluna", "_blank")
                                            }>
                                                <img src="/Terraswap-Icon.png" 
                                                    style={{maxWidth:'30px'}} 
                                                    className="img-fluid align-self-center" 
                                                /> 
                                                Terraswap
                                            </button>
                                        </> 
                                    </td>
                                    <td className="text-center">LOTA/UST </td>
                                    <td className="text-center"> ${lotaPriceOnTerraswap && lotaPriceOnTerraswap.assets ? numeral(lotaPriceOnTerraswap.assets[1].amount / lotaPriceOnTerraswap.assets[0].amount).format('0.000') : ''}</td>
                                    <td className="text-center">{ lotaPriceOnTerraswap && lotaPriceOnTerraswap.assets ? numeral(lotaPriceOnTerraswap.assets[1].amount * 2 / 1000000).format('0,0.00') : '' } UST</td>
                                </tr>
                                <tr>
                                    <td className="text-center">2</td>
                                    <td className="text-center"> 
                                        <>
                                            <button className='btn btn-link p-0' 
                                                onClick={() => window.open("hhttps://dex.loop.markets/swap#Swap", "_blank")
                                            }>
                                                <img src="/LoopFinance-logo.png" 
                                                    style={{maxWidth:'30px'}} 
                                                    className="img-fluid align-self-center" 
                                                /> 
                                                 Loop Finance
                                            </button>
                                        </> 
                                    </td>
                                    <td className="text-center">LOTA/UST </td>
                                    <td className="text-center"> ${lotaPriceOnLoop && lotaPriceOnLoop.assets ? numeral(lotaPriceOnLoop.assets[1].amount / lotaPriceOnLoop.assets[0].amount).format('0.000') : ''}</td>
                                    <td className="text-center">{ lotaPriceOnLoop && lotaPriceOnLoop.assets ? numeral(lotaPriceOnLoop.assets[1].amount * 2 / 1000000).format('0,0.00') : '' } UST</td>
                                </tr>
                                <tr>
                                    <td className="text-center">4</td>
                                    <td className="text-center"> 
                                        <>
                                            <button className='btn btn-link p-0' 
                                                onClick={() => window.open("https://app.astroport.fi/swap?from=terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr&to=uusd", "_blank")
                                            }>
                                                <img src="/LoopFinance-logo.png" 
                                                    style={{maxWidth:'30px'}} 
                                                    className="img-fluid align-self-center" 
                                                /> 
                                                Loop Finance
                                            </button>
                                        </> 
                                    </td>
                                    <td className="text-center">LOTA/LOOP </td>
                                    <td className="text-center"> ${loopUstPrice()}</td>
                                    <td className="text-center">{loopUstLiquidity()} UST</td>
                                </tr>
                                <tr>
                                    <td className="text-center">3</td>
                                    <td className="text-center"> 
                                        <>
                                            <button className='btn btn-link p-0' 
                                                onClick={() => window.open("https://app.astroport.fi/swap?from=terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr&to=uusd", "_blank")
                                            }>
                                                <img src="/Astroport-logo.png" 
                                                    style={{maxWidth:'30px'}} 
                                                    className="img-fluid align-self-center" 
                                                /> 
                                                Astroport
                                            </button>
                                        </> 
                                    </td>
                                    <td className="text-center">LOTA/UST </td>
                                    <td className="text-center"> ${lotaPriceOnAstroport && lotaPriceOnAstroport.assets ? numeral(lotaPriceOnAstroport.assets[1].amount / lotaPriceOnAstroport.assets[0].amount).format('0.000') : ''}</td>
                                    <td className="text-center">{ lotaPriceOnAstroport && lotaPriceOnAstroport.assets ? numeral(lotaPriceOnAstroport.assets[1].amount * 2 / 1000000).format('0,0.00') : '' } UST</td>
                                </tr>
                            </tbody>
                        </table>
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
        </>
    )
}
