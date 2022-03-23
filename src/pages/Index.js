import React, { useEffect, useState, useCallback, useRef } from 'react'
import Lottie from "lottie-react";
import stakingAnimation from "../components/lottie_animations/staking.json";
import rocketAnimation from "../components/lottie_animations/rocket.json";

import numeral from 'numeral'
import {
    X,
    ChartPie,
    ChartLine,
    PlusCircle,
    MinusCircle,
    PencilLine,
    Fire,
    Gift,
    MonitorPlay,
    Info,
    Check,
} from 'phosphor-react'
// import Jackpot from "../components/Jackpot";
import { Fee, MsgExecuteContract, WasmAPI } from '@terra-money/terra.js'
import Countdown from '../components/Countdown'
import TicketModal from '../components/TicketModal'

import { useStore } from '../store'

import Notification from '../components/Notification'
import Footer from '../components/Footer'
import AllowanceModal from '../components/AllowanceModal'
import PriceLoader from '../components/PriceLoader'
import JackpotResults from '../components/JackpotResults'
import { Link, NavLink } from 'react-router-dom'
import SwiperCore, {
    Navigation,
    Pagination,
    Autoplay,
    A11y,
    EffectFade,
} from 'swiper'

SwiperCore.use([Navigation, Pagination, Autoplay, EffectFade])

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

let useConnectedWallet = {}
if (typeof document !== 'undefined') {
    useConnectedWallet =
        require('@terra-money/wallet-provider').useConnectedWallet
}

const HomeCard = {
    marginTop: '50px',
    width: '100px',
    padding: '30px',
}

const loterra_contract_address = 'terra1q2k29wwcz055q4ftx4eucsq6tg9wtulprjg75w'
const loterra_pool_address = 'terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta'

const BURNED_LOTA = 4301383550000

