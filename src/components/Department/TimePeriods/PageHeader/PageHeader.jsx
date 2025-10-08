import React from "react";
import "./PageHeader.css";

export default function PageHeader({ title, description, children }) {
    return (
        <div className="page-header">
            <div>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <div className="header-buttons">{children}</div>
        </div>
    );
}
