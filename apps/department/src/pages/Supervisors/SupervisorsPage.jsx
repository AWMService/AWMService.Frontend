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
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: allTeachers = [], isLoading: isLoadingTeachers } = useStaffByDepartment(orgUnitId);
    const { data: rawSupervisors = [], isLoading: isLoadingSupervisors } = useSupervisors(orgUnitId, semesterId);
    
    const approveMutation = useApproveSupervisors(orgUnitId, semesterId);
    const updateWorkloadMutation = useUpdateStaffWorkload(orgUnitId, semesterId);

    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Map backend staff format to UI component format
    const mapStaffToUI = (staff) => ({
        id: staff.userId || staff.id,
        name: staff.fullName || "Unknown",
        positionTitle: staff.positionTitle || "",
        specialization: "", 
        email: staff.email || "",
        phone: "",
        currentStudents: staff.currentStudents || 0, 
        maxStudents: staff.maxWorkload !== undefined ? staff.maxWorkload : (staff.maxStudentsLoad || 0),
        assignedDate: staff.assignedDate || new Date(), 
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
        const currentAssignments = supervisors.map(s => ({
            userId: s.id,
            maxWorkload: s.maxStudents || 5
        }));
        
        const newAssignments = selectedIds.map(id => {
            const teacher = teachersUI.find(t => t.id === id);
            return {
                userId: id,
                maxWorkload: teacher?.maxStudents || 5
            };
        });

        const allAssignments = [...currentAssignments, ...newAssignments];
        await approveMutation.mutateAsync(allAssignments);
        setIsDialogOpen(false);
    };

    const handleRemoveSupervisor = async (id) => {
        const remainingAssignments = supervisors
            .filter(s => s.id !== id)
            .map(s => ({
                userId: s.id,
                maxWorkload: s.maxStudents || 5
            }));
        await approveMutation.mutateAsync(remainingAssignments);
    };

    const handleUpdateWorkload = async (id, maxStudents) => {
        await updateWorkloadMutation.mutateAsync({ userId: id, maxWorkload: maxStudents });
    };

    if (isLoadingTeachers || isLoadingSupervisors) {
        return <div className="supervisors-page"><p>{t('common.loading', 'Loading...')}</p></div>;
    }

    if (!orgUnitId) {
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