export default () => {
    const [jackpot, setJackpot] = useState(0)
    const [jackpotAltered, setAlteredJackpot] = useState(0)
    const [jackpotAlteredUst, setAlteredJackpotUst] = useState(0)
    const [tickets, setTickets] = useState(0)
    const [players, setPlayers] = useState(0)
    const [recentPlayers, setRecentPlayers] = useState(0)
    const [payWith, setPayWith] = useState('ust')
    const [buyNow, setBuyNow] = useState(false)
    const [buyLoader, setBuyLoader] = useState(false)
    const [alteBonus, setAlteBonus] = useState(false)
    const [randomnizing, setRandomnizing] = useState(false)
    const [giftFriend, setGiftFriend] = useState({ active: false, wallet: '' })
    const [notification, setNotification] = useState({
        type: 'success',
        message: '',
        show: false,
    })
    const [ticketModal, setTicketModal] = useState(0)
    const [allowanceModal, setAllowanceModal] = useState(0)
    const [price, setPrice] = useState(0)
    const [contractBalance, setContractBalance] = useState(0)
    const [lotaPrice, setLotaPrice] = useState(0)
    const [expiryTimestamp, setExpiryTimestamp] =
        useState(1) /** default timestamp need to be > 1 */
    const bonusToggle = useRef(null)
    const friendsToggle = useRef(null)
    const loterraStats = useRef(null)
    const { state, dispatch } = useStore()
    const terra = state.lcd_client
    const api = new WasmAPI(terra.apiRequester)
    const fetchContractQuery = useCallback(async () => {
        try {
            const contractConfigInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    config: {},
                },
            )

            dispatch({ type: 'setConfig', message: contractConfigInfo })

            setPrice(contractConfigInfo.price_per_ticket_to_register)
            setExpiryTimestamp(
                parseInt(contractConfigInfo.block_time_play * 1000),
            )
            // const bank = new BankAPI(terra.apiRequester)
            const jackpotAlocation =
                contractConfigInfo.jackpot_percentage_reward
            terra.bank.balance(loterra_contract_address).then(([coins]) => {
                const ustBalance = coins.get('uusd').toData()

                const contractJackpotInfo =
                    (ustBalance.amount * jackpotAlocation) / 100

                setContractBalance(ustBalance.amount / 1000000)
                setJackpot(parseInt(contractJackpotInfo) / 1000000)
            })

            const jackpotAltered = await api.contractQuery(
                state.alteredContractAddress,
                {
                    balance: {
                        address: state.loterraContractAddress,
                    },
                },
            )

            const alteredJackpot =
                (jackpotAltered.balance * jackpotAlocation) / 100

            setAlteredJackpot(parseInt(alteredJackpot) / 1000000)
            dispatch({
                type: 'setAlteredJackpot',
                message: alteredJackpot,
            })

            const poolAlte = await api.contractQuery(
                'terra18adm0emn6j3pnc90ldechhun62y898xrdmfgfz',
                {
                    pool: {},
                },
            )

            let ust = parseInt(poolAlte.assets[1].amount)
            let alte = parseInt(poolAlte.assets[0].amount)

            let formatPrice = ust / alte
            let final =
                (formatPrice.toFixed() * parseInt(alteredJackpot)) / 1000000
            setAlteredJackpotUst(final)

            const jackpotInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    jackpot: {
                        lottery_id: contractConfigInfo.lottery_counter - 1,
                    },
                },
            )
            dispatch({
                type: 'setHistoricalJackpot',
                message: parseInt(jackpotInfo) / 1000000,
            })

            const jackpotAlteInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    jackpot_alte: {
                        lottery_id: contractConfigInfo.lottery_counter - 1,
                    },
                },
            )
            dispatch({
                type: 'setHistoricalJackpotAlte',
                message: parseInt(jackpotAlteInfo) / 1000000,
            })

            const contractTicketsInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    count_ticket: {
                        lottery_id: contractConfigInfo.lottery_counter,
                    },
                },
            )
            setTickets(parseInt(contractTicketsInfo))

            const contractPlayersInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    count_player: {
                        lottery_id: contractConfigInfo.lottery_counter,
                    },
                },
            )
            setPlayers(parseInt(contractPlayersInfo))

            const recentPlayersData = await api.contractQuery(
                loterra_contract_address,
                {
                    count_player: {
                        lottery_id: contractConfigInfo.lottery_counter - 1,
                    },
                },
            )
            setRecentPlayers(parseInt(recentPlayersData))
            // Set default tickets to buy is an average bag
            multiplier(
                parseInt(
                    isNaN(contractTicketsInfo / contractPlayersInfo)
                        ? 1
                        : contractTicketsInfo / contractPlayersInfo,
                ),
            )

            //Get poll data

            //Get latest winning combination
            const winningCombination = await api.contractQuery(
                loterra_contract_address,
                {
                    winning_combination: {
                        lottery_id: contractConfigInfo.lottery_counter - 1,
                    },
                },
            )
            dispatch({
                type: 'setWinningCombination',
                message: winningCombination,
            })

            //Get current lota price
            const currentLotaPrice = await api.contractQuery(
                loterra_pool_address,
                {
                    pool: {},
                },
            )
            setLotaPrice(currentLotaPrice)

            //Dev purposes disable for production
            //console.log('contract info',contractConfigInfo)

            const { winners } = await api.contractQuery(
                loterra_contract_address,
                {
                    winner: {
                        lottery_id: contractConfigInfo.lottery_counter - 1,
                    },
                },
            )
            dispatch({ type: 'setAllWinners', message: winners })
            // Query all players
            const players = await api.contractQuery(loterra_contract_address, {
                players: {
                    lottery_id: contractConfigInfo.lottery_counter - 1,
                },
            })
            dispatch({ type: 'setAllPlayers', message: players })
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetchContractQuery()
    }, [fetchContractQuery])
    let connectedWallet = ''
    if (typeof document !== 'undefined') {
        connectedWallet = useConnectedWallet()
    }

    const [combo, setCombo] = useState('')
    const [result, setResult] = useState('')
    const [amount, setAmount] = useState(0)

    function checkIfDuplicateExists(w) {
        return new Set(w).size !== w.length
    }

    async function execute(a) {
        setBuyLoader(true)
        if (!connectedWallet) {
            setBuyLoader(false)
            return showNotification('Please connect your wallet', 'error', 4000)
        }
        const allowance = await api.contractQuery(
            state.alteredContractAddress,
            {
                allowance: {
                    owner: connectedWallet.walletAddress,
                    spender: state.loterraContractAddress,
                },
            },
        )

        if (
            alteBonus &&
            parseInt(allowance.allowance) <
                (amount * state.config.price_per_ticket_to_register) /
                    state.config.bonus_burn_rate
        ) {
            setAllowanceModal(true)
            setBuyLoader(false)
            return showNotification('No allowance yet', 'error', 4000)
        }

        const cart = state.combination.split(' ') // combo.split(" ")

        //Check if friend gift toggle wallet address filled
        if (giftFriend.active && giftFriend.wallet == '') {
            showNotification(
                'Gift friends enabled but no friends wallet address',
                'error',
                4000,
            )
            setBuyLoader(false)
            return
        }
        //Check duplicates
        if (checkIfDuplicateExists(cart)) {
            showNotification('Combinations contain duplicate', 'error', 4000)
            setBuyLoader(false)
            return
        }
        // const obj = new Fee(1_000_000, { uusd: 200000 })
        const addToGas = 5000 * cart.length
        // const obj = new Fee(1_000_000, { uusd: 30000 + addToGas })
        //const obj = new Fee(200_000, { uusd: 340000 + addToGas })
        const obj = new Fee(10_000, { uusd: 4500 })
        let exec_msg = {
            register: {
                combination: cart,
            },
        }
        //Check for paymethod (ust or alte)
        let coins_msg
        if (payWith == 'ust') {
            coins_msg = {
                uusd: state.config.price_per_ticket_to_register * cart.length,
            }
        } else {
            coins_msg = {
                uusd: state.config.price_per_ticket_to_register * cart.length,
            }
        }

        //Check for alte bonus enabled
        if (alteBonus) {
            exec_msg.register.altered_bonus = true
            coins_msg = {
                uusd:
                    state.config.price_per_ticket_to_register * cart.length -
                    (state.config.price_per_ticket_to_register * cart.length) /
                        state.config.bonus_burn_rate,
            }
        }

        if (giftFriend.active && giftFriend.wallet != '') {
            exec_msg.register.address = giftFriend.wallet
        }
        let msgs = []
        if (payWith == 'ust') {
            const msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                loterra_contract_address,
                exec_msg,
                coins_msg,
            )
            msgs.push(msg)
        } else {
            //Altered of message
            let alteMsg
            if (giftFriend.active && giftFriend.wallet != '') {
                //Giftfriend enabled
                alteMsg = {
                    register_alte: {
                        combination: cart,
                        gift_address: giftFriend.wallet,
                    },
                }
            } else {
                alteMsg = {
                    register_alte: {
                        combination: cart,
                    },
                }
            }

            const msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                state.alteredContractAddress,
                {
                    send: {
                        contract: loterra_contract_address,
                        amount: String(
                            state.config.price_per_ticket_to_register *
                                cart.length,
                        ),
                        msg: Buffer.from(JSON.stringify(alteMsg)).toString(
                            'base64',
                        ),
                    },
                },
            )
            msgs.push(msg)
        }

        if (state.config.lottery_counter > 48) {
            try {
                ////////////////////////////
                //  VALKYRIE START
                ////////////////////////////
                //Validate if user is eligible
                const vkrEligible = await api.contractQuery(
                    state.vkrQualifierContract,
                    {
                        qualify_preview: {
                            lottery_id: state.config.lottery_counter,
                            player: connectedWallet.walletAddress,
                            preview_play_count: cart.length,
                        },
                    },
                )
                //If user is eligible go further
                if (vkrEligible && vkrEligible.continue_option == 'eligible') {
                    //Get participation count qualifier contract
                    const participationCount = await api.contractQuery(
                        state.vkrQualifierContract,
                        {
                            participation_count: {
                                lottery_id: state.config.lottery_counter,
                                player: connectedWallet.walletAddress,
                            },
                        },
                    )
                    //Get total tickets bought by lottery_id
                    let combinations = {}
                    combinations.combination = []
                    const combinations_query = await api
                        .contractQuery(state.loterraContractAddress, {
                            combination: {
                                lottery_id: state.config.lottery_counter,
                                address: state.wallet.walletAddress,
                            },
                        })
                        .then((a) => {
                            combinations = a
                        })
                        .catch((error) => {
                            console.log('no combinations yet')
                        })

                    //Do the C - Q * 10 formula
                    const participationTimes =
                        (combinations.combination.length +
                            cart.length -
                            participationCount.participation_count * 10) /
                        10
                    console.log(
                        Math.floor(participationTimes),
                        combinations.combination.length,
                        cart.length,
                        participationCount.participation_count,
                    )

                    for (
                        let index = 0;
                        index < Math.floor(participationTimes);
                        index++
                    ) {
                        if (
                            state.vkrReferrer.status &&
                            state.vkrReferrer.code !== ''
                        ) {
                            //Valkyrie referrer detected
                            const msg = new MsgExecuteContract(
                                connectedWallet.walletAddress,
                                state.vkrContract,
                                {
                                    participate: {
                                        actor: connectedWallet.walletAddress,
                                        referrer: {
                                            compressed: state.vkrReferrer.code,
                                        },
                                    },
                                },
                            )

                            msgs.push(msg)
                        } else {
                            //Check normal valkyrie participator
                            const msg = new MsgExecuteContract(
                                connectedWallet.walletAddress,
                                state.vkrContract,
                                {
                                    participate: {
                                        actor: connectedWallet.walletAddress,
                                    },
                                },
                            )
                            msgs.push(msg)
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
        ////////////////////////////
        //  VALKYRIE END
        ////////////////////////////

        ///Make good fee

        connectedWallet
            .post({
                msgs: msgs,
                // fee: obj,
                // gasPrices: obj.gasPrices(),
                gasPrices: obj.gasPrices(),
                gasAdjustment: 1.7,
            })
            .then((e) => {
                if (e.success) {
                    //setResult("register combination success")
                    showNotification(
                        'register combination success',
                        'success',
                        4000,
                    )
                    multiplier(amount)
                    setAlteBonus(false)
                    setBuyLoader(false)
                } else {
                    //setResult("register combination error")
                    showNotification(
                        'register combination error',
                        'error',
                        4000,
                    )
                    setBuyLoader(false)
                }
            })
            .catch((e) => {
                //setResult(e.message)
                console.log(e)
                showNotification(e.message, 'error', 4000)
                setBuyLoader(false)
            })
    }

    /*function change(e) {
        e.preventDefault();
        setCombo(e.target.value.toLowerCase())
        console.log(combo.split(" "))
        let cart = e.target.value.toLowerCase().replace( /\s\s+/g, ' ' ).split(" ")
        if (cart[0] == ""){
            cart = []
        }
        setAmount(cart.length)
    } */
    function inputChange(e) {
        e.preventDefault()
        let ticketAmount = e.target.value
        if (ticketAmount > 200) ticketAmount = 200
        addCode(ticketAmount)
        setAmount(ticketAmount)
    }

    function addCode(amount) {
        if (amount >= 1) {
            //console.log(state.combination,amount)
            let copy = state.combination.split(' ')
            if (amount < copy.length) {
                let nr = copy.length - amount
                copy.splice(-nr)
            } else {
                let nr = amount - copy.length
                for (let index = 0; index < nr; index++) {
                    let newCombo = generate()
                    copy.push(newCombo)
                }
            }
            let filtered = copy.filter(function (el) {
                return el != null
            })
            let string = filtered.join(' ')
            dispatch({ type: 'setCombination', message: string })
        }
    }

    function generate() {
        const combination = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
        ]
        let randomCombination = ''
        for (let x = 0; x < 6; x++) {
            const random = Math.floor(Math.random() * combination.length)
            randomCombination += combination[random]
        }
        return randomCombination
    }

    function multiplier(mul) {
        setRandomnizing(true)
        let allCombo = ''
        for (let x = 0; x < mul; x++) {
            let newCombo = generate()
            allCombo = allCombo == '' ? newCombo : allCombo + ' ' + newCombo
        }
        // setCombo(allCombo)
        dispatch({ type: 'setCombination', message: allCombo })
        const cart = allCombo.split(' ')
        setAmount(cart.length)
        setTimeout(() => {
            setRandomnizing(false)
        }, 1500)
    }

    function updateCombos(new_code, index) {
        //console.log('updating combos', new_code, index)
        let copy = state.combination
        copy.split(' ').map((obj, k) => {
            if (k == index) {
                //console.log(obj,' will be ',new_code)
                obj = new_code
            }
        })
        toast('you changed a ticket code')
        dispatch({ type: 'setCombination', message: copy })
        //console.log(copy)
        //console.log(state.combination)
    }

    function hideNotification() {
        setNotification({
            message: notification.message,
            type: notification.type,
            show: false,
        })
    }

    function showNotification(message, type, duration) {
        //console.log('fired notification')
        setNotification({
            message: message,
            type: type,
            show: true,
        })
        //console.log(notification)
        //Disable after $var seconds
        setTimeout(() => {
            setNotification({
                message: message,
                type: type,
                show: false,
            })
            //console.log('disabled',notification)
        }, duration)
    }

    function amountChange(type) {
        let ticketAmount = amount
        if (type == 'up') {
            ticketAmount++
        } else {
            ticketAmount--
        }
        if (ticketAmount <= 1) ticketAmount = 1
        if (ticketAmount > 200) ticketAmount = 200
        addCode(ticketAmount)
        setAmount(ticketAmount)
    }

    function marketCap() {
        if (lotaPrice.assets) {
            let sum =
                (lotaPrice.assets[1].amount / lotaPrice.assets[0].amount) *
                circulatingSupply()
            return sum
        }
    }

    function circulatingSupply() {
        let total =
            (parseInt(state.tokenInfo.total_supply) - BURNED_LOTA) / 1000000
        let daoFunds = parseInt(state.daoFunds / 1000000)
        let sum = total - daoFunds
        return sum
    }

    function totalSupply() {
        let total =
            (parseInt(state.tokenInfo.total_supply) - BURNED_LOTA) / 1000000
        return total
    }

    function giftCheckbox(e, checked) {
        setGiftFriend({ active: !giftFriend.active, wallet: '' })
    }
    function giftAddress(e) {
        setGiftFriend({ active: true, wallet: e.target.value })
    }

    function bonusCheckbox(e, checked) {
        setAlteBonus(!alteBonus)
    }

    const clickElement = (ref) => {
        ref.current.dispatchEvent(
            new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1,
            }),
        )
    }

    function scrollToStats() {
        window.scrollTo({
            behavior: 'smooth',
            top: loterraStats.current.offsetTop,
        })
    }

    function totalNrPrizes() {
        let count = 0
        state.allRecentWinners.map((obj) => {
            obj.claims.ranks.map((rank) => {
                count++
            })
        })
        return count
    }

    return (
        <>
            {/* <img src={'/confetti.webp'} style={{
            position:'absolute',
            maxWidth:'100%'
            }}/> */}
            {/* <div
                className="hero"
                style={{
                    backgroundImage:
                        'linear-gradient(0deg, #160150, #170f5300, #17095200),radial-gradient(#f23bf23b , #160150ad), url(rays.svg)',
                    backgroundPosition: 'center center',
                }}
            > */}

            <div className="home-hero" style={{height:500, background:'linear-gradient(45deg, #210a5c, #1d084f91),url("https://images.pexels.com/photos/3329716/pexels-photo-3329716.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260")', backgroundSize:'100%', backgroundPosition:'center'}}>
                <div className="container d-flex h-100">
                        <div className="col-md-7 align-self-center">
                            <h1 className="fw-bold">Decentralized gaming ecosystem</h1>
                            <h3 className="text-muted">Grow gaming on terra together</h3>
                        </div>
                </div>
            </div>
    
            <div style={{background:'linear-gradient(360deg, #16073e, transparent)', paddingBottom:'35px', paddingBottom:'50px'}}>
                <div className="container">
                <div className="row px-md-5">
                    <div className="col-12 text-center text-md-start mt-4">
                        <h3 className="banner-swiper-label">New Games</h3>
                    </div>
                    <div className="col-12 banner-swiper">
                        <Swiper
                                      
               
                        modules={[Navigation, Pagination, A11y]}
                        pagination={true}
                        spaceBetween={25}
                        slidesPerView={2}
                        breakpoints={{
                            // when window width is >= 640px
                            1: {
                                slidesPerView: 1,
                         
                            },
                            // when window width is >= 768px
                            768: {
                                slidesPerView: 2,
                           
                            },
                            1000: {
                                slidesPerView: 2,
                             
                            },
                            1500: {
                                slidesPerView: 2,
                            
                            },
                        }}                  
                    
                        >
                            <SwiperSlide key={1}>
                            <div className="card lota-card lota-card-glass text-center" 
                                style={{borderRadius:'20px', border:'0px'}}
                            >
                            <div className="card-body" style={{minHeight:76}}>
                                <NavLink to="/rapido" className="btn btn-default text-white float-end fw-bold btn-sm w-100"
                                style={{
                                    position:'absolute',
                                    right:0,
                                    bottom:-10,
                                    borderRadius:'10px', 
                                }}
                                >Play Now</NavLink>
                                <img src={'/Rapido-logo.svg'} style={{maxHeight:'60px'}} className="img-fluid"/>
                                <p className="text-muted d-none d-md-block">Win up to $50,000 every 5 minutes</p>
                             
                            </div>
                        </div>
                            </SwiperSlide>
                            <SwiperSlide key={2}>
                            <div className="card lota-card lota-card-glass text-center" 
                                style={{borderRadius:'20px', border:'0px'}}
                            >
                            <div className="card-body" style={{minHeight:76}}>
                                <NavLink to="/spacewager" className="btn btn-default text-white float-end fw-bold btn-sm w-100"
                                style={{
                                    position:'absolute',
                                    right:0,
                                    bottom:-10,
                                    borderRadius:'10px',
                                }}
                                >Play Now</NavLink>
                                <img src={'/spacewager-logo.svg'} style={{maxHeight:'60px'}} className="img-fluid"/>
                                <p className="text-muted d-none d-md-block">Predicts LUNA's future price</p>
                             
                            </div>
                        </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>                     
                </div>
                </div>
            </div>
            <div className="container">
                <div className="row py-4">
                    <div className="col-md-6 d-flex p-5">
                        <div className="w-100 align-self-center">
                            <h1 className="fw-bold">Managed by holders</h1>
                            <p className="fs-5 text-muted">As a LOTA staker you will help making LoTerra into a better ecosystem</p>
                            <p className="fs-6 fw-bold mb-0">Join the DAO</p>
                            <p className="fs-6 text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mollis leo et erat tempor, posuere interdum eros euismod.</p>
                            <p className="fs-6 fw-bold mb-0">Earn a % on fees generated by games</p>
                            <p className="fs-6 text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mollis leo et erat tempor, posuere interdum eros euismod.</p>         
                            <Link to="/staking" className="btn btn-primary text-white mt-4 fw-bold">Start staking</Link>
                        </div>
                    </div>
                    <div className="col-md-6 p-5">
                            <Lottie animationData={stakingAnimation}/>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row py-4">
                <div className="col-md-6 p-5">
                <Lottie animationData={rocketAnimation}/>
                </div>
                <div className="col-md-6 d-flex p-5">
                    <div className="align-self-center w-100">
                        <h1 className="fw-bold">Start playing</h1>      
                        <p className="small fw-normal text-muted"><span className="text-white text-decoration-underline">Terra Station</span> | Kado OnRamp | XDefi Wallet</p>             
                        <p className="fs-6 fw-bold mb-0">Create a terra station wallet</p>
                        <p className="fs-6 text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mollis leo et erat tempor, posuere interdum eros euismod.</p>
                        <p className="fs-6 fw-bold mb-0">Deposit ust into your wallet</p>
                        <p className="fs-6 text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mollis leo et erat tempor, posuere interdum eros euismod.</p>
                        <p className="fs-6 fw-bold mb-0">Connect wallet on LoTerra</p>
                        <p className="fs-6 text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mollis leo et erat tempor, posuere interdum eros euismod.</p>
                    </div>
                </div>
                    
                </div>
            </div>

            <Footer/>
        </>
    )
}
