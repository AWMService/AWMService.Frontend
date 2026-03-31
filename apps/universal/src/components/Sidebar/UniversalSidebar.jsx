import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRole, ROLES } from "@awm/shared";
import "./Sidebar.css";

import myTopicsIcon from "../../assets/icons/graduation-cap-icon.svg";
import studentsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import reportsIcon from "../../assets/icons/reports-sidebar-icon.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import xIcon from "../../assets/icons/x-icon.svg";
import scheduleIcon from "../../assets/icons/reports-sidebar-icon.svg";
import checkIcon from "../../assets/icons/reports-sidebar-icon.svg";

export function UniversalSidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();
    const { currentRole } = useRole();
    const pathname = location.pathname;

    // Навигация зависит от текущей роли
    const navigationItems = useMemo(() => {
        const items = [];

        // Руководитель
        if (currentRole === ROLES.SUPERVISOR) {
            items.push(
                {
                    href: "/directions",
                    labelKey: "nav.directions",
                    icon: reportsIcon,
                    descriptionKey: "supervisor.topics",
                },
                {
                    href: "/my-topics",
                    labelKey: "nav.myTopics",
                    icon: myTopicsIcon,
                    descriptionKey: "supervisor.topics",
                },
                {
                    href: "/mystudents",
                    labelKey: "nav.myStudents",
                    icon: studentsIcon,
                    descriptionKey: "supervisor.students",
                },
                {
                    href: "/schedule",
                    labelKey: "nav.schedule",
                    icon: scheduleIcon,
                    descriptionKey: "commission.schedule",
                    activePaths: ["/schedule", "/secretary"]
                },
                {
                    href: "/checks",
                    labelKey: "nav.checks",
                    icon: checkIcon,
                    descriptionKey: "supervisor.gradeWork"
                }
            );
        }

        // Рецензент
        if (currentRole === ROLES.REVIEWER) {
            items.push(
                {
                    href: "/reviews",
                    labelKey: "reviewer.assignedWorks",
                    icon: reportsIcon,
                    descriptionKey: "reviewer.pendingReview",
                }
            );
        }

        // Нормоконтроль
        if (currentRole === ROLES.NORMOCONTROL) {
            items.push(
                {
                    href: "/documents",
                    labelKey: "normocontrol.documentsCheck",
                    icon: reportsIcon,
                    descriptionKey: "normocontrol.pendingCheck",
                }
            );
        }

        // Председатель / Секретарь / Член комиссии
        if ([ROLES.CHAIRMAN, ROLES.SECRETARY, ROLES.COMMISSION_MEMBER].includes(currentRole)) {
            items.push(
                {
                    href: "/commission",
                    labelKey: "commission.commissions",
                    icon: studentsIcon,
                    descriptionKey: "commission.members",
                },
                {
                    href: "/schedule",
                    labelKey: "commission.schedule",
                    icon: scheduleIcon,
                    descriptionKey: "commission.date",
                    activePaths: ["/schedule"]
                }
            );

            // Секретарь имеет дополнительные возможности
            if (currentRole === ROLES.SECRETARY) {
                items.push({
                    href: "/secretary",
                    labelKey: "commission.protocol",
                    icon: reportsIcon,
                    descriptionKey: "commission.generateProtocol",
                });
            }
        }

        return items;
    }, [currentRole]);

    // Проверка активности пункта меню
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
                        <div className="nav-item-label">{t(item.labelKey)}</div>
                        <div className="nav-item-description">
                            {t(item.descriptionKey)}
                        </div>
                    </div>
                </Link>
            );
        })
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="sidebar-desktop">
                <div className="sidebar-desktop-content">
                    <nav className="sidebar-nav">
                        <div className="sidebar-header">
                            <h2>{t('nav.dashboard')}</h2>
                        </div>
                        {renderNavItems()}
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
                            <h2>{t('nav.dashboard')}</h2>
                        </div>
                        {renderNavItems()}
                    </nav>
                </div>
            </div>
        </>
    );
}
