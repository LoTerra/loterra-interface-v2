import React,{useState} from 'react'
import Footer from '../components/Footer'
import Main from '../components/Dogether/Main'
import {StdFee} from "@terra-money/terra.js";

export default () => {   

    return (
        <>
            <div
                className="bg-hero"
                style={{
                    backgroundImage:
                        'linear-gradient(0deg, #160150, #170f5300, #17095200),radial-gradient(#f23bf23b , #160150ad), url(/rays.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    position: 'relative',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    minHeight: '800px',
                }}
                
            >
              
                       <div className="container-fluid">
                           <div className="row">
                               <div className="col-12">
                               <img src="/dogether-5.png" className="img-fluid dogether-logo"/>
                               </div>
                           </div>
                       </div>
                    
                <div className="container h-100">
                
                    <div className="row">
                     
                        <div className="col-12 col-md-6 mx-auto">
                      
                            <div className="card lota-card staking dogether-card">  
           
                              
                                <div className="card-body">                               
                                    <Main/>                              
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
