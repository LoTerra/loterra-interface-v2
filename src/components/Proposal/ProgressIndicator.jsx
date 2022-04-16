import React from 'react'

export default function ProgressIndicator(props) {

    const {amount} = props;

    return (
            <div
                className="progress-indicator position-absolute"
                style={{
                top:-29,
                left:amount+'%',
                width:103
                }}
            >
            <span 
                className="text-white"
                style={{
                position:'relative',
                top:5,
                left:-38,
                fontSize:12
                }}
            >
            {amount}% Quorum
            </span>
            <div 
                style={{
                width:'1px',
                height:'20px',
                background:'#fff',                        
                }}
            >
            </div>               
            </div>
    )
}
