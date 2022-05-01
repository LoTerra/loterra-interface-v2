import React from "react";

export default function ListItem(props) {

    const {obj} = props;

    return (
        <div className="col-md-3 mb-4">
            <div className="card lota-card h-100">
                <div className="card-body d-flex text-center">
                    { obj.hasOwnProperty('id') ?
                        <div className="align-self-center w-100">
                            <img src={obj.img} className="img-fluid mb-3" style={{height:100}}/>
                            <p className="mb-2">{obj.title}</p>
                            <button className="btn btn-default btn-sm">Visit Lottery</button>
                        </div>
                        :
                        <div className="align-self-center w-100">
                            <p className="mb-0 text-muted">Coming soon</p>                        
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}