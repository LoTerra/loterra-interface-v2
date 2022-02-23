import React, {useState, useEffect, useMemo} from 'react'
import {useStore} from "../../store";

export default function SpaceWagerCardHeader(props) {

    const { state, dispatch } = useStore()
    const {} = props;


    useMemo(() => {

    },[])


    useEffect(() => {

    }, [])

    return (
        <>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th colSpan="2">History</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Round</td>
                            <td>Data</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}
