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
} from 'phosphor-react'
import { Link, NavLink } from 'react-router-dom'


export default function NormalNav() {
//Nav link active settings
let homeClass, stakingClass, daoClass,spaceWagerClass
if (typeof location !== 'undefined') {
    homeClass = location.pathname === '/' ? 'active' : ''
    stakingClass = location.pathname.match(/^\/staking/) ? 'active' : ''
    daoClass = location.pathname.match(/^\/dao/) ? 'active' : ''
    spaceWagerClass = location.pathname.match(/^\/spacewager/) ? 'active' : ''
}
    return (
        <>
     
                <a className="navbar-brand text-center" href="/">
                    <img src="/logo.png" className="img-fluid" /> <span className="d-block">LoTerra</span>
                </a>               
        
                    <li className="nav-item">
                        <NavLink exact  to="/" className={'nav-link'}>
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
                                 className="nav-link"
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
                    <li className="nav-item">
                        <NavLink exact 
                            to="/dogether"
                            className="nav-link"
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
                    <li className="nav-item">
                        <NavLink exact 
                            to="/staking"
                            className="nav-link"
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
                                Become a casino owner or earn LOTA when staking
                                LP
                            </span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact 
                            to="/dao"
                            className="nav-link"
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
