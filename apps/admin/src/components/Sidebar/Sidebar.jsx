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
      href: "/supervisors",
      labelKey: "nav.supervisors",
      icon: supervisorsIcon,
      descriptionKey: "department.supervisors",
    },
    {
      href: "/time-periods",
      labelKey: "nav.timePeriods",
      icon: periodsIcon,
      descriptionKey: "department.timePeriods",
    },
    {
      href: "/directions-topics?tab=directions",
      labelKey: "nav.directionsTopics",
      icon: graduationCapIcon,
      descriptionKey: "department.directions",
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
