import React, { useState } from 'react'

import { TwitterLogo, TelegramLogo, Files, DiscordLogo } from 'phosphor-react'

export default function Footer() {
    return (
        <footer
            className="container-fluid mt-4"
            style={{ background: '#16073e' }}
        >
            <div className="social-share py-5">
                <p className="mb-2">
                    Stay in touch with <strong>LoTerra</strong>
                </p>
                <ul>
                    <li>
                        <a
                            target="_blank"
                            href="https://twitter.com/LoTerra_LOTA"
                        >
                            <TwitterLogo size={31} />
                        </a>
                    </li>
                    <li>
                        <a
                            target="_blank"
                            href="https://discord.gg/t3rvcfjD"
                        >
                            <DiscordLogo size={31} />
                        </a>
                    </li>
                </ul>
                <p className="mt-4 mb-2">
                    Learn more about <strong>LoTerra</strong>?
                </p>
                <a
                    href="https://docs.loterra.io"
                    target="_blank"
                    className="btn btn-plain"
                    style={{ fontSize: '16px', color: '#a69fbb' }}
                >
                    Documentation <Files size={21} />
                </a>
            </div>
        </footer>
    )
}
