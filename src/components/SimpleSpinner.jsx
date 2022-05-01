import React from "react"

export default function SimpleSpinner() {
    return (
        <div className="w-100 py-4 text-center">
            <div className="spinner-border text-primary text-center" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}