import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
    Wallet,
    CaretRight,
    UserCircle,
    Trophy,
    Power,
    List,
    Check,
    X,
    Ticket,
    Coin,
    Bank,
    Planet,
    FileText,
    Lightning
} from 'phosphor-react'
import { Link, NavLink } from 'react-router-dom'
import RapidoCounter from './RapidoCounter'


export default function NormalNav() {
//Nav link active settings
let homeClass, stakingClass, daoClass,spaceWagerClass, tokenomicsClass, rafflesClass,dogetherClass

useEffect(() => {
    if (typeof location !== 'undefined') {
        homeClass = location.pathname === '/' ? 'active' : ''
        dogetherClass = location.pathname.match(/^\/dogether/) ? 'active' : ''
        stakingClass = location.pathname.match(/^\/staking/) ? 'active' : ''
        daoClass = location.pathname.match(/^\/dao/) ? 'active' : ''
        spaceWagerClass = location.pathname.match(/^\/spacewager/) ? 'active' : ''
        tokenomicsClass = location.pathname.match(/^\/tokenomics/) ? 'active' : ''
        rafflesClass = location.pathname.match(/^\/raffles/) ? 'active' : ''
    }
},[location])

    return (
        <>
     
                <a className="navbar-brand text-center" href="/">
                    <img src="/logo.png" className="img-fluid" /> <span className="d-block">LoTerra</span>
                </a>               
        
                    <li className="nav-item">
                        <NavLink exact  to="/" className={'nav-link '}>
                            <Ticket
                                size={24}
                                style={{
                                    marginRight: '3px',
                                    position: 'relative',
                                    top: '-1px',
                                }}
                            />{' '}
                            Lottery
                            <span className="item-label">Jackpot Lottery</span>
                        </NavLink>
                    </li>
                    
                    <li className="nav-item">
                        <NavLink exact
                                 to="/spacewager"       
                                 className={'nav-link ' + spaceWagerClass}
                        >
                            <Planet
                                size={24}
                                style={{
                                    marginRight: '3px',
                                    position: 'relative',
                                    top: '-1px',
                                }}
                            />{' '}
                            Spacewager
                            <span className="item-label">
                                        Predict the next price
                                    </span>
                            <span
                                className="badge"
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '-9px',
                                    fontSize: '10px',
                                    lineHeight: '10px',
                                    padding: '3px',
                                    textTransform: 'uppercase',
                                    color: '#10003b',
                                    background: '#8bf6c2',
                                }}
                            >
                                BETA
                            </span>
                        </NavLink>
                    </li>
                    {/* <li className="nav-item">
                        <NavLink exact
                                 to="/raffles"
                                 className="nav-link"
                                 className={'nav-link ' + rafflesClass}
                        > 
                             <Ticket
                                size={24}
                                style={{
                                    marginRight: '3px',
                                    position: 'relative',
                                    top: '-1px',
                                }}
                            />{' '}
                            Raffles
                            <span className="item-label">
                                        NFTs & Event tickets
                                    </span>
                            <span
                                className="badge"
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '-9px',
                                    fontSize: '10px',
                                    lineHeight: '10px',
                                    padding: '3px',
                                    textTransform: 'uppercase',
                                    color: '#10003b',
                                    background: '#8bf6c2',
                                }}
                            >
                                BETA
                            </span>
                        </NavLink>
                    </li> */}
                    <li className="nav-item">
                        <NavLink exact 
                            to="/dogether"
                            className={'nav-link ' + dogetherClass}
                            style={{ position: 'relative' }}
                        >
                            <Trophy
                                size={24}
                                style={{
                                    marginRight: '3px',
                                    position: 'relative',
                                    top: '-1px',
                                }}
                            />{' '}
                            Dogether
                            <span className="item-label">No loss lottery</span>
                            <span
                                className="badge"
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '-9px',
                                    fontSize: '10px',
                                    lineHeight: '10px',
                                    padding: '3px',
                                    textTransform: 'uppercase',
                                    color: '#10003b',
                                    background: '#8bf6c2',
                                }}
                            >
                                BETA
                            </span>
                        </NavLink>
                    </li>
                    <li className="nav-item"
                       
                    >
                    <a className={'nav-link'}>
                        <Lightning
                            size={24}
                            style={{
                                marginRight: '3px',
                                position: 'relative',
                                top: '-1px',
                                opacity:0.5
                            }}
                        />{' '}
                        <span style={{opacity:0.5}}>Rapido</span>
                        <span className="item-label" style={{opacity:0.5}}>Lottery 2.0 </span>
                        
                        <span
                                className="badge"
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '-9px',
                                    fontSize: '10px',
                                    lineHeight: '10px',
                                    padding: '3px',
                                    textTransform: 'uppercase',
                                    color: '#fff',
                                    background: '#ff0dff',
                                }}
                            >
                                COMING SOON - <RapidoCounter expiryTimestamp={1647288000 * 1000}/>
                            </span>
                            </a>
                    </li>
                    <span className="sub-heading">Staking & DAO</span>
                    <li className="nav-item">
                        <NavLink exact 
                            to="/staking"
                            className={'nav-link ' + stakingClass}
                        >
                            <Coin
                                size={24}
                                style={{
                                    marginRight: '3px',
                                    position: 'relative',
                                    top: '-1px',
                                }}
                            />{' '}
                            Staking
                            <span className="item-label">
                                Become a casino owner
                            </span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact 
                            to="/dao"
                            className={'nav-link ' + daoClass}
                        >
                            <Bank
                                size={24}
                                style={{
                                    marginRight: '3px',
                                    position: 'relative',
                                    top: '-1px',
                                }}
                            />{' '}
                            DAO
                            <span className="item-label">
                                Together we decide 
                            </span>
                        </NavLink>
                    </li>
                    <span className="sub-heading">Resources</span>
                    <li className="nav-item">
                        <NavLink exact 
                            to="/tokenomics"
                            className={'nav-link ' + tokenomicsClass}
                        >
                            <Coin
                                size={24}
                                style={{
                                    marginRight: '3px',
                                    position: 'relative',
                                    top: '-1px',
                                }}
                            />{' '}
                            Tokenomics
                            <span className="item-label">
                                Token info
                            </span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <a
                            href="https://linktr.ee/LoTerra"
                            target="_blank"
                            className={'nav-link '}
                        >
                            <FileText
                                size={24}
                                style={{
                                    marginRight: '3px',
                                    position: 'relative',
                                    top: '-1px',
                                }}
                            />{' '}
                            Documentation
                            <span className="item-label">
                                All sources
                            </span>
                        </a>
                    </li>
                    <span className="sub-heading">LoTerra projects</span>
                    <li className="nav-item">
                        <a
                            href="https://app.alteredprotocol.com"
                            target="_blank"
                            className="nav-link"
                            className={'nav-link '}
                        >
                            <img src={'/alte-trans.svg'}  style={{
                                    marginRight: '3px',                            
                                }}  height="21" width="21"/>{' '}
                            Altered
                            <span className="item-label">
                                First elastic token on Terra
                            </span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                               href="https://curio.art"
                               target="_blank"
                            className="nav-link"
                            className={'nav-link '}
                        >
                           <img src={'/curio-trans.svg'} style={{
                                    marginRight: '3px',                            
                                }} height="21" width="21"/>{' '}
                            Curio
                            <span className="item-label">
                                NFT Marketplace
                            </span>
                        </a>
                    </li>
        </>
    )
}
