import { LCDClient, WasmAPI } from '@terra-money/terra.js';
import numeral from 'numeral';
import { useStore } from '../store'
import { Head } from 'react-static'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {ChartLine} from 'phosphor-react'
import RapidoCard from '../components/Rapido/RapidoCard';

export default () => {
    return (
        <>
            <div className="w-100 py-3 py-md-5 text-center">
                <h1 className="mb-0 fw-bold" style={{textShadow:'1px 1px 10px #14053b'}}>Rapido</h1>
                <h2 className="my-2 fw-regular fs-6 mb-0">Lottery every 5 minutes</h2>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <RapidoCard/>
                    </div>
                </div>    
            </div>
        </>
    )
}