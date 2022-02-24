import React, {useState, useEffect, useMemo} from 'react'
import {useStore} from "../../store";
import {MsgExecuteContract, WasmAPI} from "@terra-money/terra.js";
import {useConnectedWallet, useWallet} from "@terra-money/wallet-provider";
import numeral from "numeral";
import {Check, X, Swap, Money, TrendUp, TrendDown} from 'phosphor-react';

export default function SpaceWagerCardHeader(props) {

    const { state, dispatch } = useStore()
    const {} = props;
    const [games,setGames] = useState([]);
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
    const [isActivePagination, setIsActivePagination] = useState(false)
    const [paginationLastElementRound, setPaginationLastElementRound] = useState(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [loaderPendingToResolve, setLoaderPendingToResolve] = useState({ resolving: false, id: null})

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
                    setPaginationLastElementRound(res[res.length - 1][0])
                    setIsActivePagination(true)
                }else {
                    setIsActivePagination(false)
                }

                if (res.length > 0){
                    const new_array = games;
                    res.forEach(elem => {
                        new_array.push(elem)
                    });
                    setGames(games)

                }

                setIsLoadingMore(false)
            }catch (e) {
                console.log(e)
            }
        }
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
                let data = res;
                games.map((game) => {
                    if (game[0] != res[0][0]) {
                        data.push(game)
                    }
                })

                data.sort((a,b) => b[0] - a[0]);
                setGames(data)
            }catch (e) {
                console.log(e)
            }
            setLoaderPendingToResolve({resolving: false, id: null})
        }
    }
    async function collectPrize(round){
        setLoaderPendingToResolve({resolving: true, id: round})

        let msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.spaceWagerAddress,
            {
                resolve_game: {
                    address: player_address,
                    round: [round]
                }
            }
        )

        state.wallet
            .post({
                msgs: [msg],
            })
            .then((e) => {
                if (e.success) {

                    alert('success!')
                } else {
                    console.log(e)
                }
                setTimeout(() => {
                    gameUserRefreshElement(round)
                }, 20000)

            })
            .catch((e) => {
                console.log(e)

            })

    }

    function gameData(){

        let render = games.map((game, key) =>
            <tr key={key}>
                <td>#{ game[0] }</td>
                <td>{ game[1].up != "0" ? numeral(game[1].up / 1000000).format("0,0.00") + 'UST':  '-'}</td>
                <td>{ game[1].down != "0" ? numeral(game[1].down / 1000000).format("0,0.00") + 'UST': '-'}</td>
                <td>{ game[1].prize != "0" ?  numeral(game[1].prize / 1000000).format("0,0.00") + 'UST': '-'}</td>
                <td>{ game[1].resolved ? <Check size={23} /> : <X size={23} /> }</td>
                {/* display a collect button if resolved is false  <Money size={23} />*/}
                <td>
                    {
                        !game[1].resolved ?
                            <button className="btn btn-outline-primary w-100 btn-sm" hidden={game[1].resolved} disabled={loaderPendingToResolve.id == game[0]} onClick={() => collectPrize(game[0])}>Resolve</button>
                            :
                            parseInt(game[1].up) + parseInt(game[1].down) == parseInt(game[1].prize) ?
                                <><Swap size={23} /> Refund</> :
                                parseInt(game[1].up) + parseInt(game[1].down) < parseInt(game[1].prize) ?
                                    <><TrendUp size={23} /> +{numeral((parseInt(game[1].prize) - (parseInt(game[1].up) + parseInt(game[1].down))) / 1000000).format("0,0.00")}UST</>
                                    : <><TrendDown size={23} /> {numeral((parseInt(game[1].prize) - (parseInt(game[1].up) + parseInt(game[1].down))) / 1000000).format("0,0.00")}UST</>

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

    useMemo(() => {
        setGames([])
        gameUser()
    },[state.wallet.walletAddress])


    useEffect(() => {

    }, [])

    return (
        <div className="container-fluid mt-4">
            <div className="w-100 py-4 table-responsive">
                <h3 className="fw-bold">Player history</h3>
                <table className="table text-white">
                    <thead>
                    <tr>
                        <th>Round</th>
                        <th>Wager UP</th>
                        <th>Wager DOWN</th>
                        <th>Total prize</th>
                        <th>Resolved</th>
                        <th className="text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {gameData()}
                    </tbody>
                </table>
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
