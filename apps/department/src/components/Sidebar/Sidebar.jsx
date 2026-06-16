import React from "react";
import { useTranslation } from "react-i18next";
import { SharedSidebar } from "@awm/shared";

import supervisorsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import periodsIcon from "../../assets/icons/periods-sidebar-icon.svg";
import settingsIcon from "../../assets/icons/settings-sidebar-icon.svg";
import graduationCapIcon from "../../assets/icons/graduation-cap-icon.svg";
import documentCheckIcon from "../../assets/icons/document-check-icon.svg";
import bellIcon from "../../assets/icons/bell-icon.svg";

export function Sidebar() {
  const { t } = useTranslation();

  const navigationItems = [
    {
      href: "/staff",
      labelKey: "nav.employees",
      icon: supervisorsIcon,
      descriptionKey: "department.employees",
    },
    {
      href: "/periods",
      labelKey: "nav.timePeriods",
      icon: periodsIcon,
      descriptionKey: "department.timePeriods",
    },
    {
      href: "/topics",
      labelKey: "nav.directionsTopics",
      icon: graduationCapIcon,
      descriptionKey: "department.directions",
    },
    {
      href: "/defenses",
      labelKey: "nav.defenseReadiness",
      icon: documentCheckIcon,
      descriptionKey: "department.defenseReadinessDescription",
    },
    {
      href: "/settings-dashboard",
      labelKey: "auth.settings",
      icon: settingsIcon,
      descriptionKey: "department.settingsDescription",
    },
    {
      href: "/notifications",
      labelKey: "nav.notifications",
      icon: bellIcon,
      descriptionKey: "department.notificationsDescription",
    },
  ];

  return <SharedSidebar navigationItems={navigationItems} headerTitle={t('nav.dashboard')} />;
}
