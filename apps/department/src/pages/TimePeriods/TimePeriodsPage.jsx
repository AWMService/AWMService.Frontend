import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    useAuth,
    usePeriods,
    useApproveDefensePeriods,
    useApproveChecksPeriods,
    useOrgUnitSpecialities,
    useResetStagesOverride,
    ConfirmModal
} from "@awm/shared";
import "./TimePeriodsPage.css";

import { TimePeriodCard, TimePeriodFormDialog } from "@awm/shared";

import plusIcon from "../../assets/icons/plus-icon.svg";

const DEFENSE_STAGES = ["PreDefense1", "PreDefense2", "PreDefense3", "FinalDefense"];
const CHECKS_STAGES  = ["ChecksPeriod"];

export default function TimePeriodsPage() {
    const { t } = useTranslation();
    const { user } = useAuth();

    const orgUnitId  = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    // Speciality selector
    const [selectedSpecialityId, setSelectedSpecialityId] = useState(null);

    // Defense periods state
    const [localPeriods, setLocalPeriods]             = useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges]   = useState(false);
    const [isDialogOpen, setIsDialogOpen]             = useState(false);
    const [isConfirmOpen, setIsConfirmOpen]           = useState(false);

    // Checks period state
    const [localChecksPeriods, setLocalChecksPeriods]               = useState([]);
    const [hasUnsavedChecksChanges, setHasUnsavedChecksChanges]     = useState(false);
    const [isChecksDialogOpen, setIsChecksDialogOpen]               = useState(false);
    const [isChecksConfirmOpen, setIsChecksConfirmOpen]             = useState(false);

    // Queries
    const { data: specialities = [] }                          = useOrgUnitSpecialities(orgUnitId);
    const { data: periodsData = [], isLoading }                = usePeriods(orgUnitId, semesterId, selectedSpecialityId);

    // Mutations
    const approveMutation = useApproveDefensePeriods(orgUnitId, semesterId, selectedSpecialityId);
    const checksMutation  = useApproveChecksPeriods(orgUnitId, semesterId, selectedSpecialityId);
    const resetMutation   = useResetStagesOverride(orgUnitId, semesterId);

    // Helper: translate stage key to display label
    const stageLabel = (key) => ({
        PreDefense1:  t('student.preDefense1'),
        PreDefense2:  t('student.preDefense2'),
        PreDefense3:  t('student.preDefense3'),
        FinalDefense: t('student.defense'),
        ChecksPeriod: t('student.checksPeriod'),
    }[key] ?? key);

    const mapPeriod = (p) => ({
        id:        p.id.toString(),
        name:      stageLabel(p.workflowStage),
        stageKey:  p.workflowStage,
        startDate: p.startDate ? p.startDate.split('T')[0] : "",
        endDate:   p.endDate   ? p.endDate.split('T')[0]   : "",
        commissions: 0,
        students:    0,
        dates:       0,
        progress:    0,
        status:      "upcoming",
    });

    useEffect(() => {
        if (periodsData && periodsData.length > 0) {
            setLocalPeriods(
                periodsData.filter(p => DEFENSE_STAGES.includes(p.workflowStage)).map(mapPeriod)
            );
            setLocalChecksPeriods(
                periodsData.filter(p => CHECKS_STAGES.includes(p.workflowStage)).map(mapPeriod)
            );
            setHasUnsavedChanges(false);
            setHasUnsavedChecksChanges(false);
        } else {
            setLocalPeriods([]);
            setLocalChecksPeriods([]);
            setHasUnsavedChanges(false);
            setHasUnsavedChecksChanges(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [periodsData]);

    // ── Defense period handlers ──────────────────────────────────────────────
    const handleAddPeriod = (formData) => {
        setLocalPeriods(prev => [...prev, {
            id:        `new-${Date.now()}`,
            name:      stageLabel(formData.name),
            stageKey:  formData.name,
            startDate: formData.startDate,
            endDate:   formData.endDate,
            commissions: 0, students: 0, dates: 0, progress: 0, status: "upcoming",
        }]);
        setHasUnsavedChanges(true);
        setIsDialogOpen(false);
    };

    const deletePeriod = (id) => {
        setLocalPeriods(prev => prev.filter(p => p.id !== id));
        setHasUnsavedChanges(true);
    };

    const handleSaveAndApprove = async () => {
        const payload = localPeriods.map(p => ({
            workflowStage: p.stageKey,
            startDate:     new Date(p.startDate).toISOString(),
            endDate:       new Date(p.endDate).toISOString(),
        }));
        try {
            await approveMutation.mutateAsync(payload);
            setHasUnsavedChanges(false);
            setIsConfirmOpen(false);
        } catch (err) {
            console.error("Failed to approve defense periods", err);
        }
    };

    // ── Checks period handlers ───────────────────────────────────────────────
    const handleAddChecksPeriod = (formData) => {
        setLocalChecksPeriods(prev => [...prev, {
            id:        `new-checks-${Date.now()}`,
            name:      stageLabel(formData.name),
            stageKey:  formData.name,
            startDate: formData.startDate,
            endDate:   formData.endDate,
            commissions: 0, students: 0, dates: 0, progress: 0, status: "upcoming",
        }]);
        setHasUnsavedChecksChanges(true);
        setIsChecksDialogOpen(false);
    };

    const deleteChecksPeriod = (id) => {
        setLocalChecksPeriods(prev => prev.filter(p => p.id !== id));
        setHasUnsavedChecksChanges(true);
    };

    const handleSaveAndApproveChecks = async () => {
        const payload = localChecksPeriods.map(p => ({
            workflowStage: p.stageKey,
            startDate:     new Date(p.startDate).toISOString(),
            endDate:       new Date(p.endDate).toISOString(),
        }));
        try {
            await checksMutation.mutateAsync(payload);
            setHasUnsavedChecksChanges(false);
            setIsChecksConfirmOpen(false);
        } catch (err) {
            console.error("Failed to approve checks periods", err);
        }
    };

    // ── Reset override ───────────────────────────────────────────────────────
    const handleResetOverride = async () => {
        if (window.confirm(t("department.confirmResetOverride", "Вы действительно хотите удалить индивидуальные сроки для этой специальности и вернуться к общим срокам кафедры?"))) {
            try {
                await resetMutation.mutateAsync(selectedSpecialityId);
            } catch (err) {
                console.error("Failed to reset override", err);
            }
        }
    };

    if (isLoading) {
        return <div className="time-periods-page"><p>{t('common.loading', 'Loading...')}</p></div>;
    }

    if (!orgUnitId || !semesterId) {
        return <div className="time-periods-page"><p>{t('department.noDepartmentSelected', 'Department or Academic Year missing.')}</p></div>;
    }

    const hasDefenseOverride = selectedSpecialityId && periodsData.some(p => DEFENSE_STAGES.includes(p.workflowStage));
    const hasChecksOverride  = selectedSpecialityId && periodsData.some(p => CHECKS_STAGES.includes(p.workflowStage));

    return (
        <div className="time-periods-page">
            {/* ── Page header ─────────────────────────────────────────────── */}
            <div className="page-header">
                <div className="page-header-info">
                    <div>
                        <h1 className="page-title">{t('department.timePeriodsTitle')}</h1>
                        <p className="page-subtitle">{t('department.timePeriodsSubtitle')}</p>
                    </div>
                </div>
            </div>

            {/* ── Speciality selector ─────────────────────────────────────── */}
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
                <span className="selector-label" style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    {t("student.specialty")}:
                </span>
                <select
                    className="speciality-select"
                    value={selectedSpecialityId || ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectedSpecialityId(val ? Number(val) : null);
                        setLocalPeriods([]);
                        setLocalChecksPeriods([]);
                        setHasUnsavedChanges(false);
                        setHasUnsavedChecksChanges(false);
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

            {/* ════════════════════════════════════════════════════════════════
                SECTION 1 — Defense periods (PreDefense 1/2/3 + FinalDefense)
            ════════════════════════════════════════════════════════════════ */}
            <div style={{ marginBottom: "2.5rem" }}>
                <div className="page-header" style={{ marginBottom: "1rem" }}>
                    <div>
                        <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", margin: 0 }}>
                            {t('department.timePeriodsTitle')}
                        </h2>
                        <p style={{ fontSize: "0.875rem", color: "#6B7280", margin: "4px 0 0" }}>
                            {t('department.timePeriodsSubtitle')}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        {hasDefenseOverride && !hasUnsavedChanges && (
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
                                {t('common.save', 'Сохранить')}
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

                {selectedSpecialityId && !hasDefenseOverride && !hasUnsavedChanges && (
                    <div className="periods-form__order-error" style={{ color: "#1E3A8A", background: "#EFF6FF", borderColor: "#BFDBFE", marginBottom: "1rem" }}>
                        {t("department.usingInheritedDates", "Внимание: для данной специальности используются общие сроки кафедры.")}
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
                            <p>{t('department.periodsNotFound', 'Периоды не добавлены.')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 2 — Checks period (ChecksPeriod)
            ════════════════════════════════════════════════════════════════ */}
            <div style={{
                borderTop: "2px solid #E5E7EB",
                paddingTop: "2rem",
                marginBottom: "2.5rem"
            }}>
                <div className="page-header" style={{ marginBottom: "1rem" }}>
                    <div>
                        <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", margin: 0 }}>
                            {t('department.checksPeriodSectionTitle', 'Период проверок')}
                        </h2>
                        <p style={{ fontSize: "0.875rem", color: "#6B7280", margin: "4px 0 0" }}>
                            {t('department.checksPeriodSectionSubtitle', 'Настройка сроков нормоконтроля, антиплагиата и рецензирования')}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        {hasUnsavedChecksChanges && (
                            <button
                                className="button secondary-button"
                                onClick={() => setIsChecksConfirmOpen(true)}
                                disabled={checksMutation.isPending}
                            >
                                {t('common.save', 'Сохранить')}
                            </button>
                        )}
                        {!hasUnsavedChecksChanges && localChecksPeriods.length > 0 && (
                            <button
                                className="button primary-button"
                                style={{ background: "#059669" }}
                                onClick={() => setIsChecksConfirmOpen(true)}
                                disabled={checksMutation.isPending}
                            >
                                {t('department.approveChecksPeriods', 'Утвердить период проверок и экспертов')}
                            </button>
                        )}
                        {hasUnsavedChecksChanges && localChecksPeriods.length > 0 && (
                            <button
                                className="button primary-button"
                                style={{ background: "#059669" }}
                                onClick={() => setIsChecksConfirmOpen(true)}
                                disabled={checksMutation.isPending}
                            >
                                {t('department.approveChecksPeriods', 'Утвердить период проверок и экспертов')}
                            </button>
                        )}
                        <button
                            className="button primary-button"
                            style={{ background: "#0F766E" }}
                            onClick={() => setIsChecksDialogOpen(true)}
                        >
                            <img src={plusIcon} alt="Add" className="button-icon" />
                            {t('department.addChecksPeriod', 'Добавить период проверок')}
                        </button>
                    </div>
                </div>

                {hasChecksOverride && !hasUnsavedChecksChanges && (
                    <div className="periods-form__order-error" style={{ color: "#1E3A8A", background: "#EFF6FF", borderColor: "#BFDBFE", marginBottom: "1rem" }}>
                        {t("department.usingInheritedDates", "Внимание: для данной специальности используются общие сроки кафедры.")}
                    </div>
                )}

                <div className="periods-list">
                    {localChecksPeriods.map((period) => (
                        <TimePeriodCard
                            key={period.id}
                            period={period}
                            onDelete={() => deleteChecksPeriod(period.id)}
                        />
                    ))}
                    {localChecksPeriods.length === 0 && (
                        <div className="empty-state">
                            <p>{t('department.periodsNotFound', 'Период проверок не задан.')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Dialogs ──────────────────────────────────────────────────── */}
            {/* Defense periods dialog */}
            <TimePeriodFormDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleAddPeriod}
                allowedStages={DEFENSE_STAGES}
            />

            {/* Checks period dialog */}
            <TimePeriodFormDialog
                isOpen={isChecksDialogOpen}
                onClose={() => setIsChecksDialogOpen(false)}
                onSubmit={handleAddChecksPeriod}
                allowedStages={CHECKS_STAGES}
            />

            {/* Defense approve confirm */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                title={t("department.approveDefensePeriods", "Утвердить периоды защит")}
                message={t("department.periodsApproved", "Вы уверены, что хотите утвердить эти периоды?")}
                onConfirm={handleSaveAndApprove}
                onCancel={() => setIsConfirmOpen(false)}
            />

            {/* Checks approve confirm */}
            <ConfirmModal
                isOpen={isChecksConfirmOpen}
                title={t("department.approveChecksPeriods", "Утвердить период проверок и экспертов")}
                message={t("department.checksPeriodsApproveConfirm", "Утвердить период проверок? Это зафиксирует сроки нормоконтроля, антиплагиата и рецензирования.")}
                onConfirm={handleSaveAndApproveChecks}
                onCancel={() => setIsChecksConfirmOpen(false)}
            />
        </div>
    );
}
