import React, {useState, useEffect, useMemo} from 'react'
import {useStore} from "../../store";
import {MsgExecuteContract, WasmAPI} from "@terra-money/terra.js";
import {useConnectedWallet, useWallet} from "@terra-money/wallet-provider";

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

    const api = new WasmAPI(state.lcd_client.apiRequester)

    async function gameUser(start_after){
        let offset_limit = 5;

        let query = {
            games: {
                player: /*state.wallet.walletAddress*/ "terra1umd70qd4jv686wjrsnk92uxgewca3805dxd46p",
                limit: offset_limit
            }
        }
        // Pagination
        if (start_after){
            query.games.start_after = start_after
        }

        try {
            let res = await api.contractQuery(state.spaceWagerAddress, query);

            if (res.length == offset_limit){
                setPaginationLastElementRound(res[res.length - 1][0])
                setIsActivePagination(true)
            }else {
                setIsActivePagination(false)
            }

            const new_array = games;
            res.forEach(elem => {
                new_array.push(elem)
            });

            setGames(games)
        }catch (e) {
            console.log(e)
        }
    }

    async function collectPrize(round){
        let msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.spaceWagerAddress,
            {
                resolve_game: {round: round }
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
                <td>Round: { game[0] }</td>
                <td>Wager Up: { game[1].up }</td>
                <td>Wager Down: { game[1].down }</td>
                <td>Total Prize: { game[1].prize }</td>
                <td>Resolved: { game[1].resolved }</td>
                {/* display a collect button if resolved is false*/}
                <td>
                    <button className="btn btn-outline-primary w-100 btn-sm" hidden={game[1].resolved} onClick={() => collectPrize(game[0])}>Collect</button>
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
                <button className="btn btn-plain" disabled={!isActivePagination} onClick={() => gameUser(paginationLastElementRound)}>Load more</button>
            </div>
        </div>
    )
}
