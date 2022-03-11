import React, { useState, useEffect, useMemo, useRef } from 'react'
import { X, Ticket, Info, Shuffle } from 'phosphor-react'
import { useStore } from '../store'

// import toast, { Toaster } from 'react-hot-toast';

export default function TicketModal(props) {
    const [combo, setCombo] = useState([])

    // const [scrollPosition, setScrollPosition] = useState(null)
    const {
        open,
        toggleModal,
        amount,
        updateCombos,
        buyTickets,
        multiplier,
        randomnizing,
    } = props
    const store = useStore()

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

    let combinationListDiv = useRef()

    function handleFocus(event) {
        event.target.select()
    }

    function handleBlur(event) {}

    function handleClick(event) {
        event.target.select()
    }

    function handleKeyDown(e, ck, k) {
        const keys = [8, 46, 32, 37, 38, 39, 40]
        if (keys.includes(e.keyCode)) {
            let input = document.querySelector('.char' + ck + k)
            const lastValue = input.value

            input.value = 0
            const event = new Event('input', {
                bubbles: true,
            })
            const tracker = input._valueTracker
            if (tracker) {
                tracker.setValue(lastValue)
            }
            input.dispatchEvent(event)
            input.select()
        }
    }

    useEffect(() => {
        // console.log(store.state.combination)
        let data = store.state.combination.split(' ')
        //console.log(data)
        setCombo(data)

        /*if (combo){
            setCombo(["123456", ...data])
        }
        if (combo.length == 1){
            setCombo(["123456", "123454"])
        } */
    }, [store.state.combination])

    return (
        <>
            <div className={'ticketmodal d-flex' + (open ? ' show' : '')}>
                <button className="toggle" onClick={() => toggleModal()}>
                    <X size={36} />
                </button>
                <div className="align-self-center card-body-wrapper">
                    <div className="ticketmodal_heading text-center pb-0">
                        <h2>Personalize Tickets</h2>
                        <p className="mb-0">
                            Rather have your own codes, you can edit your codes
                            to your wishes and buy them right away
                        </p>
                    </div>
                    <div className="ticketmodal_content">
                        <span className="info">
                            <Info size={14} weight="fill" className="me-1" />
                            Available symbol options:
                            <br />
                            <strong>
                                {combination.map((obj, i) => {
                                    if (combination.length === i + 1) {
                                        return <>{obj}</>
                                    } else {
                                        return <>{obj},</>
                                    }
                                })}
                            </strong>
                        </span>
                        <button
                            onClick={() => multiplier(amount)}
                            className="btn btn-default w-100 my-2"
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                padding: '11px 5px',
                            }}
                        >
                            <Shuffle
                                size={24}
                                color={'#ff36ff'}
                                style={{ marginTop: '-1px' }}
                            />{' '}
                            Randomize Combinations
                        </button>
                        {!randomnizing && (
                            <ul
                                className="list-group"
                                id="ticket_list"
                                ref={combinationListDiv}
                                style={{ height: '180px' }}
                            >
                                {combo.map((obj, k) => {
                                    //console.log("combo combo bo ")

                                    let comboUpdate = combo
                                    return (
                                        <li
                                            className="list-group-item px-0"
                                            key={k}
                                        >
                                            <Ticket
                                                size={24}
                                                color={'#4EDC97'}
                                                style={{ marginLeft: '5px' }}
                                                onClick={() =>
                                                    selectTicket(obj, k)
                                                }
                                            />
                                            <span
                                                style={{
                                                    fontWeight: 'strong',
                                                    fontSize: '12px',
                                                    width: '18px',
                                                    textAlign: 'center',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {k + 1}
                                            </span>
                                            {obj &&
                                                Array.from(obj).map((c, ck) => {
                                                    const inputChange = (
                                                        e,
                                                        ck,
                                                        obj,
                                                        k,
                                                        c,
                                                    ) => {
                                                        let x = obj
                                                        e.preventDefault()

                                                        if (
                                                            !combination.includes(
                                                                e.target.value,
                                                            )
                                                        ) {
                                                            // toast.error('this value is invalid, you have the following options: [a,b,c,d,e,f,0,1,2,3,4,5,6,7,8,9]')
                                                            e.target.value = 0
                                                            e.target.select()
                                                        }
                                                        if (
                                                            e.target.value == ''
                                                        ) {
                                                            e.target.value = 0
                                                            e.target.select()
                                                        }
                                                        x.substring(
                                                            k,
                                                            e.target.value,
                                                        )
                                                        //console.log('x',x)
                                                        //console.log('obj',obj)
                                                        // console.log('key',k)
                                                        //Check for the values we want
                                                        // console.log('handle change called',ck,e.target.value,obj)
                                                        //Trial replacing current string with new
                                                        const new_code = []
                                                        Array.from(obj).map(
                                                            (item, key) => {
                                                                if (key == ck) {
                                                                    item =
                                                                        e.target
                                                                            .value
                                                                }
                                                                new_code.push(
                                                                    item,
                                                                )
                                                            },
                                                        )
                                                        //console.log('new code should become',new_code.join(""),'string index in combos should be:',k)
                                                        if (
                                                            new_code.join('')
                                                                .length == 6
                                                        ) {
                                                            comboUpdate[k] =
                                                                new_code.join(
                                                                    '',
                                                                )
                                                            //console.log('check combo update', comboUpdate[k])
                                                            // setCombo([])
                                                            store.dispatch({
                                                                type: 'setCombination',
                                                                message:
                                                                    comboUpdate.join(
                                                                        ' ',
                                                                    ),
                                                            })
                                                        }
                                                        e.target.select()

                                                        //updateCombos(new_code.join(""),k)
                                                    }
                                                    return (
                                                        <input
                                                            value={c}
                                                            autoCorrect="off"
                                                            autoCapitalize="none"
                                                            key={ck + k}
                                                            className={
                                                                'form-control text-center char' +
                                                                ck +
                                                                k
                                                            }
                                                            style={{
                                                                borderRadius:
                                                                    '0',
                                                            }}
                                                            onClick={
                                                                handleClick
                                                            }
                                                            onKeyDown={(e) =>
                                                                handleKeyDown(
                                                                    e,
                                                                    ck,
                                                                    k,
                                                                )
                                                            }
                                                            onFocus={
                                                                handleFocus
                                                            }
                                                            onBlur={handleBlur}
                                                            maxLength="1"
                                                            onChange={(e) =>
                                                                inputChange(
                                                                    e,
                                                                    ck,
                                                                    obj,
                                                                    k,
                                                                    c,
                                                                )
                                                            }
                                                        />
                                                    )
                                                })}
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                        {randomnizing && (
                            <div className="w-100 py-3 text-center">
                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                >
                                    {/* <span className="sr-only">Loading...</span> */}
                                </div>
                            </div>
                        )}
                        <button
                            className="btn btn-special w-100 mt-3"
                            onClick={() => {
                                buyTickets()
                                toggleModal()
                            }}
                        >
                            Buy {combo.length} Tickets
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={open ? 'backdrop show' : 'backdrop'}
                style={{ zIndex: 3 }}
                onClick={() => toggleModal()}
            ></div>
        </>
    )
}
