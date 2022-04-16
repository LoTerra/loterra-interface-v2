import React, { useEffect, useState } from 'react'

export default function ProgressBar(props) {

    const {amount} = props;

    return (
        <div className="progress w-100">
            <div 
            className="progress-bar"
            role="progressbar"
            style={{width: amount+'%'}}
            aria-valuenow={amount}
            aria-valuemin="0"
            aria-valuemax="100"
            >                
            </div>
        </div>    
    )
}
