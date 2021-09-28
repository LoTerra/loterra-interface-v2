import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
    useRef,
} from 'react'
import numeral from 'numeral'
import {
    Users,
    Ticket,
    Coin,
    Trophy,
    UserFocus,
    UserCircle,
    ChartPie,
    PlusCircle,
    MinusCircle,
    PencilLine,
    Fire,
    Gift,
    UsersThree,
    ArrowDown,
    MonitorPlay,
    Info,
} from 'phosphor-react'
// import Jackpot from "../components/Jackpot";
import {
    StdFee,
    MsgExecuteContract,
    LCDClient,
    WasmAPI,
    BankAPI,
} from '@terra-money/terra.js'
import Countdown from '../components/Countdown'
import TicketModal from '../components/TicketModal'

import { useStore } from '../store'

import Notification from '../components/Notification'
import SocialShare from '../components/SocialShare'
import Footer from '../components/Footer'
import AllowanceModal from '../components/AllowanceModal'
import WinnerRow from '../components/WinnerRow'
import PriceLoader from '../components/PriceLoader'
import JackpotResults from '../components/JackpotResults'

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
    const [tickets, setTickets] = useState(0)
    const [players, setPlayers] = useState(0)
    const [recentPlayers, setRecentPlayers] = useState(0)
    const [buyLoader, setBuyLoader] = useState(false)
    const [alteBonus, setAlteBonus] = useState(false)
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
                }
            )

            dispatch({ type: 'setConfig', message: contractConfigInfo })

            setPrice(contractConfigInfo.price_per_ticket_to_register)
            setExpiryTimestamp(
                parseInt(contractConfigInfo.block_time_play * 1000)
            )
            const bank = new BankAPI(terra.apiRequester)
            const contractBalance = await bank.balance(loterra_contract_address)
            const ustBalance = contractBalance.get('uusd').toData()
            const jackpotAlocation =
                contractConfigInfo.jackpot_percentage_reward
            const contractJackpotInfo =
                (ustBalance.amount * jackpotAlocation) / 100

            setContractBalance(ustBalance.amount / 1000000)
            setJackpot(parseInt(contractJackpotInfo) / 1000000)

            const jackpotInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    jackpot: {
                        lottery_id: contractConfigInfo.lottery_counter - 1,
                    },
                }
            )
            dispatch({
                type: 'setHistoricalJackpot',
                message: parseInt(jackpotInfo) / 1000000,
            })

            const contractTicketsInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    count_ticket: {
                        lottery_id: contractConfigInfo.lottery_counter,
                    },
                }
            )
            setTickets(parseInt(contractTicketsInfo))

            const contractPlayersInfo = await api.contractQuery(
                loterra_contract_address,
                {
                    count_player: {
                        lottery_id: contractConfigInfo.lottery_counter,
                    },
                }
            )
            setPlayers(parseInt(contractPlayersInfo))

            const recentPlayersData = await api.contractQuery(
                loterra_contract_address,
                {
                    count_player: {
                        lottery_id: contractConfigInfo.lottery_counter - 1,
                    },
                }
            )
            setRecentPlayers(parseInt(recentPlayersData))
            // Set default tickets to buy is an average bag
            multiplier(
                parseInt(
                    isNaN(contractTicketsInfo / contractPlayersInfo)
                        ? 1
                        : contractTicketsInfo / contractPlayersInfo
                )
            )

            //Get poll data

            //Get latest winning combination
            const winningCombination = await api.contractQuery(
                loterra_contract_address,
                {
                    winning_combination: {
                        lottery_id: contractConfigInfo.lottery_counter - 1,
                    },
                }
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
                }
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
                }
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

    async function execute() {
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
            }
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
                4000
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
        // const obj = new StdFee(1_000_000, { uusd: 200000 })
        const addToGas = 5450 * cart.length
        // const obj = new StdFee(1_000_000, { uusd: 30000 + addToGas })
        const obj = new StdFee(2_000_000, { uusd: 913000 + addToGas })
        let exec_msg = {
            register: {
                combination: cart,
            },
        }
        let coins_msg = {
            uusd: state.config.price_per_ticket_to_register * cart.length,
        }
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

        const msg = new MsgExecuteContract(
            connectedWallet.walletAddress,
            loterra_contract_address,
            exec_msg,
            coins_msg
        )

        connectedWallet
            .post({
                msgs: [msg],
                fee: obj,
                // gasPrices: obj.gasPrices(),
                // gasAdjustment: 1.5,
            })
            .then((e) => {
                if (e.success) {
                    //setResult("register combination success")
                    showNotification(
                        'register combination success',
                        'success',
                        4000
                    )
                    multiplier(amount)
                    setAlteBonus(false)
                    setBuyLoader(false)
                } else {
                    //setResult("register combination error")
                    showNotification(
                        'register combination error',
                        'error',
                        4000
                    )
                    setBuyLoader(false)
                }
            })
            .catch((e) => {
                //setResult(e.message)
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
        let allCombo = ''
        for (let x = 0; x < mul; x++) {
            let newCombo = generate()
            allCombo = allCombo == '' ? newCombo : allCombo + ' ' + newCombo
        }
        // setCombo(allCombo)
        dispatch({ type: 'setCombination', message: allCombo })
        const cart = allCombo.split(' ')
        setAmount(cart.length)
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
            })
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
            <div
                className="hero"
                style={{
                    backgroundImage: 'url(rays.svg)',
                    backgroundPosition: 'center',
                }}
            >
                <div className="container-fluid container-md">
                    <div className="row">
                        <div className="col-lg-12 col-xl-8 mx-auto text-center">
                            <div className="jackpot">
                                <p>Jackpot</p>
                                <h2>
                                    {numeral(jackpot)
                                        .format('0,0.00')
                                        .split('')
                                        .map((obj) => {
                                            return (
                                                <div className="roller">
                                                    {obj}
                                                </div>
                                            )
                                        })}
                                    <div className="roller">
                                        <span>UST</span>
                                    </div>
                                </h2>
                                <h3>Draws every 3 days</h3>                                
                            </div>
                            <div className="row">
                            <div className="col-md-8 mx-auto">
                                <div className="countdown-holder">
                                        <div className="row">
                                        <div className="col-6">
                                    <div className="card stats-card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-12 col-md-4 text-center svg-rotate">
                                                    <UserFocus
                                                        size={36}                                                        
                                                    />
                                                </div>
                                                <div className="col-12 col-md-8 text-center text-md-start">
                                                    <h3>
                                                        <span>PLAYERS PLAYING</span>
                                                        {players ? (
                                                            players
                                                        ) : (
                                                            <PriceLoader />
                                                        )}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-6">
                                    <div className="card stats-card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-12 col-md-4 text-center svg-rotate">
                                                    <Ticket
                                                        size={36}                                                        
                                                    />
                                                </div>
                                                <div className="col-12 col-md-8 text-center text-md-start">
                                                    <h3>
                                                        <span>TICKETS SOLD</span>
                                                        {tickets ? (
                                                            tickets
                                                        ) : (
                                                            <PriceLoader />
                                                        )}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                            <div className="col-10 mx-auto">
                                                <Countdown expiryTimestamp={expiryTimestamp} />
                                            </div>
                                        </div>
                                </div>                                
                            </div>
                         
                            </div>
                        </div>
                       
                        <div className="col-12 col-md-8 mx-auto">
                            <div className="row">                                
                                <div className="col-12 col-md-8 mx-auto">
                                    <div className="card stats-card-special latest-draw">                                       
                                            <div className="card-header text-center">
                                                <div className="card-header-icon">
                                                    <Trophy
                                                        size={36}
                                                        color="#20ff93"
                                                    />
                                                </div>
                                                <h3 style={{fontSize:'21px'}}>Latest draw</h3>
                                            </div>   
                                            <div className="card-body text-center">                                         
                                            <p className="players">
                                                <strong>{recentPlayers} <UsersThree
                                                        size={38}
                                                        style={{
                                                            marginTop:'-5px'
                                                        }}                                                       
                                                    /></strong>
                                            </p>
                                            <p className="sub">                                                
                                                <strong>
                                                    {totalNrPrizes()} prizes
                                                </strong>{' '}
                                                and{' '}
                                                <strong>
                                                    {state.allRecentWinners.length}{' '}
                                                    winners!
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>              
                </div>

                {/*
             <div className="mt-4">contract-v2.0.1</div>
                <div className="text-sm">terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0</div> */}
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 col-xl-4 mx-auto">
                        <div className="card amount-block">
                            <div className="card-header">
                                <h3>Book Your Tickets</h3>
                            </div>
                            <div className="card-body">                                
                                <small>
                                    <span>HINT</span> Increase your odds!
                                    Average buying ticket is{' '}
                                    {parseInt(tickets / players)}
                                </small>
                                <div className="input-group mt-3 mb-2">
                                    <button
                                        className="btn btn-default"
                                        onClick={() => amountChange('down')}
                                    >
                                        <MinusCircle
                                            size={31}
                                            color={'#9183d4'}
                                        />
                                    </button>
                                    <input
                                        type="number"
                                        className="form-control amount-control"
                                        value={amount}
                                        min="1"
                                        max="200"
                                        step="1"
                                        onChange={(e) => inputChange(e)}
                                    />
                                    <button
                                        className="btn btn-default"
                                        onClick={() => amountChange('up')}
                                    >
                                        <PlusCircle
                                            size={31}
                                            color={'#9183d4'}
                                        />
                                    </button>
                                </div>
                                {/* <p className="mb-2">Total: <strong>{numeral((amount * price) / 1000000).format("0,0.00")} UST</strong></p> */}
                                {!alteBonus ? (
                                    <p className="mb-2">
                                        Total:{' '}
                                        <strong>
                                            {numeral(
                                                (amount * price) / 1000000
                                            ).format('0,0.00')}{' '}
                                            UST
                                        </strong>
                                    </p>
                                ) : (
                                    <>
                                        <p
                                            className="mb-0"
                                            style={{
                                                textDecoration: 'line-through',
                                            }}
                                        >
                                            Total:{' '}
                                            <strong>
                                                {numeral(
                                                    (amount * price) / 1000000
                                                ).format('0,0.00')}{' '}
                                                UST
                                            </strong>
                                        </p>
                                        <p
                                            className="mb-2"
                                            style={{ color: '#4ee19b' }}
                                        >
                                            Total:{' '}
                                            <strong>
                                                {' '}
                                                {numeral(
                                                    (amount * price) / 1000000 -
                                                    (amount * price) / 1000000 /
                                                            state.config
                                                                .bonus_burn_rate
                                                ).format('0,0.00')}{' '}
                                                UST{' '}
                                                <span>
                                                    +{' '}
                                                    {numeral(
                                                        (amount * price) / 1000000 /
                                                            state.config
                                                                .bonus_burn_rate
                                                    ).format('0,0.00')}{' '}
                                                    ALTE
                                                </span>
                                            </strong>
                                        </p>
                                        <span className="info mb-2">
                                            <Info
                                                size={14}
                                                style={{ marginTop: '-2px' }}
                                                weight="fill"
                                                className="me-1"
                                            />
                                            No ALTE? you can buy ALTE on the{' '}
                                            <a
                                                href="https://app.alteredprotocol.com"
                                                target="_blank"
                                            >
                                                Altered website
                                            </a>
                                        </span>
                                    </>
                                )}
                                <p
                                    style={{
                                        marginBottom: '7px',
                                        fontSize: '14px',
                                        opacity: '0.3',
                                    }}
                                >
                                    Earn extra bonus while burning{' '}
                                    <a
                                        style={{ color: '#fff' }}
                                        href="https://app.alteredprotocol.com"
                                        target="_blank"
                                    >
                                        Altered
                                    </a>
                                </p>
                                <label className="bonus-label">
                                    <input
                                        type="checkbox"
                                        ref={bonusToggle}
                                        checked={alteBonus}
                                        className="switch"
                                        name="alte_bonus"
                                        onChange={(e, checked) =>
                                            bonusCheckbox(e, checked)
                                        }
                                    />
                                    <label
                                        className="switch-label"
                                        onClick={() =>
                                            clickElement(bonusToggle)
                                        }
                                    ></label>
                                    <Fire size={24} weight="fill" /> BURN
                                    <span
                                        style={{
                                            color: '#d0e027',
                                            fontFamily: 'Cosmos',
                                            fontSize: '1.2em',
                                            padding: '4px 8px',
                                            background:
                                                'linear-gradient(228.88deg,rgba(0,0,0,.2) 18.2%,hsla(0,0%,69%,.107292) 77.71%,rgba(0,0,0,.0885417) 99.78%,transparent 146.58%),#171717',
                                            borderRadius: '25px',
                                        }}
                                    >
                                        ALTE
                                    </span>
                                    <span className="badge rounded-pill">
                                        Bonus
                                    </span>
                                </label>

                                <label className="gift-label">
                                    <input
                                        type="checkbox"
                                        ref={friendsToggle}
                                        checked={giftFriend.active}
                                        className="switch"
                                        name="gift_friend"
                                        onChange={(e, checked) =>
                                            giftCheckbox(e, checked)
                                        }
                                    />
                                    <label
                                        className="switch-label"
                                        onClick={() =>
                                            clickElement(friendsToggle)
                                        }
                                    ></label>
                                    <Gift size={24} weight="fill" /> Gift
                                    tickets to friends
                                    <span className="badge rounded-pill">
                                        GIFTS
                                    </span>
                                </label>
                                {giftFriend.active && (
                                    <>
                                        <p className="m-0">
                                            Friends wallet address:
                                        </p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="yourfriendswalletaddress"
                                            name="gift_wallet"
                                            onChange={(e) => giftAddress(e)}
                                        />
                                    </>
                                )}
                                <div className="text-sm">{result}</div>
                                <TicketModal
                                    open={ticketModal}
                                    amount={amount}
                                    updateCombos={(new_code, index) =>
                                        updateCombos(new_code, index)
                                    }
                                    buyTickets={() => execute()}
                                    toggleModal={() =>
                                        setTicketModal(!ticketModal)
                                    }
                                    multiplier={(mul) => multiplier(mul)}
                                />
                                <AllowanceModal
                                    open={allowanceModal}
                                    prefill={
                                        amount * state.config.price_per_ticket_to_register  / state.config.bonus_burn_rate / 1000000
                                    }
                                    toggleModal={() =>
                                        setAllowanceModal(!allowanceModal)
                                    }
                                    showNotification={(message, type, dur) =>
                                        showNotification(message, type, dur)
                                    }
                                />
                                <button
                                    onClick={() => setTicketModal(!ticketModal)}
                                    className="btn btn-default w-100 mb-3 mt-3"
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        padding: '11px 5px',
                                        borderBottom: '4px solid #10003b',
                                    }}
                                >
                                    <PencilLine
                                        size={24}
                                        color={'#ff36ff'}
                                        style={{
                                            marginTop: '-1px',
                                            marginRight: '5px',
                                        }}
                                    />
                                    Personalize tickets
                                </button>
                                <button
                                    onClick={() => execute()}
                                    className="btn btn-special w-100"
                                    disabled={amount <= 0}
                                >
                                    {!buyLoader ? (
                                        <>Buy {amount} tickets</>
                                    ) : (
                                        <div
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            style={{
                                                position: 'relative',
                                                top: '-3px',
                                            }}
                                        >
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                        <SocialShare />
                    </div>
                </div>
            </div>

            <div
                className="how"
                style={{
                    background:
                        'radial-gradient(rgb(42 216 132 / 34%), transparent)',
                    marginTop: '50px',
                    padding: '95px 0',
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <MonitorPlay
                                size={48}
                                color={'#20ff93'}
                                className="mx-auto d-block mb-2"
                            />
                            <h2>How it works</h2>
                        </div>
                        <div className="col-md-4 my-2">
                            <div className="step">
                                <label>Step 1</label>
                                <h3>Participate In Lottery</h3>
                                <p>Buy max 200 tickets per transaction</p>
                            </div>
                        </div>
                        <div className="col-md-4 my-2">
                            <div className="step">
                                <label>Step 2</label>
                                <h3>Wait For Draw</h3>
                                <p>The contract draw a lottery every 3 days</p>
                            </div>
                        </div>
                        <div className="col-md-4 my-2">
                            <div className="step">
                                <label>Step 3</label>
                                <h3>Check Your Prizes</h3>
                                <p>
                                    Prizes automatically deposited into wallet
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="how"
                style={{
                    background: 'radial-gradient(#f23ff24f, transparent)',
                    padding: '55px 0',
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <ChartPie
                                size={48}
                                color={'#FF36FF'}
                                className="mx-auto d-block mb-2"
                            />
                            <h2>Current LoTerra Stats</h2>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="lota-stats mb-4 mb-md-0">
                                <p>LOTA price</p>
                                {lotaPrice.assets ? (
                                    <>
                                        <h5>
                                            {numeral(
                                                lotaPrice.assets[1].amount /
                                                    lotaPrice.assets[0].amount
                                            ).format('0.000')}
                                            <span>UST</span>
                                        </h5>
                                        {/* <p>{contractJackpotInfo}</p> */}
                                    </>
                                ) : (
                                    <PriceLoader />
                                )}
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="lota-stats">
                                <p>Circulating SUPPLY</p>
                                {circulatingSupply() ? (
                                    <h5>
                                        {numeral(circulatingSupply()).format(
                                            '0,0.00'
                                        )}
                                        <span>LOTA</span>
                                    </h5>
                                ) : (
                                    <PriceLoader />
                                )}
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="lota-stats">
                                <p>Market Cap</p>
                                {lotaPrice.assets ? (
                                    <h5>
                                        {numeral(marketCap()).format('0,0.00')}
                                        <span>UST</span>
                                    </h5>
                                ) : (
                                    <PriceLoader />
                                )}
                            </div>
                        </div>
                        <div className="col-md-12 my-3">
                            <div className="d-flex">
                                <button
                                    className="btn btn-plain align-self-center mx-auto"
                                    onClick={() => scrollToStats()}
                                >
                                    Check more stats <ArrowDown size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <JackpotResults />

            <div
                ref={loterraStats}
                className="container"
                style={{ marginTop: '8rem' }}
            >
                <div className="card lota-card">
                    <div className="card-header text-center">
                        <div className="card-header-icon">
                            <ChartPie size={90} color="#20FF93" />
                        </div>
                        <h3>LoTerra Stats</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="lota-stats mb-4 mb-md-0">
                                    {lotaPrice.assets && (
                                        <>
                                            <p>Current LOTA price</p>
                                            <h5>
                                                {numeral(
                                                    lotaPrice.assets[1].amount /
                                                        lotaPrice.assets[0]
                                                            .amount
                                                ).format('0.000')}
                                                <span>UST</span>
                                            </h5>
                                            {/* <p>{contractJackpotInfo}</p> */}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="lota-stats">
                                    <p>Current lottery balance</p>
                                    <h5>
                                        {numeral(contractBalance).format(
                                            '0,0.00'
                                        )}
                                        <span>UST</span>
                                    </h5>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="lota-stats">
                                    <p>Circulating SUPPLY</p>
                                    <h5>
                                        {numeral(circulatingSupply()).format(
                                            '0,0.00'
                                        )}
                                        <span>LOTA</span>
                                    </h5>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="lota-stats">
                                    <p>Total SUPPLY</p>
                                    <h5>
                                        {numeral(totalSupply()).format(
                                            '0,0.00'
                                        )}
                                        <span>LOTA</span>
                                    </h5>
                                </div>
                            </div>
                            <div className="col-md-12 mb-3">
                                <div className="lota-stats">
                                    {lotaPrice.assets && (
                                        <>
                                            <p>Market Cap</p>
                                            <h5>
                                                {numeral(marketCap()).format(
                                                    '0,0.00'
                                                )}
                                                <span>UST</span>
                                            </h5>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container" style={{ marginTop: '2rem' }}>
                <div className="card lota-card">
                    <div className="card-body">
                        <coingecko-coin-price-chart-widget
                            currency="usd"
                            coin-id="loterra"
                            locale="en"
                            height="300"
                        ></coingecko-coin-price-chart-widget>
                    </div>
                </div>
            </div>
            <Footer />

            <Notification
                notification={notification}
                close={() => hideNotification()}
            />
        </>
    )
}
