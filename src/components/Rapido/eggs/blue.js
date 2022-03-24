import * as React from "react"

const BlueEgg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 54 76"
    style={{
      enableBackground: "new 0 0 54 76",
    }}
    xmlSpace="preserve"
    {...props}
  >
    <linearGradient
      id="a"
      gradientUnits="userSpaceOnUse"
      x1={45.313}
      y1={8.025}
      x2={9.881}
      y2={69.395}
    >
      <stop
        offset={0}
        style={{
          stopColor: "#048abf",
        }}
      />
      <stop
        offset={0.176}
        style={{
          stopColor: "#0483bd",
        }}
      />
      <stop
        offset={0.436}
        style={{
          stopColor: "#056fb8",
        }}
      />
      <stop
        offset={0.744}
        style={{
          stopColor: "#074fb0",
        }}
      />
      <stop
        offset={1}
        style={{
          stopColor: "#082fa8",
        }}
      />
    </linearGradient>
    <path
      d="M54 40.9C54 60.3 41.9 76 27 76S0 60.3 0 40.9 12.1 0 27 0s27 21.5 27 40.9z"
      style={{
        fill: "url(#a)",
      }}
    />
  </svg>
)

export default BlueEgg
