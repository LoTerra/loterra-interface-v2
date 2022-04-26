//Helpers
import React from "react";
import numeral from "numeral";
import moment from "moment";

export function formatMoney(nr,divide = false){
    if(divide){
        return numeral(nr / 1000000).format('0,0.00');
    }else {
        return numeral(nr).format('0,0.00');
    }
}

export function formatTimestamp(timestamp){            
    let time = parseInt(timestamp / 1000000)
    let formatted = moment(time).local().format('DD-MM-YYYY HH:SS');
    return formatted
}