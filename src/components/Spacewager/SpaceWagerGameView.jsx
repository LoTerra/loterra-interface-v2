import React, {useState, useEffect, useMemo} from 'react'
import {useStore} from "../../store";
import {MsgExecuteContract, WasmAPI} from "@terra-money/terra.js";
import {useConnectedWallet, useWallet} from "@terra-money/wallet-provider";
import numeral from "numeral";
import {Check, X, Swap, Money, TrendUp, TrendDown, Hourglass} from 'phosphor-react';

export default function SpaceWagerCardHeader(props) {

    const { state, dispatch } = useStore()
    const {} = props;
    /*
       ----------GAMES SAMPLE--------
     [
       [0, {
           up: "1",
           down: "",
           prize: "",
           resolved: false
       }],
       [1, {
           up: "",
           down: "",
           prize: "",
           resolved: true
       }]
   ]*/
    const [games,setGames] = useState([]);
    const [isActivePagination, setIsActivePagination] = useState(false)
    const [paginationLastElementRound, setPaginationLastElementRound] = useState(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [loaderPendingToResolve, setLoaderPendingToResolve] = useState({ resolving: false, id: null})
    const [isSomeResolvable, setIsSomeResolvable] = useState(false)
    const [isResolvingAll, setIsResolvingAll] = useState(false)

    const api = new WasmAPI(state.lcd_client.apiRequester)


    let player_address = state.wallet.walletAddress
    let connectedWallet = ''
    if (typeof document !== 'undefined') {
        connectedWallet = useConnectedWallet()
    }

    async function gameUser(start_after){
        if (connectedWallet){

            let offset_limit = 6;

            let query = {
                games: {
                    player: player_address,
                    limit: offset_limit
                }
            }
            // Pagination
            if (start_after >= 0){
                query.games.start_after = start_after
            }


            try {
                setIsLoadingMore(true)
                let res = await api.contractQuery(state.spaceWagerAddress, query);

                if (res.length == offset_limit){
                    setPaginationLastElementRound(res[res.length - 1].game_id)
                    setIsActivePagination(true)
                }else {
                    setIsActivePagination(false)
                }
                let amount_pending_to_resolve = 0;
                res.map(game => {
                    if (!game.resolved){
                        amount_pending_to_resolve++
                    }
                })

                if (amount_pending_to_resolve){
                    setIsSomeResolvable(true)
                }else{
                    setIsSomeResolvable(false)
                }

                if (res.length > 0){
                    let newGames = [];
                    if (start_after >= 0){
                        newGames = [...games];
                        newGames.push(...res)
                    }else{
                        newGames.push(...res)
                    }
                    setGames(newGames)
                }

                setIsLoadingMore(false)
            }catch (e) {
                console.log(e)
            }
        }else {
            setGames([])
        }
        setLoaderPendingToResolve({resolving: false, id: null})
        setIsResolvingAll(false)
    }

    async function gameUserRefreshElement(start_after){

        if (connectedWallet){

            let offset_limit = 1;

            let query = {
                games: {
                    player: player_address,
                    limit: offset_limit,
                    start_after: start_after + 1
                }
            }

            try {
                let res = await api.contractQuery(state.spaceWagerAddress, query);

                if (res.length > 0){
                    const index = games.findIndex(object => {
                        return object.game_id == res[0].game_id;
                    });

                    const newGame = [...games];
                    newGame[index] = res[0];
                    setGames(newGame);
                }

            }catch (e) {
                console.log(e)
            }
            setLoaderPendingToResolve({resolving: false, id: null})
        }
    }
    async function collectPrize(round){

        let array = []
        let defaultResolving = false
        if (Array.isArray(round)) {
            defaultResolving = true
            setIsResolvingAll(true)
            array = round
        }else {
            setLoaderPendingToResolve({resolving: true, id: round})
            array.push(round)
        }

        let msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.spaceWagerAddress,
            {
                resolve_game: {
                    address: player_address,
                    round: array
                }
            }
        )

        state.wallet
            .post({
                msgs: [msg],
            })
            .then((e) => {
                if (e.success) {
                } else {
                    console.log(e)
                }
                if (defaultResolving){
                    setTimeout(() => {
                        gameUser()
                    }, 15000)
                }else {
                    setTimeout(() => {
                        gameUserRefreshElement(round)
                    }, 15000)
                }


            })
            .catch((e) => {
                setLoaderPendingToResolve({resolving: false, id: null})
                setIsResolvingAll(false)
                console.log(e)
            })

    }

    function resolve_multiples() {

        let array = [];
        games.map(game => {
            if (!game.resolved && (game.game_id + 2) < state.spaceWagerCurrentRound ) {
                if (!array.includes(game.game_id)) {
                    array.push(game.game_id)
                }

            }
        })

        if (array.length != 0) {
            collectPrize(array)
        }
    }

    function gameData(){

        let render = games.map((game) =>
            <tr key={game.game_id}>
                <td>#{ game.game_id }</td>
                <td>{ game.up != "0" ? numeral(game.up / 1000000).format("0,0.00") + 'UST':  '-'}</td>
                <td>{ game.down != "0" ? numeral(game.down / 1000000).format("0,0.00") + 'UST': '-'}</td>
                <td>{ game.prize != "0" ?  numeral(game.prize / 1000000).format("0,0.00") + 'UST': '-'}</td>
                <td>{ game.resolved ? <Check size={23} /> : <X size={23} /> }</td>
                {/* display a collect button if resolved is false  <Money size={23} />*/}
                <td className="text-end">
                    {
                        !game.resolved ?
                                game.game_id + 2 < state.spaceWagerCurrentRound ?
                                    <>
                                        <button className="btn btn-outline-primary w-100 btn-sm" hidden={game.resolved} disabled={loaderPendingToResolve.id == game.game_id || isResolvingAll} onClick={() => collectPrize(game.game_id)}>{ isResolvingAll || loaderPendingToResolve.id == game.game_id ? <>Resolving... <div className="spinner-grow spinner-grow-sm" role="status"><span className="sr-only"></span></div></> : 'Resolve'} </button>
                                    </>
                                    : <><Hourglass size={23} /> In progress <span>{game.game_id > state.spaceWagerCurrentRound - 3 ? <>open in {((game.game_id + 3) - state.spaceWagerCurrentRound)} rounds</>: ''}</span></>
                            :
                            parseInt(game.up) + parseInt(game.down) == parseInt(game.prize) ?
                                <><Swap size={23} /> Refund</> :
                                parseInt(game.up) + parseInt(game.down) < parseInt(game.prize) ?
                                    <><TrendUp size={23} /> +{numeral((parseInt(game.prize) - (parseInt(game.up) + parseInt(game.down))) / 1000000).format("0,0.00")}UST</>
                                    : <><TrendDown size={23} /> {numeral((parseInt(game.prize) - (parseInt(game.up) + parseInt(game.down))) / 1000000).format("0,0.00")}UST</>

                    }

                </td>
            </tr>
        )

        return (
            <>
                { render }
            </>
        )
    }

    useEffect(() => {
        setPaginationLastElementRound(null)
        setLoaderPendingToResolve({ resolving: false, id: null})
        setIsActivePagination(false)
        setIsLoadingMore(false)

        gameUser()

    },[state.wallet.walletAddress, state.isUserMakingPrediction])

    // useEffect(() => {
    //     gameUserRefreshElement(state.spaceWagerCurrentRound - 2)
    // },[state.spaceWagerCurrentRound])




    return (
        <div className="container-fluid">
            <div className="w-100 py-4">
              
                <div className="row">
                    <div className="col-8">
                    <h3 className="fw-bold">Player history</h3>
                    </div>
                    <div className="col-4">
                        <button className="btn btn-outline-primary w-100 btn-sm" disabled={!isSomeResolvable || isResolvingAll} onClick={() => resolve_multiples()}>{ isResolvingAll ? <>Resolving... <div className="spinner-grow spinner-grow-sm" role="status"><span className="sr-only"></span></div></> : 'Resolve all'} </button>
                    </div>
                </div>

                <div className="table-responsive">
                <table className="table text-white">
                    <thead>
                    <tr>
                        <th style={{minWidth:100}}>Round</th>
                        <th style={{minWidth:150}}>Wager UP</th>
                        <th style={{minWidth:150}}>Wager DOWN</th>
                        <th style={{minWidth:150}}>Total prize</th>
                        <th style={{minWidth:100}}>Resolved</th>
                        <th style={{minWidth:260}} className="text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {gameData()}
                    </tbody>
                </table>
                </div>
                <button className="btn btn-plain" disabled={!isActivePagination || isLoadingMore} onClick={() => gameUser(paginationLastElementRound)}>
                    {
                        isLoadingMore ?
                            <>
                                Loading more...
                                <div className="spinner-border text-light" role="status"><span className="sr-only"></span></div>
                            </>
                            :
                            <>Load more</>
                    }
                </button>
            </div>
        </div>
    )
}
