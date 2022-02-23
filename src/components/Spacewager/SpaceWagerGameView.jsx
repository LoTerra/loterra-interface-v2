import React, {useState, useEffect, useMemo} from 'react'
import {useStore} from "../../store";
import {MsgExecuteContract, WasmAPI} from "@terra-money/terra.js";
import {useConnectedWallet, useWallet} from "@terra-money/wallet-provider";
import numeral from "numeral";
import { Check, X } from 'phosphor-react';

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

    async function collectPrize(round){
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
                {/* display a collect button if resolved is false*/}
                <td>
                    <button className="btn btn-outline-primary w-100 btn-sm" hidden={game[1].resolved} onClick={() => collectPrize(game[0])}>Resolve</button>
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
        gameUser()
    },[])


    useEffect(() => {

    }, [])

    return (
        <div className="container-fluid mt-4">
            <div className="w-100 py-4">
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
