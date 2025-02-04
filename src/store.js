import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
} from 'react'
import {
    Fee,
    MsgExecuteContract,
    LCDClient,
    WasmAPI,
    BankAPI,
} from '@terra-money/terra.js'

const StoreContext = createContext()

const rankClasses = [
    { rank: 1, class: 'super-special-text' },
    { rank: 2, class: 'special-text' },
    { rank: 3, class: 'medium-text' },
    { rank: 4, class: '' },
    { rank: 5, class: '' },
    { rank: 6, class: '' },
]

const amountClasses = [
    { amount: 1, class: 'cyan' },
    { amount: 2, class: 'blue' },
    { amount: 3, class: 'cyan' },
    { amount: 4, class: 'fire' },
    { amount: 5, class: 'fire' },
    { amount: 6, class: 'fire' },
    { amount: 7, class: 'fire' },
    { amount: 8, class: 'fire' },
    { amount: 9, class: 'fire' },
    { amount: 10, class: 'fire' },
    { amount: 11, class: 'fire' },
]

const comboTextSix = [
    'Good work!',
    'Boom!',
    'Perfect!',
    'So close!',
    'Dynamite!',
    'On Fire!',
    'Impossible!',
]

const comboTextFive = [
    'Good work!',
    'Boom!',
    'Perfect!',
    'So close!',
    'Dynamite!',
    'On Fire!',
    'Impossible!',
]

const comboTextFour = [
    'Good work!',
    'Boom!',
    'Perfect!',
    'So close!',
    'Dynamite!',
    'On Fire!',
    'Impossible!',
]

const comboTextThree = [
    'What a combo?!',
    'Wipeout!',
    'Tasty!',
    'Blasted!',
    'Thunder!',
]

const comboTextTwo = [
    'Heros!',
    'Smashed!',
    'Rocket!',
    'Master!',
    'Out of control!',
    'Ticket Storm!',
    'Blasted!',
    'On Fire!',
    'Crypto mania!',
]

const comboTextOne = [
    'Big bang!',
    'Destroyer!',
    'Dynamite!',
    'Summit!',
    'Mavericks!',
    'Galactic!',
    'Wanted!',
]

