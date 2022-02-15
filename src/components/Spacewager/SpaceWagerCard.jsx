import React, { useEffect,useState } from 'react'
import numeral from 'numeral';

function enterUP() {

}

function enterDown() {

}

export default function SpaceWagerCard(props) {

    const [percentageStatus, setPercentageStatus] = useState('')
    const {price, percentage, click} = props;
    const [formattedPercentage, setFormattedPercentage] = useState(0)

    const getPercentage = async (price) => {
        console.log(formattedPercentage)
        console.log(percentage)
        try {
            if (percentage != 0) {
                let status = ''
                if (percentage > 0) {
                    status = 'up'
                    setFormattedPercentage('+' + numeral(percentage).format('0,0.00') + '%')
                    setPercentageStatus(status)
                } else if (percentage < 0) {
                    status = 'down'
                    setFormattedPercentage('-' + numeral(percentage).format('0,0.00') + '%')
                    setPercentageStatus(status)
                } else {
                    status = ''
                    setFormattedPercentage(numeral(percentage).format('0,0.00') + '%')
                    setPercentageStatus('')
                }
            }
            
            return 
        } catch(e){
            console.log(e)
        }
    }

    //Load on mount
    useEffect(() =>  {       
        const interval = setInterval(() => {
            getPercentage(formattedPercentage)    
          }, 1000);
          return () => clearInterval(interval); 
               
    },[formattedPercentage])

    return (
       <div className="col-md-4">
           <div className="card spacewager-card">
                <button className="btn btn-primary" onClick={() => click('up')}>Up</button>
                <p className="my-2 fw-regular fs-2">Last price</p>
                <p className="my-2 fw-bold fs-2">{numeral(price).format('0,0.000')}</p>
                <p className={percentageStatus}>{formattedPercentage}</p>
                <button className="btn btn-secondary" onClick={() => click('down')}>Down</button>
           </div>
       </div>
    )
}
