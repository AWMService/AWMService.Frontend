import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRole, ROLES, SharedSidebar } from "@awm/shared";

import myTopicsIcon from "../../assets/icons/graduation-cap-icon.svg";
import studentsIcon from "../../assets/icons/supervisors-sidebar-icon.svg";
import reportsIcon from "../../assets/icons/reports-sidebar-icon.svg";
import scheduleIcon from "../../assets/icons/reports-sidebar-icon.svg";
import checkIcon from "../../assets/icons/reports-sidebar-icon.svg";
import bellIcon from "../../assets/icons/bell-icon.svg";

const ROLE_MENU_CONFIG = {
    [ROLES.SUPERVISOR]: [
        { href: "/directions", labelKey: "nav.directions", icon: reportsIcon, descriptionKey: "supervisor.topics", role: ROLES.SUPERVISOR },
        { href: "/my-topics", labelKey: "nav.myTopics", icon: myTopicsIcon, descriptionKey: "supervisor.topics", role: ROLES.SUPERVISOR },
        { href: "/mystudents", labelKey: "nav.myStudents", icon: studentsIcon, descriptionKey: "supervisor.students", role: ROLES.SUPERVISOR },
        { href: "/checks", labelKey: "nav.checks", icon: checkIcon, descriptionKey: "supervisor.gradeWork", role: ROLES.SUPERVISOR },
        { href: "/software-checks", labelKey: "nav.softwareChecks", icon: checkIcon, descriptionKey: "supervisor.gradeWork", role: ROLES.SUPERVISOR },
    ],
    [ROLES.REVIEWER]: [
        { href: "/reviews", labelKey: "reviewer.assignedWorks", icon: reportsIcon, descriptionKey: "reviewer.pendingReview", role: ROLES.REVIEWER },
    ],
    [ROLES.NORMOCONTROL]: [
        { href: "/documents", labelKey: "normocontrol.documentsCheck", icon: reportsIcon, descriptionKey: "normocontrol.pendingCheck", role: ROLES.NORMOCONTROL },
    ],
    [ROLES.CHAIRMAN]: [
        { href: "/commission", labelKey: "commission.commissions", icon: studentsIcon, descriptionKey: "commission.members", role: ROLES.CHAIRMAN },
        { href: "/schedule", labelKey: "nav.schedule", icon: scheduleIcon, descriptionKey: "commission.schedule", activePaths: ["/schedule", "/secretary"], role: ROLES.CHAIRMAN },
    ],
    [ROLES.SECRETARY]: [
        { href: "/commission", labelKey: "commission.commissions", icon: studentsIcon, descriptionKey: "commission.members", role: ROLES.SECRETARY },
        { href: "/schedule", labelKey: "nav.schedule", icon: scheduleIcon, descriptionKey: "commission.schedule", activePaths: ["/schedule", "/secretary"], role: ROLES.SECRETARY },
        { href: "/secretary", labelKey: "commission.protocol", icon: reportsIcon, descriptionKey: "commission.generateProtocol", role: ROLES.SECRETARY },
    ],
    [ROLES.COMMISSION_MEMBER]: [
        { href: "/commission", labelKey: "commission.commissions", icon: studentsIcon, descriptionKey: "commission.members", role: ROLES.COMMISSION_MEMBER },
        { href: "/schedule", labelKey: "nav.schedule", icon: scheduleIcon, descriptionKey: "commission.schedule", activePaths: ["/schedule"], role: ROLES.COMMISSION_MEMBER },
    ],
};


const SCHEDULE_ROLE_PRIORITY = [ROLES.COMMISSION_MEMBER, ROLES.SECRETARY, ROLES.CHAIRMAN, ROLES.SUPERVISOR];

export function UniversalSidebar() {
    const { t } = useTranslation();
    const { currentRole, availableRoles, switchRole } = useRole();

    const navigationItems = useMemo(() => {
        const items = [];
        const seenHrefs = new Map(); 

        
        availableRoles.forEach((role) => {
            const roleItems = ROLE_MENU_CONFIG[role] || [];
            roleItems.forEach((item) => {
                if (!seenHrefs.has(item.href)) {
                    seenHrefs.set(item.href, item);
                    items.push(item);
                }
            });
        });

        
        if (seenHrefs.has("/schedule")) {
            const scheduleRole = SCHEDULE_ROLE_PRIORITY.find((r) => availableRoles.includes(r));
            const scheduleItem = seenHrefs.get("/schedule");
            scheduleItem.role = scheduleRole || scheduleItem.role;
        }

        
        items.push({
            href: "/notifications",
            labelKey: "nav.notifications",
            icon: bellIcon,
            descriptionKey: "universal.notificationsDescription",
            role: null, 
        });

        return items;
    }, [availableRoles]);

    const handleItemClick = useCallback(
        (item) => () => {
            
            if (item.role && item.role !== currentRole) {
                switchRole(item.role);
            }
        },
        [currentRole, switchRole]
    );

    const itemsWithClick = useMemo(
        () =>
            navigationItems.map((item) => ({
                ...item,
                onClick: item.role ? handleItemClick(item) : undefined,
            })),
        [navigationItems, handleItemClick]
    );

    return <SharedSidebar navigationItems={itemsWithClick} headerTitle={t("nav.dashboard")} />;
}
