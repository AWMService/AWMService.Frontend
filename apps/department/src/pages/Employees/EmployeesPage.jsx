"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { 
    useAuth, 
    useOrgUnitEmployees, 
    useApprovedEmployees, 
    useUpdateEmployeeWorkload, 
    useApproveEmployees,
    useEmployeesStatus,
    useConfirmEmployees,
    useUnlockEmployees,
    ConfirmModal
} from "@awm/shared";
import "./EmployeesPage.css";
import { EmployeeCard, EmployeeSelectionDialog } from "@awm/shared";
import plusIcon from "../../assets/icons/plus-icon.svg";
import searchIcon from "../../assets/icons/search-icon.svg";

function EmployeesPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: allTeachers = [], isLoading: isLoadingTeachers } = useOrgUnitEmployees(orgUnitId);
    const { data: rawEmployees = [], isLoading: isLoadingEmployees } = useApprovedEmployees(orgUnitId, semesterId);
    const { data: statusData, isLoading: isLoadingStatus } = useEmployeesStatus(orgUnitId, semesterId);
    
    const approveMutation = useApproveEmployees(orgUnitId, semesterId);
    const updateWorkloadMutation = useUpdateEmployeeWorkload(orgUnitId, semesterId);
    const confirmMutation = useConfirmEmployees(orgUnitId, semesterId);
    const unlockMutation = useUnlockEmployees(orgUnitId, semesterId);

    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

    const isConfirmed = statusData?.isConfirmed || false;

    
    const mapStaffToUI = (staff) => ({
        id: staff.userId || staff.id,
        name: staff.fullName || "Unknown",
        positionTitle: staff.positionTitle || "",
        specialization: "", 
        email: staff.email || "",
        phone: "",
        currentStudents: staff.currentStudents ?? 0, 
        maxStudents: staff.maxWorkload !== undefined ? staff.maxWorkload : (staff.maxStudentsLoad || 0),
        assignedDate: staff.assignedDate || new Date(), 
    });

    const employees = useMemo(() => rawEmployees.map(mapStaffToUI), [rawEmployees]);
    const teachersUI = useMemo(() => allTeachers.map(mapStaffToUI), [allTeachers]);

    const availableTeachers = useMemo(() => {
        const employeeIds = new Set(employees.map((e) => e.id));
        return teachersUI.filter((t) => !employeeIds.has(t.id));
    }, [employees, teachersUI]);

    const filteredEmployees = useMemo(
        () =>
            employees.filter(
                (e) =>
                    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    e.specialization.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [employees, searchTerm]
    );

    const handleAddEmployees = async (selectedIds) => {
        const currentAssignments = employees.map(e => ({
            userId: e.id,
            maxWorkload: e.maxStudents || 5
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

    const handleRemoveEmployee = async (id) => {
        const remainingAssignments = employees
            .filter(e => e.id !== id)
            .map(e => ({
                userId: e.id,
                maxWorkload: e.maxStudents || 5
            }));
        await approveMutation.mutateAsync(remainingAssignments);
    };

    const handleUpdateWorkload = async (id, maxStudents) => {
        await updateWorkloadMutation.mutateAsync({ userId: id, maxWorkload: maxStudents });
    };

    const handleConfirmEmployees = async () => {
        await confirmMutation.mutateAsync();
        setIsConfirmModalOpen(false);
    };

    const handleUnlockEmployees = async () => {
        await unlockMutation.mutateAsync();
        setIsUnlockModalOpen(false);
    };

    if (isLoadingTeachers || isLoadingEmployees || isLoadingStatus) {
        return <div className="employees-page"><p>{t('common.loading', 'Loading...')}</p></div>;
    }

    if (!orgUnitId) {
        return <div className="employees-page"><p>{t('department.noOrgUnitSelected', 'No organization unit selected.')}</p></div>;
    }

    return (
        <div className="employees-page">
            <div className="page-header">
                <div className="header-actions">
                    {isConfirmed ? (
                        <button
                            className="button secondary-button"
                            onClick={() => setIsUnlockModalOpen(true)}
                            disabled={unlockMutation.isPending}
                        >
                            {t('department.unlockEmployees', 'Разблокировать для изменений')}
                        </button>
                    ) : (
                        <>
                            <button
                                className="button secondary-button"
                                onClick={() => setIsConfirmModalOpen(true)}
                                disabled={confirmMutation.isPending || employees.length === 0}
                            >
                                {t('department.confirmEmployees', 'Утвердить состав НР')}
                            </button>
                            <button
                                className="button primary-button"
                                onClick={() => setIsDialogOpen(true)}
                                disabled={approveMutation.isPending}
                            >
                                <img src={plusIcon} alt="Add" className="button-icon" />
                                {t('department.addEmployees')}
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
                        <strong>{t('department.employeesConfirmedBannerTitle', 'Состав научных руководителей утвержден.')}</strong> {t('department.employeesConfirmedBannerBody', 'Изменение состава заблокировано. Нагрузку преподавателей можно изменять без разблокировки.')}
                    </div>
                </div>
            )}

            <div className="search-bar-container">
                <img src={searchIcon} alt="Search" className="search-bar-icon" />
                <input
                    type="text"
                    placeholder={t('department.searchEmployees')}
                    className="search-bar-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="employees-grid-layout">
                {filteredEmployees.map((employee) => (
                    <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onRemove={isConfirmed ? null : handleRemoveEmployee}
                        onUpdateWorkload={handleUpdateWorkload}
                    />
                ))}
                {filteredEmployees.length === 0 && (
                    <div className="empty-state">
                        <p>{t('department.teachersNotFound')}</p>
                    </div>
                )}
            </div>

            <EmployeeSelectionDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                availableTeachers={availableTeachers}
                onConfirm={handleAddEmployees}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={t('department.confirmEmployeesTitle', 'Утверждение состава руководителей')}
                message={t('department.confirmEmployeesMessage', 'Вы уверены, что хотите утвердить состав научных руководителей? После утверждения внесение изменений (добавление/удаление) будет заблокировано. Нагрузку руководителей можно будет изменять без разблокировки.')}
                onConfirm={handleConfirmEmployees}
                onCancel={() => setIsConfirmModalOpen(false)}
            />

            <ConfirmModal
                isOpen={isUnlockModalOpen}
                title={t('department.unlockEmployeesTitle', 'Разблокировка состава руководителей')}
                message={t('department.unlockEmployeesMessage', 'Вы уверены, что хотите разблокировать состав научных руководителей для редактирования? Вы сможете добавлять и удалять руководителей.')}
                onConfirm={handleUnlockEmployees}
                onCancel={() => setIsUnlockModalOpen(false)}
            />
        </div>
    );
}

export default EmployeesPage;
