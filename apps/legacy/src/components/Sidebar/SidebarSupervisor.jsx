import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

import myTopicsIcon from "../../assets/icons/graduation-cap-icon.svg";
import studentsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import reportsIcon from "../../assets/icons/reports-sidebar-icon.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import xIcon from "../../assets/icons/x-icon.svg";
import scheduleIcon from "../../assets/icons/reports-sidebar-icon.svg";
import checkIcon from "../../assets/icons/reports-sidebar-icon.svg"; // можешь заменить на отдельную иконку

const navigationItems = [
    {
        href: "/supervisors/directions",
        label: "Создание направлений",
        icon: reportsIcon,
        description: "Создание и управление направлениями",
    },
    {
        href: "/supervisors/my-topics",
        label: "Мои темы",
        icon: myTopicsIcon,
        description: "Список закреплённых тем",
    },
    {
        href: "/supervisors/mystudents",
        label: "Мои студенты",
        icon: studentsIcon,
        description: "Список студентов под руководством",
    },
    {
        href: "/supervisors/schedule",
        label: "Расписание/Журнал",
        icon: scheduleIcon,
        description: "График защит и предзащит",
        activePaths: [
            "/supervisors/schedule",
            "/supervisors/secretary"
        ]
    },
    {
        href: "/supervisors/checks",
        label: "Проверка работ",
        icon: checkIcon,
        description: "Антиплагиат и проверка работ"
    }
];

export function SidebarSupervisor() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const pathname = location.pathname;

    // Проверка активности пункта меню
    const isItemActive = (item) => {
        if (pathname === item.href) return true;

        if (item.activePaths) {
            return item.activePaths.some(path => pathname.startsWith(path));
        }

        return false;
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="sidebar-desktop">
                <div className="sidebar-desktop-content">
                    <nav className="sidebar-nav">
                        <div className="sidebar-header">
                            <h2>Меню руководителя</h2>
                        </div>

                        {navigationItems.map((item) => {
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
                        })}
                    </nav>
                </div>
            </aside>

            {/* Mobile Menu Button */}
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

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`sidebar-mobile ${isMobileMenuOpen ? "open" : ""}`}>
                <div className="sidebar-mobile-content">
                    <nav className="sidebar-nav">
                        <div className="sidebar-header">
                            <h2>Меню руководителя</h2>
                        </div>

                        {navigationItems.map((item) => {
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
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}
