import React from "react";
import { useTranslation } from "react-i18next";
import { SharedSidebar } from "@awm/shared";

import usersIcon from "../../assets/icons/users-icon.svg";
import shieldIcon from "../../assets/icons/shield-icon.svg";
import documentCheckIcon from "../../assets/icons/document-check-icon.svg";
import graduationCapIcon from "../../assets/icons/graduation-cap-icon.svg";

export function AdminSidebar() {
  const { t } = useTranslation();

  const navigationItems = [
    {
      href: "/users",
      labelKey: "admin.users",
      icon: usersIcon,
      descriptionKey: "admin.usersDescription",
    },
    {
      href: "/roles",
      labelKey: "nav.roles",
      icon: shieldIcon,
      descriptionKey: "admin.rolesDescription",
    },
    {
      href: "/work-types",
      labelKey: "admin.workTypesTitle",
      icon: documentCheckIcon,
      descriptionKey: "admin.workTypesDescription",
    },
    {
      href: "/students",
      labelKey: "admin.studentsTitle",
      icon: graduationCapIcon,
      descriptionKey: "admin.studentsDescription",
    },
  ];

  return <SharedSidebar navigationItems={navigationItems} headerTitle={t('nav.dashboard')} />;
}

export function Sidebar() {
    return <AdminSidebar />;
}
