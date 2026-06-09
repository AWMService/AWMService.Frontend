import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Sidebar.css";

import myTopicsIcon from "../../assets/icons/graduation-cap-icon.svg";
import studentsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import reportsIcon from "../../assets/icons/reports-sidebar-icon.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import xIcon from "../../assets/icons/x-icon.svg";
import scheduleIcon from "../../assets/icons/reports-sidebar-icon.svg";
import checkIcon from "../../assets/icons/reports-sidebar-icon.svg";

export function SidebarSupervisor() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();
    const pathname = location.pathname;

    const navigationItems = [
        {
            href: "/supervisors/directions",
            label: t('nav.creatingDirections'),
            icon: reportsIcon,
            description: t('nav.creatingDirections'),
        },
        {
            href: "/supervisors/my-topics",
            label: t('nav.myTopics'),
            icon: myTopicsIcon,
            description: t('nav.managingTopics'),
        },
        {
            href: "/supervisors/mystudents",
            label: t('nav.myStudents'),
            icon: studentsIcon,
            description: t('supervisor.supervisedStudents'),
        },
        {
            href: "/supervisors/schedule",
            label: t('nav.scheduleJournal'),
            icon: scheduleIcon,
            description: t('nav.scheduleJournal'),
            activePaths: [
                "/supervisors/schedule",
                "/supervisors/secretary"
            ]
        },
        {
            href: "/supervisors/checks",
            label: t('nav.checkWorks'),
            icon: checkIcon,
            description: t('nav.checkWorks')
        }
    ];

    
    const isItemActive = (item) => {
        if (pathname === item.href) return true;

        if (item.activePaths) {
            return item.activePaths.some(path => pathname.startsWith(path));
        }

        return false;
    };

    const renderNavItems = () => (
        navigationItems.map((item) => {
            const isActive = isItemActive(item);

            return (
                <Link
                    key={item.href}
                    to={item.href}
                    className={`nav-item ${isActive ? "active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <img src={item.icon} alt="" className="nav-icon" />
                    <div className="nav-item-text">
                        <div className="nav-item-label">{item.label}</div>
                        <div className="nav-item-description">
                            {item.description}
                        </div>
                    </div>
                </Link>
            );
        })
    );

    return (
        <>
            {}
            <aside className="sidebar-desktop">
                <div className="sidebar-desktop-content">
                    <nav className="sidebar-nav">
                        <div className="sidebar-header">
                            <h2>{t('nav.supervisorMenu')}</h2>
                        </div>
                        {renderNavItems()}
                    </nav>
                </div>
            </aside>

            {}
            <div className="mobile-menu-button-wrapper">
                <button
                    className="mobile-menu-button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <img
                        src={isMobileMenuOpen ? xIcon : menuIcon}
                        alt="menu"
                        className="menu-icon"
                    />
                </button>
            </div>

            {}
            {isMobileMenuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {}
            <div className={`sidebar-mobile ${isMobileMenuOpen ? "open" : ""}`}>
                <div className="sidebar-mobile-content">
                    <nav className="sidebar-nav">
                        <div className="sidebar-header">
                            <h2>{t('nav.supervisorMenu')}</h2>
                        </div>
                        {renderNavItems()}
                    </nav>
                </div>
            </div>
        </>
    );
}
