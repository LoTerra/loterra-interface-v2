import React, { Component, Suspense, useContext, useEffect } from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Switch, Route, Link, useLocation, NavLink } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import './styles/base.scss'
import { Head } from 'react-static'
import { popper } from '@popperjs/core'

import Index from './pages/Index'
import Rapido from './pages/Rapido'
import Dogether from './pages/Dogether'
import Poll from './pages/poll/Index' 
import CreateProposal from './pages/poll/create' 
import Dao from './pages/DAO'
import Staking from './pages/Staking'
import SpaceWager from './pages/SpaceWager'
import Tokenomics from './pages/Tokenomics'

let bootstrap = {}
if (typeof document !== 'undefined') {
    bootstrap = require('bootstrap')
}
import { StoreProvider } from './store'
import ConnectWallet from './components/ConnectWallet'
import NormalNav from './components/NormalNav'
import { List } from 'phosphor-react'

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', (event) => {
        // Toggle the side navigation
        const sidebarToggle = document.body.querySelector('#sidebarToggle')
        if (sidebarToggle) {
            // Uncomment Below to persist sidebar toggle between refreshes
            // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
            //     document.body.classList.toggle('sb-sidenav-toggled');
            // }
            sidebarToggle.addEventListener('click', (event) => {
                event.preventDefault()
                document.body.classList.toggle('sb-sidenav-toggled')
                localStorage.setItem(
                    'sb|sidebar-toggle',
                    document.body.classList.contains('sb-sidenav-toggled'),
                )
            })
        }
    })
}

class App extends Component {
    render() {
        return (
            <Root>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                    />
                    <title>
                        LoTerra - Decentralized lottery on Terra blockchain
                    </title>
                    <link
                        rel="icon"
                        type="image/x-icon"
                        href="https://loterra.io/favicon.ico"
                    />
                    <link
                        data-hid="shortcut-icon"
                        rel="shortcut icon"
                        href="https://loterra.io/favicon.ico"
                    />
                    <meta property="og:title" content="LoTerra" />
                    <meta
                        property="og:image"
                        content="https://loterra.io/loterra.png"
                    />
                    <meta property="og:image:alt" content="LoTerra icon" />
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="LoTerra interface" />
                    <meta
                        property="og:description"
                        content="LoTerra is a lottery contract, buy tickets as a player or join the governance! DAO allows making decisions together! Manage the casino 🎰 Set the prize 🏆 Up the ticket price or go cheap 🏷 Extract max profits 🤑 Keep the vault secure at all times!"
                    />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="LoTerra" />
                    <meta
                        name="twitter:title "
                        content="LoTerra - Decentralized lottery on Terra blockchain"
                    />
                    <meta
                        name="twitter:description"
                        content="LoTerra is a lottery contract, buy tickets as a player or join the governance! DAO allows making decisions together! Manage the casino 🎰 Set the prize 🏆 Up the ticket price or go cheap 🏷 Extract max profits 🤑 Keep the vault secure at all times!"
                    />
                    <meta
                        name="twitter:image"
                        content="https://loterra.io/loterra.png"
                    />
                    <script
                        src="https://widgets.coingecko.com/coingecko-coin-price-chart-widget.js"
                        async
                    />
                </Head>
                <StoreProvider>
                    <div className={'d-flex'} id="wrapper">
                        <div id="sidebar-wrapper" className="sticky-top">
                            <NormalNav />
                        </div>
                        <div id="page-content-wrapper">
                            <nav
                                className="navbar navbar-expand navbar-light sticky-top"            
                                id="smallNav"
                            >
                                <div className="container-fluid px-0">
                                    <button
                                        className="btn btn-default"
                                        id="sidebarToggle"
                                    >
                                        {' '}
                                        <List size={31} weight={'bold'} />
                                    </button>
                                    <NavLink to={'/'} style={{
                                            width:50,
                                            left:'50%',
                                            marginLeft:-30,
                                            position:'absolute'
                                    }}>
                                    <img src="/logo.png" className="d-block d-md-none img-fluid"  />       
                                    </NavLink>  
                                    <div className="navbar">
                                        <ConnectWallet />
                                    </div>
                                </div>
                            </nav>

                            <Suspense
                                fallback={
                                    <div
                                        className={
                                            'loader h-100 text-center d-flex '
                                        }
                                    >
                                        <div className="align-self-center w-100">
                                            <div
                                                className="spinner-border text-primary"
                                                role="status"
                                            >
                                                <span className="visually-hidden">
                                                    Loading...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            >
                                <Switch>
                                    <Route exact path="/" component={Index} />
                                    <Route
                                        exact
                                        path="/rapido"
                                        component={Rapido}
                                    />
                                    <Route
                                        exact
                                        path="/spacewager"
                                        component={SpaceWager}
                                    />
                                    <Route
                                        exact
                                        path="/dogether"
                                        component={Dogether}
                                    />
                                    <Route
                                        exact
                                        path="/staking"
                                        component={Staking}
                                    />
                                    <Route exact path="/dao" component={Dao} />                                    
                                    <Route exact path="/poll/create" component={CreateProposal} />
                                    <Route exact path="/poll/:pollid" component={Poll} />
                                    <Route
                                        exact
                                        path="/tokenomics"
                                        component={Tokenomics} 
                                    />
                                    <Route render={() => <Routes />} />
                                </Switch>
                            </Suspense>
                        </div>
                    </div>
                </StoreProvider>
                {/* <Footer/> */}
            </Root>
        )
    }
}

export default App
