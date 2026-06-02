import React from "react";
import { useTranslation } from "react-i18next";
import { SharedSidebar } from "@awm/shared";

import supervisorsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import periodsIcon from "../../assets/icons/periods-sidebar-icon.svg";
import settingsIcon from "../../assets/icons/settings-sidebar-icon.svg";
import graduationCapIcon from "../../assets/icons/graduation-cap-icon.svg";

export function AdminSidebar() {
  const { t } = useTranslation();

  const navigationItems = [
    {
      href: "/users",
      labelKey: "admin.users",
      icon: supervisorsIcon,
      descriptionKey: "admin.users",
    },
    {
      href: "/roles",
      labelKey: "nav.roles",
      icon: supervisorsIcon,
      descriptionKey: "admin.roles",
    },
    {
      href: "/departments",
      labelKey: "nav.departments",
      icon: periodsIcon,
      descriptionKey: "nav.departments",
    },
    {
      href: "/institutes",
      labelKey: "nav.faculties",
      icon: graduationCapIcon,
      descriptionKey: "nav.faculties",
    },
    {
      href: "/education-levels",
      labelKey: "admin.educationLevels",
      icon: graduationCapIcon, // Use appropriate icon
      descriptionKey: "admin.educationLevels",
    },
    {
      href: "/programs",
      labelKey: "admin.programs",
      icon: periodsIcon,
      descriptionKey: "admin.programs",
    },
    {
      href: "/work-types",
      labelKey: "admin.workTypes",
      icon: settingsIcon,
      descriptionKey: "admin.workTypes",
    },
    {
      href: "/students",
      labelKey: "nav.students",
      icon: supervisorsIcon,
      descriptionKey: "nav.students",
    },
    {
      href: "/settings",
      labelKey: "auth.settings",
      icon: settingsIcon,
      descriptionKey: "admin.systemSettings",
    },
  ];

  return <SharedSidebar navigationItems={navigationItems} headerTitle={t('nav.dashboard')} />;
}

export function Sidebar() {
    return <AdminSidebar />;
}
