import { ArrowLeft, Article } from 'phosphor-react';
import React, { useState, useEffect } from 'react'
import {  
    Link
  } from "react-router-dom";
import { useStore } from '../../store';
import moment from 'moment';

export default () => {

const {state,dispatch} = useStore()
const [ustBalance,setUstBalance] = useState(0)

const timelocalFormat = 'YYYY-MM-DDTHH:mm';

//Add one month
let maxEndDate = moment().add(1,'M')
maxEndDate = moment(maxEndDate).format(timelocalFormat);

//Add 1 day
let maxMinDate = moment().add(1,'D')
maxMinDate = moment(maxMinDate).format(timelocalFormat);

//Predefined user options for creating proposal
const predefined_options = [
    {
        id: 1,
        title:'test option',
        query:'{all sort of magics here}'
    },
    {
        id: 2,
        title:'test option 2',
        query:'{all sort of magics here}'
    }
]

//Create proposal
const createProposal = (e) => {
    e.preventDefault()

     //Get form data 
     const data = Object.fromEntries(new FormData(e.target).entries());
     console.log(data)

    //Double check validations
    if((parseInt(ustBalance) / 1000000) < 1000){
        alert('Not enough ust in wallet')
        return;
    }

    if(
    data.title == '' ||
    data.description == '' ||
    data.predefined_option == '' ||
    data.deposit == ''
    ){
        alert('Not all fields filled')
        return;
    }
   

    //Get selected predefined
    const predefined = predefined_options.find(a => a.id = data.predefined_option)
    console.log(predefined)

    //Execute creation proposal

}


useEffect(() => {
    setUstBalance(state.ustBalance)
},[state.ustBalance])

    return(
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 my-5">
                    <Link to="/dao" className="btn btn-default float-end mt-md-2">
                            <ArrowLeft size={14} style={{top:0}}/> Overview
                        </Link>
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
                    
                    <form className="card card-body lota-card mt-4 p-md-5" onSubmit={(e) => createProposal(e)}>
                        <div className="form-group mb-4">
                            <p className="mb-0 fs-6 fw-bold">Title</p>
                            <input type="text" name="title" className="form-control" placeholder={'Title'} required/>
                        </div>
                        <div className="form-group mb-4">
                            <p className="mb-0 fs-6 fw-bold">Description</p>
                            <textarea name="description" placeholder={'Description of your proposal'} className="form-control" required></textarea>
                        </div>
                        <div className="form-group mb-4">
                            <p className="mb-0 fs-6 fw-bold">Predefined options <small className="small fw-normal text-muted">(Optional)</small></p>
                            <select name="predefined_option" className="form-control">
                                <option value="">Select option</option>
                                {predefined_options.map((o,k) => {
                                    return (
                                        <option value={o.id}>{o.title}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="form-group mb-4">
                            <p className="mb-0 fs-6 fw-bold">Deposit</p>
                            { (parseInt(ustBalance) / 1000000) < 1000 ?
                                <small className="d-block text-muted">Not sufficient in wallet</small>
                                :
                                ''
                            }
                            <div className="input-group">
                            <input type="number" name="deposit" min="1000" max="1000" value={1000} className="form-control" required/>
                            <span className="input-group-text text-muted" id="basic-addon1">UST</span>
                            </div>
                        </div>
                        <div className="form-group mb-4">
                            <p className="mb-0 fs-6 fw-bold">End date <small className="small fw-normal text-muted">(Optional)</small></p>
                            
                            <input type="datetime-local" name="end_date" min={maxMinDate} max={maxEndDate} className="form-control" placeholder={'Title'}/>
                        </div>
                        <div className="form-group mt-4">
                            <button 
                            type="submit" 
                            //Tmp disabled when done testing enable
                            // disabled={(parseInt(ustBalance) / 1000000) < 1000 ? true : false}
                            className="btn btn-primary btn-lg text-white fw-bold w-100"
                            >Submit
                            </button>
                        </div>
                    </form>

                    </div>
                </div>
            </div>
        </>
    )
} 