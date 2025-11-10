import React, { useRef } from "react";

export default function RippleButton({ children, className = "", style = {}, ...props }) {
  const btnRef = useRef(null);

  const onClick = (e) => {
    const btn = btnRef.current;
    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
    circle.className = "ripple";
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
    props.onClick && props.onClick(e);
  };

  return (
    <button ref={btnRef} {...props} onClick={onClick} className={`btn-green ripple-btn ${className}`} style={style}>
      {children}
    </button>
  );
}