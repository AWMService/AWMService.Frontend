import React from "react";
import "./StatusMessage.css";

export default function StatusMessage({ message, onDismiss }) {
    return (
        <div className="status-message">
            {message}
            <span className="close" onClick={onDismiss}>
        &times;
      </span>
        </div>
    );
}
