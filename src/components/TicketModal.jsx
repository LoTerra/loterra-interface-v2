import React, {useState, useEffect, useMemo} from "react";
import { X, Ticket,UserCircle } from 'phosphor-react'


export default function TicketModal(props){

    const { open, combo, toggleModal } = props;

    return (
        <>
        <div className={open ? 'ticketmodal show' : 'ticketmodal'}>
            <div className="ticketmodal_heading text-center">
                <h2>Edit ticket codes</h2>
            </div>
            <div className="ticketmodal_content">
                <ul className="list-group">
            {combo && combo.split(" ").map(obj => {
                          return (
                            <li className="list-group-item">{obj}</li>
                          )
                        })}    
                        </ul>
            </div>
        </div>
        <div className={open ? 'backdrop show' : 'backdrop'} onClick={() => toggleModal()}></div>
        </>
    )
}