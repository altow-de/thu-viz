import React from "react";

/**
 * ScrollTopIcon component that renders an SVG icon for scrolling to the top.
 * @returns {JSX.Element} - The rendered ScrollTopIcon component.
 */
const ScrollTopIcon = (): JSX.Element => {
  return (
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M5 19L11.2929 12.7071C11.6834 12.3166 12.3166 12.3166 12.7071 12.7071L19 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M5 11L11.2929 4.70711C11.6834 4.31658 12.3166 4.31658 12.7071 4.70711L19 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
};

export default ScrollTopIcon;