const initialState = {
    lunaPoolAddress: 'terra1tndcaqxkpc5ce9qee5ggqf430mr2z3pefe5wj6',
    loterraContractAddress: 'terra1q2k29wwcz055q4ftx4eucsq6tg9wtulprjg75w',
    loterraTestnetContractAddress:
        'terra1a353y4fa24fv99jh5cqr6xpg68ffn04yxptccp',
    loterraContractAddressCw20: 'terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr',
    loterraTestnetContractAddressCw20:
        'terra1udwh63czgtnpqdfzzmvz0v8flskuqyd0892khy',
    loterraPoolAddress: 'terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta',
    loterraStakingAddress: 'terra1342fp86c3z3q0lksq92lncjxpkfl9hujwh6xfn',

    loterraNewPoolAddress: 'terra1l7ryw0rs4n88a4kglcvzex208qrhca25jng0ee',
    loterraNewStakingAddress: 'terra1qkvrf79gvew3f0vl02qjxar4lkqmyaxhkulhe4',

    alteredContractAddress: 'terra15tztd7v9cmv0rhyh37g843j8vfuzp8kw0k5lqv',
    loterraLPAddress: 'terra1t4xype7nzjxrzttuwuyh9sglwaaeszr8l78u6e',
    loterraStakingLPAddress: 'terra1pdslh858spzqrtx2gwr69pzm9m2wrv55aeh742',
    alteredStakingLPAddress: 'terra1augyqytpq9klph5egx99m5ufrcjx5f7xgrcqck',
    dogetherAddress: 'terra19h4xk8xxxew0ne6fuw0mvuf7ltmjmxjxssj5ts',
    dogetherStakingAddress: 'terra1z2vgthmdy5qlz4cnj9d9d3ajtqeq7uzc0acxrp',
    spaceWagerAddress:
        /*'terra1t8zj09gvp388lsksj7w0usk2f09ltz767ej685' */ 'terra1whe6adg8dlw4xsvlc0yax0r8ksaum5fuaaldg3',
    rapidoAddress: /*'terra1kfu8v4eplt7ng6lxary9j4jsdmuy8qcnl7ljt0'*/ 'terra1zl82rpjyrtgxagvc2zh3r2p0zxd7uef8h5ypkq',
    vkrContract: 'terra143kpwsuu82rtdy8jkyagmvn426q9amqsk7ftrw',
    vkrQualifierContract: 'terra1xme735w8y8hamfvlyeh924puazfclrec2ka8fh',
    vkrReferrer: { status: false, code: '' },

    allWinners: [],
    allRecentWinners: [],
    tokenInfo: {},
    allPlayers: [],
    allProposals: [],
    allNativeCoins: [],
    staking: {},
    newStaking: {},
    wallet: {},
    LotaBalance: {},
    LPBalance: {},
    config: {},
    currentLotteryId: 0,
    historicalTicketLotteryId: 0,
    historicalJackpotLotteryId: 0,
    historicalJackpot: 0,
    lastDrawnJackpot: 0,
    holderPercentageFee: 0,
    allCombinations: [],
    allHolder: {},
    allNewHolder: {},
    allHolderLP: {},
    winningCombination: 0,
    holderClaims: [],
    newHolderClaims: [],
    youWon: false,
    holderClaimsLP: [],
    holderAccruedRewards: 0,
    newHolderAccruedRewards: 0,
    LPHolderAccruedRewards: 0,
    combination: '',
    modal: false,
    ustBalance: 0,
    daoFunds: 0,
    lcd_client: new LCDClient({
        URL: 'https://lcd.terra.dev/',
        chainID: 'columbus-5',
        feeDenoms: ['uusd'],
        gasPrices: { uusd: 0.15 },
        gasAdjustment: 1.4,
    }),
    lcd_client_testnet: new LCDClient({
        URL: 'https://bombay-lcd.terra.dev/',
        chainID: 'bombay-12',
        feeDenoms: ['uusd'],
        gasPrices: { uusd: 0.15 },
        gasAdjustment: 1.4,
    }),
    blockHeight: 0,
    stateLPStaking: {},
    poolInfo: { assets: [] },
    stakingLoterraFunds: 0,
    stakingAlteredFunds: 0,
    comboTextSix: comboTextSix,
    comboTextFive: comboTextFive,
    comboTextFour: comboTextFour,
    comboTextThree: comboTextThree,
    comboTextTwo: comboTextTwo,
    comboTextOne: comboTextOne,
    rankClasses: rankClasses,
    amountClasses: amountClasses,
    jackpotAltered: 0,
    historicalJackpotAlte: 0,
    balanceStakeOnDogether: 0,
    holderClaimsDogether: [],
    totalBalancePoolDogether: 0,
    dogetherState: {},
    spaceWagerCurrentTimeRound: 0,
    spaceWagerLastPrice: 0,
    spaceWagerResolving: false,
    latestPrediction: { up: '0', down: '0' },
    previousPrediction: { up: '0', down: '0' },
    isUserMakingPrediction: false,
    spaceWagerCurrentRound: 0,
    rapidoCurrentRound: 0,
    rapidoCurrentTimeRound: 0,
    loaderResolveLottoNumber: false,
    isBuyingRapidoTicket: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'setIsBuyingRapidoTicket':
            return {
                ...state,
                isBuyingRapidoTicket: action.message,
            }
        case 'setLoaderResolveLottoNumber':
            return {
                ...state,
                loaderResolveLottoNumber: action.message,
            }
        case 'setRapidoCurrentTimeRound':
            return {
                ...state,
                rapidoCurrentTimeRound: action.message,
            }
        case 'setRapidoCurrentRound':
            return {
                ...state,
                rapidoCurrentRound: action.message,
            }
        case 'setSpaceWagerCurrentRound':
            return {
                ...state,
                spaceWagerCurrentRound: action.message,
            }
        case 'setIsUserMakingPrediction':
            return {
                ...state,
                isUserMakingPrediction: action.message,
            }
        case 'setPreviousPrediction':
            return {
                ...state,
                previousPrediction: action.message,
            }
        case 'setLatestPrediction':
            return {
                ...state,
                latestPrediction: action.message,
            }
        case 'setSpaceWagerResolving':
            return {
                ...state,
                spaceWagerResolving: action.message,
            }
        case 'setSpaceWagerLastPrice':
            return {
                ...state,
                spaceWagerLastPrice: action.message,
            }
        case 'setSpaceWagerCurrentTimeRound':
            return {
                ...state,
                spaceWagerCurrentTimeRound: action.message,
            }
        case 'setDogetherState':
            return {
                ...state,
                dogetherState: action.message,
            }
        case 'setTotalBalancePoolDogether':
            return {
                ...state,
                totalBalancePoolDogether: action.message,
            }
        case 'setVkrReferrer':
            return {
                ...state,
                vkrReferrer: action.message,
            }
        case 'setHolderClaimsDogether':
            return {
                ...state,
                holderClaimsDogether: action.message,
            }
        case 'setBalanceStakeOnDogether':
            return {
                ...state,
                balanceStakeOnDogether: action.message,
            }
        case 'setHistoricalJackpotAlte':
            return {
                ...state,
                historicalJackpotAlte: action.message,
            }
        case 'setAlteredJackpot':
            return {
                ...state,
                jackpotAltered: action.message,
            }
        case 'setStakingLoterraFunds':
            return {
                ...state,
                stakingLoterraFunds: action.message,
            }
        case 'setStakingAlteredFunds':
            return {
                ...state,
                stakingAlteredFunds: action.message,
            }
        case 'setYouWon':
            return {
                ...state,
                youWon: action.message,
            }
        case 'setLastDrawnJackpot':
            return {
                ...state,
                lastDrawnJackpot: action.message,
            }
        case 'setPoolInfo':
            return {
                ...state,
                poolInfo: action.message,
            }
        case 'setWinningCombination':
            return {
                ...state,
                winningCombination: action.message,
            }
        case 'setStateLPStaking':
            return {
                ...state,
                stateLPStaking: action.message,
            }
        case 'setBlockHeight':
            return {
                ...state,
                blockHeight: action.message,
            }
        case 'setModal':
            return {
                ...state,
                modal: action.message,
            }
        case 'setCurrentLotteryId':
            return {
                ...state,
                currentLotteryId: action.message,
            }
        case 'setHistoricalTicketLotteryId':
            return {
                ...state,
                historicalTicketLotteryId: action.message,
            }
        case 'setHistoricalJackpotLotteryId':
            return {
                ...state,
                historicalJackpotLotteryId: action.message,
            }
        case 'setHistoricalJackpot':
            return {
                ...state,
                historicalJackpot: action.message,
            }
        case 'setHolderPercentageFee':
            return {
                ...state,
                holderPercentageFee: action.message,
            }
        case 'setDaoFunds':
            return {
                ...state,
                daoFunds: action.message,
            }
        case 'setStaking':
            return {
                ...state,
                staking: action.message,
            }
        case 'setNewStaking':
            return {
                ...state,
                newStaking: action.message,
            }
        case 'setTokenInfo':
            return {
                ...state,
                tokenInfo: action.message,
            }
        case 'setAllWinners':
            return {
                ...state,
                allWinners: action.message,
            }
        case 'setAllRecentWinners':
            return {
                ...state,
                allRecentWinners: action.message,
            }
        case 'setWallet':
            return {
                ...state,
                wallet: action.message,
            }
        case 'setHolderAccruedRewards':
            return {
                ...state,
                holderAccruedRewards: action.message,
            }
        case 'setNewHolderAccruedRewards':
            return {
                ...state,
                newHolderAccruedRewards: action.message,
            }
        case 'setLPHolderAccruedRewards':
            return {
                ...state,
                LPHolderAccruedRewards: action.message,
            }
        case 'setAllPlayers':
            return {
                ...state,
                allPlayers: action.message,
            }
        case 'setAllProposals':
            return {
                ...state,
                allProposals: action.message,
            }
        case 'setConfig':
            return {
                ...state,
                config: action.message,
            }
        case 'setAllCombinations':
            return {
                ...state,
                allCombinations: action.message,
            }
        case 'setAllHolder':
            return {
                ...state,
                allHolder: action.message,
            }
        case 'setAllNewHolder':
            return {
                ...state,
                allNewHolder: action.message,
            }
        case 'setAllHolderLP':
            return {
                ...state,
                allHolderLP: action.message,
            }
        case 'setHolderClaims':
            return {
                ...state,
                holderClaims: action.message,
            }
        case 'setNewHolderClaims':
            return {
                ...state,
                newHolderClaims: action.message,
            }
        case 'setHolderClaimsLP':
            return {
                ...state,
                holderClaimsLP: action.message,
            }
        case 'setAllNativeCoins':
            return {
                ...state,
                allNativeCoins: action.message,
            }
        case 'setLotaBalance':
            return {
                ...state,
                LotaBalance: action.message,
            }
        case 'setUstBalance':
            return {
                ...state,
                ustBalance: action.message,
            }
        case 'setCombination':
            return {
                ...state,
                combination: action.message,
            }
        case 'setLPBalance':
            return {
                ...state,
                LPBalance: action.message,
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStore = () => useContext(StoreContext)
