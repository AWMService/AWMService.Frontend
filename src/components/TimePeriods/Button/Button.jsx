import React from "react";
import "./Button.css";

export default function Button({ children, onClick, className = "", type = "button" }) {
    return (
        <button className={`btn ${className}`} onClick={onClick} type={type}>
            {children}
        </button>
    );
}
