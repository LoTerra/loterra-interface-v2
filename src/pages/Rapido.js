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