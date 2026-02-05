import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

import supervisorsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import periodsIcon from "../../assets/icons/periods-sidebar-icon.svg";
import settingsIcon from "../../assets/icons/settings-sidebar-icon.svg";
import graduationCapIcon from "../../assets/icons/graduation-cap-icon.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import xIcon from "../../assets/icons/x-icon.svg";

/* ===================== NAV ITEMS ===================== */

const navigationItems = [
  {
    href: "/department/supervisors",
    label: "Научные руководители",
    icon: supervisorsIcon,
    description: "Управление назначением научных руководителей",
  },
  {
    href: "/department/time-periods",
    label: "Временные периоды",
    icon: periodsIcon,
    description: "Управление периодами для задач кафедры",
  },
  {
    // 🔥 ОДИН ПУНКТ ДЛЯ НАПРАВЛЕНИЙ + ТЕМ
    href: "/department/directions-topics?tab=directions",
    label: "Направления и темы ДП/ДР",
    icon: graduationCapIcon,
    description: "Управление направлениями и темами дипломных проектов и исследований",
  },
  {
    href: "/department/settings",
    label: "Настройки",
    icon: settingsIcon,
    description: "Настройки системы и кафедры",
  },
];

/* ===================== COMPONENT ===================== */

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  const handleNavClick = (e, href) => {
    e.preventDefault();
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  // ✅ корректная проверка active (без ?tab)
  const isItemActive = (href) => {
    const basePath = href.split("?")[0];
    return pathname.startsWith(basePath);
  };

  return (
      <>
        {/* ===================== DESKTOP SIDEBAR ===================== */}
        <aside className="sidebar-desktop">
          <div className="sidebar-desktop-content">
            <nav className="sidebar-nav">
              <div className="sidebar-header">
                <h2>Панель управления</h2>
              </div>

              {navigationItems.map((item) => {
                const isActive = isItemActive(item.href);

                return (
                    <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`nav-item ${isActive ? "active" : ""}`}
                    >
                      <img
                          src={item.icon}
                          alt=""
                          className={`nav-icon ${isActive ? "active-icon" : ""}`}
                      />
                      <div className="nav-item-text">
                        <div className="nav-item-label">{item.label}</div>
                        <div className="nav-item-description">
                          {item.description}
                        </div>
                      </div>
                    </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ===================== MOBILE MENU BUTTON ===================== */}
        <div className="mobile-menu-button-wrapper">
          <button
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <img
                src={isMobileMenuOpen ? xIcon : menuIcon}
                alt="menu"
                className="menu-icon"
            />
          </button>
        </div>

        {/* ===================== MOBILE OVERLAY ===================== */}
        {isMobileMenuOpen && (
            <div
                className="mobile-menu-overlay"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        {/* ===================== MOBILE SIDEBAR ===================== */}
        <div className={`sidebar-mobile ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="sidebar-mobile-content">
            <nav className="sidebar-nav">
              <div className="sidebar-header">
                <h2>Панель управления</h2>
              </div>

              {navigationItems.map((item) => {
                const isActive = isItemActive(item.href);

                return (
                    <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`nav-item ${isActive ? "active" : ""}`}
                    >
                      <img
                          src={item.icon}
                          alt=""
                          className={`nav-icon ${isActive ? "active-icon" : ""}`}
                      />
                      <div className="nav-item-text">
                        <div className="nav-item-label">{item.label}</div>
                        <div className="nav-item-description">
                          {item.description}
                        </div>
                      </div>
                    </a>
                );
              })}
            </nav>
          </div>
        </div>
      </>
  );
}
