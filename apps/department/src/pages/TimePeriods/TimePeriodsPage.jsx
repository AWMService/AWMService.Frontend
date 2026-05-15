import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, usePeriods, useApproveDefensePeriods, ConfirmModal } from "@awm/shared";
import "./TimePeriodsPage.css";

import TimePeriodCard from "../../components/TimePeriods/TimePeriodCard/TimePeriodCard.jsx";
import TimePeriodFormDialog from "../../components/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog.jsx";

import plusIcon from "../../assets/icons/plus-icon.svg";

const DEFENSE_STAGES = ["PreDefense1", "PreDefense2", "PreDefense3", "FinalDefense"];

export default function TimePeriodsPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const departmentId = user?.departmentId;
    const academicYearId = user?.currentAcademicYearId;

    const { data: periodsData = [], isLoading } = usePeriods(departmentId, academicYearId);
    const approveMutation = useApproveDefensePeriods(departmentId, academicYearId);

    const [localPeriods, setLocalPeriods] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        if (periodsData && periodsData.length > 0) {
            const defensePeriods = periodsData.filter(p => DEFENSE_STAGES.includes(p.workflowStage));
            const mapped = defensePeriods.map(p => ({
                id: p.id.toString(),
                name: p.workflowStage,
                startDate: p.startDate ? p.startDate.split('T')[0] : "",
                endDate: p.endDate ? p.endDate.split('T')[0] : "",
                commissions: 0,
                students: 0,
                dates: 0,
                progress: 0,
                status: "upcoming",
            }));
            setLocalPeriods(mapped);
            setHasUnsavedChanges(false);
        }
    }, [periodsData]);

    const handleAddPeriod = (formData) => {
        const newPeriod = {
            id: `new-${Date.now()}`,
            name: formData.name, // workflowStage
            startDate: formData.startDate,
            endDate: formData.endDate,
            commissions: 0,
            students: 0,
            dates: 0,
            progress: 0,
            status: "upcoming",
        };

        setLocalPeriods((prev) => [...prev, newPeriod]);
        setHasUnsavedChanges(true);
        setIsDialogOpen(false);
    };

    const deletePeriod = (id) => {
        setLocalPeriods((prev) => prev.filter((p) => p.id !== id));
        setHasUnsavedChanges(true);
    };

    const handleSaveAndApprove = async () => {
        const payload = localPeriods.map(p => ({
            workflowStage: p.name,
            startDate: new Date(p.startDate).toISOString(),
            endDate: new Date(p.endDate).toISOString(),
        }));

        try {
            await approveMutation.mutateAsync(payload);
            setHasUnsavedChanges(false);
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("Failed to approve defense periods", error);
        }
    };

    if (isLoading) {
        return <div className="time-periods-page"><p>{t('common.loading', 'Loading...')}</p></div>;
    }

    if (!departmentId || !academicYearId) {
        return <div className="time-periods-page"><p>{t('department.noDepartmentSelected', 'Department or Academic Year missing.')}</p></div>;
    }

    return (
        <div className="time-periods-page">
            <div className="page-header">
                <div className="page-header-info">
                    <div>
                        <h1 className="page-title">{t('department.timePeriodsTitle')}</h1>
                        <p className="page-subtitle">
                            {t('department.timePeriodsSubtitle')}
                        </p>
                    </div>
                </div>

                <div className="page-actions" style={{ display: 'flex', gap: '10px' }}>
                    {hasUnsavedChanges && (
                        <button
                            className="button secondary-button"
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={approveMutation.isPending}
                        >
                            {t('common.save', 'Save Changes')}
                        </button>
                    )}
                    <button
                        className="button primary-button"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <img src={plusIcon} alt="Add" className="button-icon" />
                        {t('department.addPeriod')}
                    </button>
                </div>
            </div>

            <div className="periods-list">
                {localPeriods.map((period) => (
                    <TimePeriodCard
                        key={period.id}
                        period={period}
                        onDelete={() => deletePeriod(period.id)}
                    />
                ))}
                {localPeriods.length === 0 && (
                    <div className="empty-state">
                        <p>{t('department.periodsNotFound', 'No periods added yet.')}</p>
                    </div>
                )}
            </div>

            <TimePeriodFormDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleAddPeriod}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                title={t("department.approveDefensePeriods", "Approve Defense Periods")}
                message={t("department.periodsApproved", "Are you sure you want to approve these periods?")}
                onConfirm={handleSaveAndApprove}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
}
