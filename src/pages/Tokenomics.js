import { LCDClient, WasmAPI } from '@terra-money/terra.js';
import numeral from 'numeral';
import { useStore } from '../store'
import { Head } from 'react-static'
import React, { useState, useEffect, useMemo, useRef } from 'react'



export default () => {
    return (
        <>
            <div className="w-100 py-3 py-md-5 text-center">
                <h1 className="mb-0 fw-bold" style={{textShadow:'1px 1px 10px #14053b'}}>Tokenomics</h1>
                <h2 className="my-2 fw-regular fs-6 mb-0">LOTA is the governance token of the LoTerra ecosystem gaming lottery, token give the power to vote proposals. LOTA holders are owners of the LoTerra ecosystem casino, their job is to ensure the ecosystem is working well, they can control lotteries configurations and get staking rewards for responsibilities and management.</h2>
            </div>
        </>
    )
}