import React from "react";
import { useTranslation } from "react-i18next";
import { SharedSidebar } from "@awm/shared";

import supervisorsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import periodsIcon from "../../assets/icons/periods-sidebar-icon.svg";
import settingsIcon from "../../assets/icons/settings-sidebar-icon.svg";
import graduationCapIcon from "../../assets/icons/graduation-cap-icon.svg";
import documentCheckIcon from "../../assets/icons/document-check-icon.svg";
import bellIcon from "../../assets/icons/bell-icon.svg";
import usersIcon from "../../assets/icons/users-icon.svg";
import shieldCheckIcon from "../../assets/icons/shield-check-icon.svg";

export function Sidebar() {
  const { t } = useTranslation();

  const navigationItems = [
    {
      href: "/supervisors",
      labelKey: "nav.supervisors",
      icon: supervisorsIcon,
      descriptionKey: "department.supervisors",
    },
    {
      href: "/initial-periods",
      labelKey: "nav.initialPeriods",
      icon: documentCheckIcon,
      descriptionKey: "department.initialPeriodsDescription",
    },
    {
      href: "/time-periods",
      labelKey: "nav.timePeriods",
      icon: periodsIcon,
      descriptionKey: "department.timePeriods",
    },
    {
      href: "/commissions",
      labelKey: "nav.commissions",
      icon: usersIcon,
      descriptionKey: "department.commissionsDescription",
    },
    {
      href: "/evaluation-criteria",
      labelKey: "nav.evaluationCriteria",
      icon: documentCheckIcon,
      descriptionKey: "department.evaluationCriteriaDescription",
    },
    {
      href: "/directions-topics?tab=directions",
      labelKey: "nav.directionsTopics",
      icon: graduationCapIcon,
      descriptionKey: "department.directions",
    },
    {
      href: "/topic-coordination",
      labelKey: "nav.topicCoordination",
      icon: documentCheckIcon,
      descriptionKey: "department.topicCoordinationDesc",
    },
    {
      href: "/settings",
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
    {
      href: "/student-distribution",
      labelKey: "nav.studentDistribution",
      icon: usersIcon,
      descriptionKey: "department.studentDistributionDescription",
    },
    {
      href: "/expert-assignment",
      labelKey: "nav.expertAssignment",
      icon: shieldCheckIcon,
      descriptionKey: "department.expertAssignmentDescription",
    },
    {
      href: "/check-settings",
      labelKey: "nav.checks",
      icon: shieldCheckIcon,
      descriptionKey: "department.notifyReviews",
    },
    {
      href: "/defense-readiness",
      labelKey: "nav.defenseReadiness",
      icon: documentCheckIcon,
      descriptionKey: "department.defenseReadinessDescription",
    },
  ];

  return <SharedSidebar navigationItems={navigationItems} headerTitle={t('nav.dashboard')} />;
}
