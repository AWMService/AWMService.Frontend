import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Sidebar.css";

import supervisorsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import periodsIcon from "../../assets/icons/periods-sidebar-icon.svg";
import settingsIcon from "../../assets/icons/settings-sidebar-icon.svg";
import graduationCapIcon from "../../assets/icons/graduation-cap-icon.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import xIcon from "../../assets/icons/x-icon.svg";

export function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const pathname = location.pathname;

  // Навигационные пункты для Admin
  const navigationItems = [
    {
      href: "/users",
      labelKey: "admin.users",
      icon: supervisorsIcon,
      descriptionKey: "admin.createUser",
    },
    {
      href: "/roles",
      labelKey: "nav.roles",
      icon: graduationCapIcon,
      descriptionKey: "admin.assignRole",
    },
    {
      href: "/departments",
      labelKey: "nav.departments",
      icon: periodsIcon,
      descriptionKey: "admin.departments",
    },
    {
      href: "/institutes",
      labelKey: "admin.institutesTitle",
      icon: periodsIcon,
      descriptionKey: "admin.institutesDescription",
    },
    {
      href: "/education-levels",
      labelKey: "admin.educationLevelsTitle",
      icon: graduationCapIcon,
      descriptionKey: "admin.educationLevelsDescription",
    },
    {
      href: "/programs",
      labelKey: "admin.programsTitle",
      icon: periodsIcon,
      descriptionKey: "admin.programsDescription",
    },
    {
      href: "/work-types",
      labelKey: "admin.workTypesTitle",
      icon: periodsIcon,
      descriptionKey: "admin.workTypesDescription",
    },
    {
      href: "/students",
      labelKey: "admin.studentsTitle",
      icon: supervisorsIcon,
      descriptionKey: "admin.studentsDescription",
    },
    {
      href: "/monitoring",
      labelKey: "admin.monitoring",
      icon: periodsIcon,
      descriptionKey: "admin.activityLog",
    },
    {
      href: "/settings",
      labelKey: "admin.systemSettings",
      icon: settingsIcon,
      descriptionKey: "admin.generalSettings",
    },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  const isItemActive = (href) => {
    const basePath = href.split("?")[0];
    return pathname.startsWith(basePath);
  };

  const renderNavItems = () => (
    navigationItems.map((item) => {
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
            <div className="nav-item-label">{t(item.labelKey)}</div>
            <div className="nav-item-description">
              {t(item.descriptionKey)}
            </div>
          </div>
        </a>
      );
    })
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop admin-sidebar">
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
        >
          <img
            src={isMobileMenuOpen ? xIcon : menuIcon}
            alt="menu"
            className="menu-icon"
          />
        </button>
      </div>

      {/* Mobile Overlay */}
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
