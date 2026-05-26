import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
    useAuth, 
    usePeriods, 
    useApproveDefensePeriods, 
    useOrgUnitSpecialities,
    useResetStagesOverride,
    ConfirmModal 
} from "@awm/shared";
import "./TimePeriodsPage.css";

import { TimePeriodCard, TimePeriodFormDialog } from "@awm/shared";

import plusIcon from "../../assets/icons/plus-icon.svg";

const DEFENSE_STAGES = ["PreDefense1", "PreDefense2", "PreDefense3", "FinalDefense"];

export default function TimePeriodsPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const [selectedSpecialityId, setSelectedSpecialityId] = useState(null);
    const [localPeriods, setLocalPeriods] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Queries
    const { data: specialities = [] } = useOrgUnitSpecialities(orgUnitId);
    const { data: periodsData = [], isLoading } = usePeriods(orgUnitId, semesterId, selectedSpecialityId);
    
    // Mutations
    const approveMutation = useApproveDefensePeriods(orgUnitId, semesterId, selectedSpecialityId);
    const resetMutation = useResetStagesOverride(orgUnitId, semesterId);

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
        } else {
            setLocalPeriods([]);
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

    const handleResetOverride = async () => {
        if (window.confirm(t("department.confirmResetOverride", "Вы действительно хотите удалить индивидуальные сроки для этой специальности и вернуться к общим срокам кафедры?"))) {
            try {
                await resetMutation.mutateAsync(selectedSpecialityId);
            } catch (error) {
                console.error("Failed to reset override", error);
            }
        }
    };

    if (isLoading) {
        return <div className="time-periods-page"><p>{t('common.loading', 'Loading...')}</p></div>;
    }

    if (!orgUnitId || !semesterId) {
        return <div className="time-periods-page"><p>{t('department.noDepartmentSelected', 'Department or Academic Year missing.')}</p></div>;
    }

    const hasOverride = selectedSpecialityId && periodsData.some(p => DEFENSE_STAGES.includes(p.workflowStage));

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
                    {hasOverride && !hasUnsavedChanges && (
                        <button
                            className="button secondary-button"
                            onClick={handleResetOverride}
                            style={{ color: "#DC2626", borderColor: "#FCA5A5" }}
                        >
                            {t('department.resetToDefaults', 'Сбросить к общим срокам')}
                        </button>
                    )}
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

            {/* Speciality Selector */}
            <div className="speciality-selector-wrapper" style={{ 
                marginBottom: "2rem", 
                background: "#ffffff", 
                border: "1px solid #E5E7EB", 
                borderRadius: "12px", 
                padding: "16px 20px", 
                display: "flex", 
                alignItems: "center", 
                gap: "16px" 
            }}>
                <span className="selector-label" style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>{t("student.specialty")}:</span>
                <select
                    className="speciality-select"
                    value={selectedSpecialityId || ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectedSpecialityId(val ? Number(val) : null);
                        setLocalPeriods([]);
                        setHasUnsavedChanges(false);
                    }}
                    style={{ 
                        padding: "0.6rem 2rem 0.6rem 1rem", 
                        borderRadius: "0.375rem", 
                        border: "1px solid #E5E7EB", 
                        fontSize: "0.875rem", 
                        color: "#1F2937", 
                        backgroundColor: "#ffffff", 
                        outline: "none", 
                        cursor: "pointer", 
                        minWidth: "320px" 
                    }}
                >
                    <option value="">{t("department.allSpecialities", "Общее для кафедры (По умолчанию)")}</option>
                    {specialities.map(s => (
                        <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                    ))}
                </select>
            </div>

            {selectedSpecialityId && !hasOverride && !hasUnsavedChanges && (
                <div className="periods-form__order-error" style={{ color: "#1E3A8A", background: "#EFF6FF", borderColor: "#BFDBFE", marginBottom: "2rem" }}>
                    {t("department.usingInheritedDates", "Внимание: для данной специальности используются общие сроки кафедры. Вы можете добавить новые этапы и сохранить индивидуальные настройки.")}
                </div>
            )}

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



