import React, { useState } from 'react'
import Footer from '../components/Footer'
import Main from '../components/Dogether/Main'
import { Fee } from '@terra-money/terra.js'
import Notification from '../components/Notification'

export default () => {
    const [notification, setNotification] = useState({
        type: 'success',
        message: '',
        show: false,
    })

    function hideNotification() {
        setNotification({
            message: notification.message,
            type: notification.type,
            show: false,
        })
    }

    function showNotification(message, type, duration) {
        //console.log('fired notification')
        setNotification({
            message: message,
            type: type,
            show: true,
        })
        //console.log(notification)
        //Disable after $var seconds
        setTimeout(() => {
            setNotification({
                message: message,
                type: type,
                show: false,
            })
            // console.log('disabled',notification)
        }, duration)
    }

    return (
        <>
            <div
                className="bg-hero mt-3"
                style={{
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
                            <img
                                src="/dogether-logo.svg"
                                className="img-fluid dogether-logo"
                            />
                        </div>
                    </div>
                </div>

                <div className="container h-100">
                    <div className="row">
                        <Main
                            showNotification={(message, type, dur) =>
                                showNotification(message, type, dur)
                            }
                        />
                    </div>
                </div>
            </div>
            <Notification
                notification={notification}
                close={() => hideNotification()}
            />
            <Footer />
        </>
    )
}
