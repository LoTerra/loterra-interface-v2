import React, { useState, useEffect } from 'react'
import {useStore} from "../../store";
import { Prohibit, PlayCircle, Info } from 'phosphor-react';

export default function SpaceWagerInfoMessage(props) {


    return (
        <div className="spacewager-notice">
            <p className="m-0"><Info size={16}/> {props.children}</p>        
        </div>
    )
}