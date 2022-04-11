import { Article } from 'phosphor-react';
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {  
    Link,
    useParams
  } from "react-router-dom";

export default (props) => {



    return(
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 my-5">
                    <h1 className="fw-bold fs-1 mb-0 text-center text-md-start">           
                                <Article 
                                size={55}
                                color={'rgb(139, 246, 194)'}
                                style={{
                                marginRight:5,
                                }}
                                />
                                Create proposal
                    </h1>
                    
                    </div>
                </div>
            </div>
        </>
    )
} 