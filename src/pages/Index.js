import React, {
    useEffect,
    useState,
    useCallback,
    useRef,
} from 'react'
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
} from 'phosphor-react'
// import Jackpot from "../components/Jackpot";
import {
    Fee,
    MsgExecuteContract,
    WasmAPI,
   
} from '@terra-money/terra.js'
import Countdown from '../components/Countdown'
import TicketModal from '../components/TicketModal'

import { useStore } from '../store'

import Notification from '../components/Notification'
import Footer from '../components/Footer'
import AllowanceModal from '../components/AllowanceModal'
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
    const [jackpotAltered, setAlteredJackpot] = useState(0)
    const [jackpotAlteredUst, setAlteredJackpotUst] = useState(0)
    const [tickets, setTickets] = useState(0)
    const [players, setPlayers] = useState(0)
    const [recentPlayers, setRecentPlayers] = useState(0)
    const [payWith, setPayWith] = useState('ust')
    const [buyNow, setBuyNow] = useState(false)
    const [buyLoader, setBuyLoader] = useState(false)
    const [alteBonus, setAlteBonus] = useState(false)
    const [randomnizing,setRandomnizing] = useState(false);
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
            const jackpotAlocation = contractConfigInfo.jackpot_percentage_reward
            terra.bank.balance(loterra_contract_address).then(([coins]) => {            
                const ustBalance = coins.get('uusd').toData()
            
                const contractJackpotInfo =
                    (ustBalance.amount * jackpotAlocation) / 100
    
                setContractBalance(ustBalance.amount / 1000000)
                setJackpot(parseInt(contractJackpotInfo) / 1000000)
            });
           

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

            const poolAlte = await api.contractQuery('terra18adm0emn6j3pnc90ldechhun62y898xrdmfgfz', {
                pool: {},
            })

            let ust = parseInt(poolAlte.assets[1].amount)
            let alte = parseInt(poolAlte.assets[0].amount)

            let formatPrice = ust / alte
            let final = formatPrice.toFixed() * parseInt(alteredJackpot) / 1000000;
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
        
        if(state.config.lottery_counter > 48){
            try{
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
                            preview_play_count: cart.length                         
                        },
                    },
                )
                //If user is eligible go further
                if(vkrEligible && vkrEligible.continue_option == 'eligible') {
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
                    let combinations  = {};
                    combinations.combination = []
                    const combinations_query = await api.contractQuery(
                        state.loterraContractAddress,
                        {
                            combination: {
                                lottery_id: state.config.lottery_counter,
                                address: state.wallet.walletAddress,
                            },
                        },
                    ).then((a) => { 
                        combinations = a
                    }).catch(error => {
                        console.log('no combinations yet')
                    })
    
                    //Do the C - Q * 10 formula
                    const participationTimes = (combinations.combination.length + cart.length - (participationCount.participation_count * 10)) / 10;
                    console.log(Math.floor(participationTimes), combinations.combination.length, cart.length, participationCount.participation_count)
    
                    for (let index = 0; index < Math.floor(participationTimes); index++) {
                        if(state.vkrReferrer.status && state.vkrReferrer.code !== ''){
                            //Valkyrie referrer detected
                            const msg = new MsgExecuteContract(
                                connectedWallet.walletAddress,
                                state.vkrContract,
                                {
                                    participate: {
                                        actor: connectedWallet.walletAddress,
                                        referrer: {
                                            compressed: state.vkrReferrer.code
                                        }
                                    },
                                }
                            )
    
                            msgs.push(msg)
    
                        } else {
                            //Check normal valkyrie participator
                            const msg = new MsgExecuteContract(
                                connectedWallet.walletAddress,
                                state.vkrContract, 
                                {
                                    participate: {
                                        actor: connectedWallet.walletAddress
                                    },
                                },
                            )
                            msgs.push(msg)
                        }
                    }
                }
            }catch(e){
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
        },1500)
        
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
                <div className="container-fluid px-md-5">

                    <div className="card base-card border-0">
                        <div className="card-body p-md-5">
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <h1>Decentralized Lottery </h1>
                                    <p className="slogan">LoTerra is a decentralized gaming ecosystem managed by LOTA holders</p>
                                </div>
                                <div className="col-xl-6">
                                
                                <p className="sub-title">Next jackpot</p>
                                <h2>
                                    {numeral(jackpotAlteredUst + jackpot)
                                        .format('0,0.00')}<span>UST</span>
                                    
                                </h2> 
                                <p className="sub-title">Mixed jackpot</p>
                                <h2 className="alte" style={{color:"#fff"}}>
                                {numeral(jackpot)
                                        .format('0,0.00')}<span>UST</span>
                                    
                                </h2> 
                                <h2 className="alte">
                                +{numeral(jackpotAltered)
                                        .format('0,0.00')}<span>ALTE</span>
                                    
                                </h2> 
                                <div className="col-12 text-start mt-4 mb-4">
                                                <button
                                                    className={
                                                        'btn btn-special'
                                                    }
                                                    onClick={() =>
                                                        setBuyNow(!buyNow)
                                                    }
                                                >
                                                    Buy Tickets
                                                </button>
                                                <small
                                                    style={{
                                                        display: 'block',
                                                        marginTop: '10px',
                                                        fontSize: '12px',
                                                        opacity: '0.6',
                                                    }}
                                                >
                                                    You can buy tickets with{' '}
                                                    <strong>UST</strong> and{' '}
                                                    <strong>ALTE</strong>
                                                </small>
                                            </div>        
                                </div>
                                <div className="col-xl-6 d-flex">
                                            <div className="align-self-center w-100">
                                            <p className="sub-title">Next draw in</p>
                                <Countdown
                                                    expiryTimestamp={
                                                        expiryTimestamp
                                                    }
                                                />
                                                <div className="row">
                                                    <div className="col-6 p-1 text-center">
                                                    <div className="card base-card-light">
                                                        <div className="card-body">
                                                        <p className="sub-title">Players</p>
                                                    {players ? (
                                                                        <p className="amount">{players}</p>
                                                                    ) : (
                                                                        <PriceLoader />
                                                                    )}
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div className="col-6 p-1 text-center">
                                                    <div className="card base-card-light">
                                                        <div className="card-body">
                                                    <p className="sub-title">Tickets</p>
                                                    {tickets ? (
                                                                        <p className="amount">{tickets}</p>
                                                                    ) : (
                                                                        <PriceLoader />
                                                                    )}
                                                                    </div>
                                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* <div className="col-lg-12 text-center">
                          
                                <div className="jackpot">                              
                            
                               <h1>Decentralized Loterry</h1>
                               <p className="slogan">Next Jackpot</p>
                                { jackpot ? (
                                    <>                          
                                <h2>
                                    {numeral(jackpot)
                                        .format('0,0.00')}<span>UST</span>
                                    
                                </h2>                    
                                <h2 className="alte-jackpot">
                                    {numeral(jackpotAltered)
                                        .format('0,0.00')
                                        // .split('')
                                        // .map((obj) => {
                                        //     return (
                                        //         <div className="roller">
                                        //             {obj}
                                        //         </div>
                                        //     )
                                        }<span>ALTE</span>                                
                                </h2>
                            </>
                            )

                            :
                            (
                                <div className="d-flex w-100" style={{height:'200px'}}>
                                    <div class="spinner-border text-primary align-self-center mx-auto" 
                                    style={{
                                        width:'6rem',
                                        height:'6rem',
                                        borderWidth:'9px'
                                    }}
                                    role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                </div>
                            )

                            }
                             </div>
                            <div className="row">
                                <div className="col-md-8 mx-auto">
                                    <div className="countdown-holder">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="card stats-card">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-4 text-center svg-rotate">
                                                                <UserFocus
                                                                    size={42}
                                                                />
                                                            </div>
                                                            <div className="col-8 text-center d-flex text-md-start">
                                                                <h3 className="align-self-center">
                                                                    <span>
                                                                        PLAYERS
                                                                        PLAYING
                                                                    </span>
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
                                                            <div className="col-4 text-center svg-rotate">
                                                                <Ticket
                                                                    size={42}
                                                                />
                                                            </div>
                                                            <div className="col-8 text-center d-flex text-md-start">
                                                                <h3 className="align-self-center">
                                                                    <span>
                                                                        TICKETS
                                                                        SOLD
                                                                    </span>
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
                                            <div className="col-lg-8 mx-auto">
                                                <Countdown
                                                    expiryTimestamp={
                                                        expiryTimestamp
                                                    }
                                                />
                                            </div>
                                            <div className="col-12 text-center mt-4 mb-4">
                                                <button
                                                    className={
                                                        'btn btn-special'
                                                    }
                                                    onClick={() =>
                                                        setBuyNow(!buyNow)
                                                    }
                                                >
                                                    Buy Tickets
                                                </button>
                                                <small
                                                    style={{
                                                        display: 'block',
                                                        marginTop: '10px',
                                                        fontSize: '12px',
                                                        opacity: '0.6',
                                                    }}
                                                >
                                                    You can buy tickets with{' '}
                                                    <strong>UST</strong> and{' '}
                                                    <strong>ALTE</strong>
                                                </small>
                                            </div>                                          
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
{/* 
                        <div className="col-12 col-md-8 mx-auto">
                            <div className="row">
                                <div className="col-12 col-md-8 mx-auto">
                                    <div className="card stats-card-special latest-draw">
                                        <div className="card-header text-center">
                                            <h3 style={{ fontSize: '21px' }}>
                                                Latest draw
                                            </h3>
                                        </div>
                                        <div className="card-body text-center">
                                            <p className="players">
                                                <strong>
                                                    {recentPlayers}{' '}
                                                    <UsersThree
                                                        size={38}
                                                        style={{
                                                            marginTop: '-5px',
                                                        }}
                                                    />
                                                </strong>
                                            </p>
                                            <p className="sub">
                                                <strong>
                                                    {totalNrPrizes()} prizes
                                                </strong>{' '}
                                                and{' '}
                                                <strong>
                                                    {
                                                        state.allRecentWinners
                                                            .length
                                                    }{' '}
                                                    winners!
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    {/* </div> */}
                </div>

                {/*
             <div className="mt-4">contract-v2.0.1</div>
                <div className="text-sm">terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0</div> */}
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div
                            className={
                                'card amount-block' + (buyNow ? ' active' : '')
                            }
                        >
                            <div className="card-header">
                                
                                <button
                                    className="toggle"
                                    onClick={() => setBuyNow(!buyNow)}
                                >
                                    <X size={36} />
                                </button>
                            </div>
                            <div className="card-body d-flex">
                                <div className="align-self-center card-body-wrapper">
                                <h3>Book Your Tickets</h3>
                                <p
                                    style={{
                                        marginBottom: 0,
                                    }}
                                >
                                    Pay with:
                                </p>
                                <div className="btn-group w-100 mb-2">
                                    <button
                                        className={
                                            'btn btn-default' +
                                            (payWith == 'ust'
                                                ? ' active'
                                                : ' inactive')
                                        }
                                        onClick={() => setPayWith('ust')}
                                    >
                                        <img
                                            src={'/UST.svg'}
                                            className="me-2"
                                            width="20px"
                                        />
                                        UST
                                    </button>
                                    <button
                                        className={
                                            'btn btn-default' +
                                            (payWith == 'alte'
                                                ? ' active'
                                                : ' inactive')
                                        }
                                        onClick={() => setPayWith('alte')}
                                    >
                                        <img
                                            src={'/ALTE.png'}
                                            className="me-2"
                                            width="20px"
                                        />
                                        ALTE
                                    </button>
                                </div>
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
                                {!alteBonus || payWith == 'alte' ? (
                                    <p className="mb-2">
                                        Total:{' '}
                                        <strong>
                                            {numeral(
                                                (amount * price) / 1000000,
                                            ).format('0,0.00')}{' '}
                                            {payWith == 'ust' ? 'UST' : 'ALTE'}
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
                                                    (amount * price) / 1000000,
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
                                                        (amount * price) /
                                                            1000000 /
                                                            state.config
                                                                .bonus_burn_rate,
                                                ).format('0,0.00')}{' '}
                                                UST{' '}
                                                <span>
                                                    +{' '}
                                                    {numeral(
                                                        (amount * price) /
                                                            1000000 /
                                                            state.config
                                                                .bonus_burn_rate,
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

                                {payWith == 'ust' && (
                                    <>
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
                                            <Fire size={24} weight="fill" />{' '}
                                            BURN
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
                                    </>
                                )}
                                {payWith !== 'ust' && (
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
                                )}

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

                                <button
                                    onClick={() => setTicketModal(!ticketModal)}
                                    className="btn btn-default w-100 mb-3 mt-3"
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        padding: '11px 5px'                                
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
                                    onClick={(e) => execute(e)}
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
                        </div>
                        <div
                            className={'backdrop' + (buyNow ? ' show' : '')}
                            onClick={() => setBuyNow(!buyNow)}
                        ></div>
                        {/* <SocialShare /> */}
                    </div>
                </div>
            </div>

            <div
                className="how"
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
                        {/* <div className="col-12 text-center">
                            <h5 className="mt-4 mb-1">Learn more?</h5>
                            <a
                                className="btn btn-plain"
                                href="https://docs.loterra.io/products/lottery"
                                style={{
                                    color: 'rgb(166, 159, 187)',
                                    fontSize: '16px',
                                }}
                                target="_blank"
                            >
                                <Files
                                    size={21}
                                    style={{
                                        position: 'relative',
                                        top: '-2px',
                                    }}
                                />{' '}
                                LoTerra lottery documentation
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* <QuickStats lotaPrice={lotaPrice} marketCap={marketCap} circulatingSupply={circulatingSupply}/> */}

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
                                                            .amount,
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
                                            '0,0.00',
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
                                            '0,0.00',
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
                                            '0,0.00',
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
                                                    '0,0.00',
                                                )}
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
            </div>
            {/* <div className="container" style={{ marginTop: '2rem' }}>
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
            </div> */}
            <Footer />

            <Notification
                notification={notification}
                close={() => hideNotification()}
            />

            <TicketModal
                open={ticketModal}
                amount={amount}
                updateCombos={(new_code, index) =>
                    updateCombos(new_code, index)
                }
                buyTickets={() => execute()}
                toggleModal={() => setTicketModal(!ticketModal)}
                multiplier={(mul) => multiplier(mul)}
                randomnizing={randomnizing}
            />
            <AllowanceModal
                open={allowanceModal}
                prefill={
                    (amount * state.config.price_per_ticket_to_register) /
                    state.config.bonus_burn_rate /
                    1000000
                }
                toggleModal={() => setAllowanceModal(!allowanceModal)}
                showNotification={(message, type, dur) =>
                    showNotification(message, type, dur)
                }
            />
        </>
    )
}
