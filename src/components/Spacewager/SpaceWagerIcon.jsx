import React, { useState, useEffect } from 'react'
import {useStore} from "../../store";
import { Prohibit, PlayCircle, Info } from 'phosphor-react';

export default function SpaceWagerIcon(props) {


    return (
        <div className="spacewager-icon">        
        <svg version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style={{enableBackground:'new 0 0 512 512'}} xmlSpace="preserve"><g xmlns="http://www.w3.org/2000/svg">
        <path d="m256 271.936 42.247 76.354-42.247 70.949h-40.684c-6.464 0-12.197-4.13-14.239-10.259l-23.794-71.346z" fill="#9580ff" data-original="#9580ff" className=""/>
        <path d="m334.717 337.633-23.794 71.346c-2.041 6.13-7.775 10.259-14.239 10.259h-40.684v-147.302z" fill="#8066ff" data-original="#8066ff"/>
        <path d="m396.914 382.911v114.064c0 15.119 19.852 20.739 27.786 7.87l66.049-124.494c1.581-2.99 2.071-6.32 1.551-9.479l-66.553-31.036z" fill="#8066ff" data-original="#8066ff"/>
        <path d="m341.467 219.802-20.984 69.851 76.431 93.258 95.387-12.039c-.51-3.09-1.991-6.02-4.362-8.31z" fill="#9580ff" data-original="#9580ff" className=""/>
        <path d="m115.086 382.911v114.064c0 15.119-19.852 20.739-27.786 7.87l-66.05-124.494c-1.581-2.99-2.071-6.32-1.551-9.479l66.553-31.036z" fill="#9580ff" data-original="#9580ff" className=""/>
        <path d="m170.533 219.802 20.984 69.851-76.431 93.258-95.386-12.04c.51-3.09 1.991-6.02 4.362-8.31z" fill="#cc99ff" data-original="#cc99ff"/>
        <path d="m256 0 50.444 188.166-50.444 116.559-140.914 78.186 126.856-373.172c2.431-6.499 8.244-9.739 14.058-9.739z" fill="#e6ccff" data-original="#e6ccff"/>
        <path d="m256 0v304.725l140.914 78.186-126.856-373.172c-2.431-6.499-8.244-9.739-14.058-9.739z" fill="#cc99ff" data-original="#cc99ff"/></g>
        </svg>
        </div>
    )
}