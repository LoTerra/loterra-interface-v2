import { Fire } from "phosphor-react";
import React from "react";
import ListItem from "../components/ScoobyDao/ListItem";

export default () => {

    const scooby_lotteries = [
        {id:1,title:'This is a test lottery',img:"/logo.png"},
        {},
        {},
        {},
        {},
        {},
    ]


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 my-5">
                        <div className="row">
                            <div className="col-md-6">
                                <h1 className="fw-bold fs-1 mb-0 text-center text-md-start">
                                    <Fire
                                        size={55}
                                        color={'rgb(139, 246, 194)'}
                                        style={{
                                            marginRight: 5,
                                        }}
                                    />
                                    Scooby DAO
                                </h1>
                                <p className="mb-4 fs-5 fw-normal text-muted text-center text-md-start">
                                    Create your own decentralized lottery
                                </p>
                            </div>
                            <div className="col-md-6 text-end d-flex">
                                {/* <Link to={'/poll/create'} className="btn btn-default align-self-center ms-auto">Create proposal</Link> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                    <div className="row mt-5">
                        <div className="col-12 text-center">
                            <div className="card lota-card">
                                <div className="card-body">
                                    <p className="fs-1 fw-bold mb-0">Coming soon</p>
                                    <p className="text-muted">We are currently working on Scooby DAO</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    {/* <div className="col-md-12">
                        <div className="row">
                            { scooby_lotteries.map((obj,k) => {
                                return (
                                    <ListItem key={k} obj={obj}/>
                                )
                            })
                            }
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}