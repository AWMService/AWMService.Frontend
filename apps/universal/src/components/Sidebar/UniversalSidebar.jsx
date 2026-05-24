import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRole, ROLES, SharedSidebar } from "@awm/shared";

import myTopicsIcon from "../../assets/icons/graduation-cap-icon.svg";
import studentsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import reportsIcon from "../../assets/icons/reports-sidebar-icon.svg";
import scheduleIcon from "../../assets/icons/reports-sidebar-icon.svg";
import checkIcon from "../../assets/icons/reports-sidebar-icon.svg";
import bellIcon from "../../assets/icons/bell-icon.svg";

export function UniversalSidebar() {
    const { t } = useTranslation();
    const { currentRole } = useRole();

    const navigationItems = useMemo(() => {
        const items = [];

        if (currentRole === ROLES.SUPERVISOR) {
            items.push(
                { href: "/directions", labelKey: "nav.directions", icon: reportsIcon, descriptionKey: "supervisor.topics" },
                { href: "/my-topics", labelKey: "nav.myTopics", icon: myTopicsIcon, descriptionKey: "supervisor.topics" },
                { href: "/mystudents", labelKey: "nav.myStudents", icon: studentsIcon, descriptionKey: "supervisor.students" },
                { href: "/schedule", labelKey: "nav.schedule", icon: scheduleIcon, descriptionKey: "commission.schedule", activePaths: ["/schedule", "/secretary"] },
                { href: "/checks", labelKey: "nav.checks", icon: checkIcon, descriptionKey: "supervisor.gradeWork" }
            );
        }

        if (currentRole === ROLES.REVIEWER) {
            items.push({ href: "/reviews", labelKey: "reviewer.assignedWorks", icon: reportsIcon, descriptionKey: "reviewer.pendingReview" });
        }

        if (currentRole === ROLES.NORMOCONTROL) {
            items.push({ href: "/documents", labelKey: "normocontrol.documentsCheck", icon: reportsIcon, descriptionKey: "normocontrol.pendingCheck" });
        }

        if ([ROLES.CHAIRMAN, ROLES.SECRETARY, ROLES.COMMISSION_MEMBER].includes(currentRole)) {
            items.push(
                { href: "/commission", labelKey: "commission.commissions", icon: studentsIcon, descriptionKey: "commission.members" },
                { href: "/schedule", labelKey: "commission.schedule", icon: scheduleIcon, descriptionKey: "commission.date", activePaths: ["/schedule"] }
            );
            if (currentRole === ROLES.SECRETARY) {
                items.push({ href: "/secretary", labelKey: "commission.protocol", icon: reportsIcon, descriptionKey: "commission.generateProtocol" });
            }
        }

        items.push({ href: "/notifications", labelKey: "nav.notifications", icon: bellIcon, descriptionKey: "universal.notificationsDescription" });

        return items;
    }, [currentRole]);

    return <SharedSidebar navigationItems={navigationItems} headerTitle={t('nav.dashboard')} />;
}
