import { Trash } from 'phosphor-react'
import React, { useState } from 'react'
import { useStore } from '../../store'


export default function RapidoCardHeader() {


    const {state,dispatch} = useStore()


    return (
        <div className="card-header">
               
              
                <div className="row">
                    <div className="col-6 text-start">
                        <p className="mb-0 rounded"
                        style={{
                            background:'#01bd65',
                            padding:'5px',
                            color:'#fff',
                            marginTop:'-23px',
                            width:'100px',
                            textAlign:'center',
                            fontWeight:700
                        }}
                        >Active</p>
                        <p className="fs-4 fw-bold">Name</p>
                    </div>
                    <div className="col-6 text-end">                       
                        <p className="mb-0 text-muted">Next draw</p>
                        <p className="fs-5 fw-bold">00:00</p>
                    </div>
                </div>
            </div>
        )
}