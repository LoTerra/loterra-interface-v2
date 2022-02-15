import React, { useState } from 'react'
import numeral from 'numeral';


export default function SpaceWagerCard(props) {

    const {price, click} = props;

    return (
       <div className="col-md-4">
           <div className="card spacewager-card">
                <button className="btn btn-primary" onClick={() => click('up')}>Up</button>
                <p className="my-2 fw-bold fs-2">{numeral(price).format('0,0.000')}</p>
                <button className="btn btn-secondary" onClick={() => click('down')}>Down</button>
           </div>
       </div>
    )
}
