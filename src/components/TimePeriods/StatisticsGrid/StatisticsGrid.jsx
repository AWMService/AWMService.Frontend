import React from "react";
import "./StatisticsGrid.css";

export default function StatisticsGrid({ statistics }) {
    return (
        <div className="statistics-grid">
            {statistics.map((stat, idx) => (
                <div key={idx} className="stat-card">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}
