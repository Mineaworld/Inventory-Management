import React from "react";

export const KhmerFlag = ({ className = "w-5 h-5", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 1200 800" 
    className={className} 
    {...props}
  >
    <path fill="#032EA1" d="M0 0h1200v800H0z"/>
    <path fill="#E00025" d="M0 0h1200v400H0z"/>
    <g fill="#fff">
      <path d="M600 150h350v500H600z"/>
      <path d="M625 175h300v450H625z" fill="#032EA1"/>
      <path d="M672.5 268.5h205v262.5h-205z"/>
      <path d="M774.5 250h-65l-32.5-45-32.5 45h-65l32.5 44.5-32.5 44.5h65l32.5 45 32.5-45h65l-32.5-44.5 32.5-44.5z"/>
    </g>
    <g fill="#E00025">
      <path d="M711.5 364.5h60v130h-60z"/>
      <path d="M711.5 364.5h60v35h-60z" fill="#032EA1"/>
      <path d="M727 399.5h30v60h-30z"/>
      <path d="M727 429.5h30v30h-30z" fill="#032EA1"/>
      <path d="M727 459.5h30v35h-30z"/>
    </g>
  </svg>
); 