"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { 
    useAuth, 
    useStaffByDepartment, 
    useSupervisors, 
    useUpdateStaffWorkload, 
    useApproveSupervisors,
    useSupervisorsStatus,
    useConfirmSupervisors,
    useUnlockSupervisors,
    ConfirmModal
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
    const { data: statusData, isLoading: isLoadingStatus } = useSupervisorsStatus(orgUnitId, semesterId);
    
    const approveMutation = useApproveSupervisors(orgUnitId, semesterId);
    const updateWorkloadMutation = useUpdateStaffWorkload(orgUnitId, semesterId);
    const confirmMutation = useConfirmSupervisors(orgUnitId, semesterId);
    const unlockMutation = useUnlockSupervisors(orgUnitId, semesterId);

    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

    const isConfirmed = statusData?.isConfirmed || false;

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

    const handleConfirmSupervisors = async () => {
        await confirmMutation.mutateAsync();
        setIsConfirmModalOpen(false);
    };

    const handleUnlockSupervisors = async () => {
        await unlockMutation.mutateAsync();
        setIsUnlockModalOpen(false);
    };

    if (isLoadingTeachers || isLoadingSupervisors || isLoadingStatus) {
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

                <div className="header-actions">
                    {isConfirmed ? (
                        <button
                            className="button secondary-button"
                            onClick={() => setIsUnlockModalOpen(true)}
                            disabled={unlockMutation.isPending}
                        >
                            {t('department.unlockSupervisors', 'Разблокировать для изменений')}
                        </button>
                    ) : (
                        <>
                            <button
                                className="button secondary-button"
                                onClick={() => setIsConfirmModalOpen(true)}
                                disabled={confirmMutation.isPending || supervisors.length === 0}
                            >
                                {t('department.confirmSupervisors', 'Утвердить состав НР')}
                            </button>
                            <button
                                className="button primary-button"
                                onClick={() => setIsDialogOpen(true)}
                                disabled={approveMutation.isPending}
                            >
                                <img src={plusIcon} alt="Add" className="button-icon" />
                                {t('department.addSupervisors')}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isConfirmed && (
                <div className="confirmed-banner">
                    <svg viewBox="0 0 24 24" className="banner-icon">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    <div className="banner-text">
                        <strong>{t('department.supervisorsConfirmedBannerTitle', 'Состав научных руководителей утвержден.')}</strong> {t('department.supervisorsConfirmedBannerBody', 'Изменение состава заблокировано. Нагрузку преподавателей можно изменять без разблокировки.')}
                    </div>
                </div>
            )}

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
                        onRemove={isConfirmed ? null : handleRemoveSupervisor}
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

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={t('department.confirmSupervisorsTitle', 'Утверждение состава руководителей')}
                message={t('department.confirmSupervisorsMessage', 'Вы уверены, что хотите утвердить состав научных руководителей? После утверждения внесение изменений (добавление/удаление) будет заблокировано. Нагрузку руководителей можно будет изменять без разблокировки.')}
                onConfirm={handleConfirmSupervisors}
                onCancel={() => setIsConfirmModalOpen(false)}
            />

            <ConfirmModal
                isOpen={isUnlockModalOpen}
                title={t('department.unlockSupervisorsTitle', 'Разблокировка состава руководителей')}
                message={t('department.unlockSupervisorsMessage', 'Вы уверены, что хотите разблокировать состав научных руководителей для редактирования? Вы сможете добавлять и удалять руководителей.')}
                onConfirm={handleUnlockSupervisors}
                onCancel={() => setIsUnlockModalOpen(false)}
            />
        </div>
    );
}

export default SupervisorsPage;
