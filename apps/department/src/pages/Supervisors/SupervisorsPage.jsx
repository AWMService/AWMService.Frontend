"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { 
    useAuth, 
    useStaffByDepartment, 
    useSupervisors, 
    useUpdateStaffWorkload, 
    useApproveSupervisors 
} from "@awm/shared";
import "./SupervisorsPage.css";
import { SupervisorCard, SupervisorSelectionDialog } from "@awm/shared";
import plusIcon from "../../assets/icons/plus-icon.svg";
import searchIcon from "../../assets/icons/search-icon.svg";

function SupervisorsPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const departmentId = user?.departmentId;

    const { data: allTeachers = [], isLoading: isLoadingTeachers } = useStaffByDepartment(departmentId);
    const { data: rawSupervisors = [], isLoading: isLoadingSupervisors } = useSupervisors(departmentId);
    
    const approveMutation = useApproveSupervisors(departmentId);
    const updateWorkloadMutation = useUpdateStaffWorkload(departmentId);

    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Map backend staff format to UI component format
    const mapStaffToUI = (staff) => ({
        id: staff.id,
        name: staff.fullName || "Unknown",
        position: staff.position || "",
        degree: staff.academicDegree || "",
        specialization: "", 
        email: staff.email || "",
        phone: "",
        currentStudents: 0, 
        maxStudents: staff.maxStudentsLoad || 0,
        assignedDate: new Date(), 
    });

    const supervisors = useMemo(() => rawSupervisors.map(mapStaffToUI), [rawSupervisors]);
    const teachersUI = useMemo(() => allTeachers.map(mapStaffToUI), [allTeachers]);

    const availableTeachers = useMemo(() => {
        const supervisorIds = new Set(supervisors.map((s) => s.id));
        return teachersUI.filter((t) => !supervisorIds.has(t.id));
    }, [supervisors, teachersUI]);

    const filteredSupervisors = useMemo(
        () =>
            supervisors.filter(
                (s) =>
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.specialization.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [supervisors, searchTerm]
    );

    const handleAddSupervisors = async (selectedIds) => {
        const currentSupervisorIds = supervisors.map(s => s.id);
        const newIdsToApprove = [...currentSupervisorIds, ...selectedIds];
        await approveMutation.mutateAsync(newIdsToApprove);
        setIsDialogOpen(false);
    };

    const handleRemoveSupervisor = async (id) => {
        const remainingIds = supervisors.filter(s => s.id !== id).map(s => s.id);
        await approveMutation.mutateAsync(remainingIds);
    };

    const handleUpdateWorkload = async (id, maxStudents) => {
        await updateWorkloadMutation.mutateAsync({ id, maxStudentsLoad: maxStudents });
    };

    if (isLoadingTeachers || isLoadingSupervisors) {
        return <div className="supervisors-page"><p>{t('common.loading', 'Loading...')}</p></div>;
    }

    if (!departmentId) {
        return <div className="supervisors-page"><p>{t('department.noDepartmentSelected', 'No department selected.')}</p></div>;
    }

    return (
        <div className="supervisors-page">
            <div className="page-header">
                <div className="page-header-info">
                    <div>
                        <h1 className="page-title">{t('department.supervisorsTitle')}</h1>
                        <p className="page-subtitle">
                            {t('department.supervisorsSubtitle')}
                        </p>
                    </div>
                </div>

                <button
                    className="button primary-button"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={approveMutation.isPending}
                >
                    <img src={plusIcon} alt="Add" className="button-icon" />
                    {t('department.addSupervisors')}
                </button>
            </div>

            <div className="search-bar-container">
                <img src={searchIcon} alt="Search" className="search-bar-icon" />
                <input
                    type="text"
                    placeholder={t('department.searchSupervisors')}
                    className="search-bar-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="supervisors-grid-layout">
                {filteredSupervisors.map((supervisor) => (
                    <SupervisorCard
                        key={supervisor.id}
                        supervisor={supervisor}
                        onRemove={handleRemoveSupervisor}
                        onUpdateWorkload={handleUpdateWorkload}
                    />
                ))}
                {filteredSupervisors.length === 0 && (
                    <div className="empty-state">
                        <p>{t('department.teachersNotFound')}</p>
                    </div>
                )}
            </div>

            <SupervisorSelectionDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                availableTeachers={availableTeachers}
                onConfirm={handleAddSupervisors}
            />
        </div>
    );
}

export default SupervisorsPage;
