import React from 'react';
import './DashboardLayout.css';

export function DashboardLayout({ title, subtitle, tabs, activeTab, onTabChange, children }) {
    return (
        <div className="dashboard-layout">
            <div className="dashboard-header">
                <div className="dashboard-header__titles">
                    <h1 className="dashboard-title">{title}</h1>
                    {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
                </div>
                <div className="dashboard-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="dashboard-content">
                {children}
            </div>
        </div>
    );
}
