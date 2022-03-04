import React, { useEffect,useState } from 'react'
import numeral from 'numeral';
import { useStore } from '../../store';

export default function RafflesCard(props) {

    const {key, id, obj} = props;


    return (
        <>
            <div className="col-10 col-md-9 mx-auto">
                <div className="card spacewager-card h-100"
                    style={{
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    }}
                >  
                    <div className="card-body">
                        <div className="card-content">
                            <div className="row">            
                                <div className="col-12 text-center">
                                    <p className="my-1 mb-0 small text-muted">Description</p>
                                    <p className="my-1 mb-0 small text-muted">kdajFCLAD SKFHADOhcl ixadsnlicjnskn noisdan coiadslis lsciniow eiouwoi ewncosjk kfk adjlkc sakj oidwn kjjk o kjkd faksj vkj</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}