import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./SharedSidebar.css";
import menuIcon from "../assets/icons/menu-icon.svg";
import xIcon from "../assets/icons/x-icon.svg";
export function SharedSidebar({ navigationItems, headerTitle }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const pathname = location.pathname;
    const isItemActive = (item) => {
        if (pathname === item.href || pathname.startsWith(item.href.split("?")[0])) {
            return true;
        }
        if (item.activePaths) {
            return item.activePaths.some(path => pathname.startsWith(path));
        }
        return false;
    };
    const handleNavClick = (e, item) => {
        if (item.onClick) {
            item.onClick(e);
        }
        setIsMobileMenuOpen(false);
    };
    const renderNavItems = () => (
        navigationItems.map((item) => {
            const isActive = isItemActive(item);
            return (
                <Link
                    key={item.href}
                    to={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`nav-item ${isActive ? "active" : ""}`}
                >
                    {item.icon && <img src={item.icon} alt="" className={`nav-icon ${isActive ? "active-icon" : ""}`} />}
                    <div className="nav-item-text">
                        <div className="nav-item-label">{t(item.labelKey)}</div>
                        {item.descriptionKey && (
                            <div className="nav-item-description">
                                {t(item.descriptionKey)}
                            </div>
                        )}
                    </div>
                </Link>
            );
        })
    );
    return (
        <>
            { }
            <aside className="shared-sidebar-desktop">
                <div className="shared-sidebar-desktop-content">
                    <nav className="shared-sidebar-nav">
                        {headerTitle && (
                            <div className="shared-sidebar-header">
                                <h2>{headerTitle}</h2>
                            </div>
                        )}
                        {renderNavItems()}
                    </nav>
                </div>
            </aside>

            { }
            <div className="shared-mobile-menu-button-wrapper">
                <button
                    className="shared-mobile-menu-button"
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

            { }
            {isMobileMenuOpen && (
                <div
                    className="shared-mobile-menu-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            { }
            <div className={`shared-sidebar-mobile ${isMobileMenuOpen ? "open" : ""}`}>
                <div className="shared-sidebar-mobile-content">
                    <nav className="shared-sidebar-nav">
                        {headerTitle && (
                            <div className="shared-sidebar-header">
                                <h2>{headerTitle}</h2>
                            </div>
                        )}
                        {renderNavItems()}
                    </nav>
                </div>
            </div>
        </>
    );
}