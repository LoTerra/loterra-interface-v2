//Helpers
import { Fee } from "@terra-money/terra.js";
import numeral from "numeral";

export default function formatMoney(nr,divide = false){
    if(divide){
        return numeral(nr / 1000000).format('0,0.00');
    }else {
        return numeral(nr).format('0,0.00');
    }
}