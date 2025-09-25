import React, { useState } from "react";
import "./Sidebar.css";
import supervisorsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import periodsIcon from "../../assets/icons/periods-sidebar-icon.svg";
import settingsIcon from "../../assets/icons/settings-sidebar-icon.svg";
import reportsIcon from "../../assets/icons/reports-sidebar-icon.svg";
import graduationCapIcon from "../../assets/icons/graduation-cap-icon.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import xIcon from "../../assets/icons/x-icon.svg";

const navigationItems = [
  {
    href: "/",
    label: "Научные руководители",
    icon: supervisorsIcon,
    description: "Управление назначением научных руководителей",
  },
  {
    href: "/time-periods",
    label: "Временные периоды",
    icon: periodsIcon,
    description: "Управление периодами для задач кафедры",
  },
  {
    href: "/directions",
    label: "Направления ДП/ДР",
    icon: graduationCapIcon,
    description: "Управление направлениями дипломных работ",
  },
  {
    href: "/topics",
    label: "Темы ДП/ДР",
    icon: reportsIcon,
    description: "Управление темами дипломных проектов и исследований",
  },
  {
    href: "/settings",
    label: "Настройки",
    icon: settingsIcon,
    description: "Настройки системы и кафедры",
  },
];

export function Sidebar({ pathname, setPathname }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setPathname(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop">
        <div className="sidebar-desktop-content">
          <nav className="sidebar-nav">
            <div className="sidebar-header">
              <h2>Панель управления</h2>
            </div>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
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

      {/* Mobile Menu Button */}
      <div className="mobile-menu-button-wrapper">
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <img
            key={isMobileMenuOpen ? "x-icon" : "menu-icon"}
            src={isMobileMenuOpen ? xIcon : menuIcon}
            alt="menu"
            className="menu-icon"
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`sidebar-mobile ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-mobile-content">
          <nav className="sidebar-nav">
            <div className="sidebar-header">
              <h2>Панель управления</h2>
            </div>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
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
