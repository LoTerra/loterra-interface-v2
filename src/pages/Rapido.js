import { Head } from 'react-static'
import React, { useState, useEffect, useCallback, useRef } from 'react'

import RapidoCard from '../components/Rapido/RapidoCard';

import SwiperCore, { Navigation, Pagination ,Autoplay,EffectFade } from 'swiper';

SwiperCore.use([Navigation, Pagination,Autoplay,EffectFade ]);

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { ArrowLeft, ArrowRight } from 'phosphor-react';

export default () => {
    
    const {state,dispatch} = useStore();
    const terra = state.lcd_client
    const [rapidoState, setRapidoState] = useState({round:null})

    const [config,setConfig] = useState({
        denom: "uusd",
        frequency: 300,
        fee_collector: "0.05",
        fee_collector_address: "terra1umd70qd4jv686wjrsnk92uxgewca3805dxd46p",
        fee_collector_terrand: "0.001",
        fee_collector_terrand_address: "terra1a62jxn3hh54fa5slan4dkd7u6v4nzgz3pjhygm"
    });

    async function getRapidoState(){
        try {
            let rapido_state = await api.contractQuery(
                state.rapidoAddress,
                {
                    state: {
                       
                    }
                }
            );
            console.log('state',rapido_state)
            setRapidoState(rapido_state)
            dispatch({ type: 'setRapidoCurrentRound', message: rapido_state.round })
        } catch(e) {
            console.log(e)
        }        
    }

    async function getRapidoConfig(){
        try {
            let rapido_config = await api.contractQuery(
                state.rapidoAddress,
                {
                    config: {
                       
                    }
                }
            );
            console.log('config',rapido_config)
            setConfig(rapido_config)
        } catch(e) {
            console.log(e)
        }        
    }

    function formatTime(){

        let timeBetween = state.rapidoCurrentTimeRound * 1000 - Date.now()
        const seconds = Math.floor((timeBetween / 1000) % 60)
        const minutes = Math.floor((timeBetween / 1000 / 60) % 60)
        let format_minutes = minutes < 10 ? "0" + minutes : minutes;
        let format_seconds = seconds < 10 ? "0" + seconds : seconds;

        let format_message = "Closing..."
        if (state.rapidoCurrentTimeRound * 1000 > Date.now()){
            format_message = format_minutes + ":" + format_seconds

            return(
            <>
                <Clock size={32} style={{position:'relative', top:'-8px'}} className="d-none d-md-inline-block" weight={'bold'}/>
                <h2 className="fs-2 fw-bold d-inline-block mb-0">{format_message}</h2>
            </>
            )
        }

        return (
            <span className="fs-6">{format_message}</span>
        )
    }

    useEffect(() =>{
        getRapidoState()
        getRapidoConfig()
        
        setInterval(() => {
            formatTime()
        }, 1000)
        /*
            TODO: show the prediction loader here
         */
    },[])

    return (
        <>
            <div className="w-100 py-3 pt-md-5 text-center">
                <h1 className="mb-0 fw-bold" style={{textShadow:'1px 1px 10px #14053b'}}>Rapido</h1>
                <h2 className="my-2 fw-regular fs-6 mb-0">Lottery every 5 minutes</h2>
            </div>
            <div className="container">
            <div className="w-100 order-4 my-3">
                <div className="row">
                    <div className="col-6 text-end">
                        <button className="swiper-prev btn btn-plain pb-2"><ArrowLeft size={24} /></button>
                    </div>  
                    <div className="col-6 text-start">
                        <button className="swiper-next btn btn-plain pb-2"><ArrowRight size={24} /></button>
                    </div>
                </div>
            </div>
                    <Swiper
                    spaceBetween={50}
                    navigation={{
                        nextEl: '.swiper-next',
                        prevEl: '.swiper-prev',
                      }}
                    //   modules={[Navigation, Pagination, A11y]}                           
                    initialSlide={4}
                    slidesPerView={1}
                    breakpoints={{
                        // when window width is >= 640px
                        1: {
                            slidesPerView: 1,
                        },
                        // when window width is >= 768px
                        768: {
                            slidesPerView: 1,
                        },
                        1000: {
                            slidesPerView: 1,
                        },
                        1500: {
                            slidesPerView: 1,
                        },
                    }}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                                { [1,2,3,4].map((obj,k) => {
                                    return (
                                        <SwiperSlide key={k} >
                                            <RapidoCard/>
                                        </SwiperSlide>
                                    )
                                })

                                }
                </Swiper>
          
            </div>

            <div className="container py-5">
                <div className="row">
                    <div className="col-6 p-4">
                        <h2 className="fs-1 fw-bold">Play for free?</h2>
                        <h4 className="fs-4 fw-normal text-muted">Deposit UST in Dogether our no loss rapido</h4>
                        
                    </div>
                </div>
            </div>
        </>
    )
}