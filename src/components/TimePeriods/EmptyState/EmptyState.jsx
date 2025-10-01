import React from "react";
import "./EmptyState.css";

export default function EmptyState({ title, description, children }) {
    return (
        <div className="empty-state">
            <h2>{title}</h2>
            <p>{description}</p>
            {children}
        </div>
    );
}
