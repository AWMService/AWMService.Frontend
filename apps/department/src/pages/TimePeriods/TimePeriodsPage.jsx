import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Calendar, Trash2, Settings, CalendarClock, Plus, AlertCircle, RefreshCw } from "lucide-react";
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

import { TimePeriodFormDialog } from "@awm/shared";

const PRE_DEFENSE_STAGES  = ["PreDefense1", "PreDefense2", "PreDefense3"];
const FINAL_DEFENSE_STAGES = ["FinalDefense", "ChecksPeriod"];

// Premium Local Stage Card component
function StageCard({ period, onDelete, onSetup, onEdit }) {
    const { t } = useTranslation();
    const isChecks = period.stageKey === "ChecksPeriod";
    const isFinal = period.stageKey === "FinalDefense";
    
    // Choose status colors based on stage types
    let statusColor = "#3b82f6"; // blue (PreDefense1)
    if (period.stageKey === "PreDefense2") statusColor = "#f59e0b"; // amber
    if (period.stageKey === "PreDefense3") statusColor = "#ef4444"; // red
    if (isChecks) statusColor = "#0f766e"; // teal
    if (isFinal) statusColor = "#10b981"; // emerald

    return (
        <div className="premium-stage-card">
            <div className="stage-card-header">
                <div className="title-section">
                    <h3 className="stage-card-title">{period.name}</h3>
                    <div className="stage-card-dates">
                        <Calendar size={14} />
                        <span>{period.startDate} — {period.endDate}</span>
                    </div>
                </div>
                <div className="actions-section">
                    <span className="stage-status-pill" style={{ color: statusColor, backgroundColor: statusColor + "12", borderColor: statusColor + "25" }}>
                        {t('commission.statusUpcoming', 'Предстоит')}
                    </span>
                    <button className="stage-delete-btn" onClick={onDelete} title={t('common.delete', 'Удалить')}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="stage-progress-section">
                <div className="stage-progress-bar-container">
                    <div className="stage-progress-fill" style={{ width: `${period.progress}%`, backgroundColor: statusColor }} />
                </div>
                <span className="stage-progress-label">{period.progress}%</span>
            </div>

            <div className="stage-meta-grid">
                <div className="meta-item">
                    <span className="meta-count">{period.commissions}</span>
                    <span className="meta-label">{t('commission.commissions', 'Комиссии')}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-count">{period.students}</span>
                    <span className="meta-label">{t('commission.students', 'Студенты')}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-count">{period.dates}</span>
                    <span className="meta-label">{t('common.date', 'Дата')}</span>
                </div>
            </div>

            <div className="stage-actions-row">
                <button className="stage-action-btn primary" onClick={onSetup}>
                    <Settings size={14} />
                    <span>{t('department.setupPeriod', 'Настройка этапа')}</span>
                </button>
                <button className="stage-action-btn secondary" onClick={onEdit}>
                    <CalendarClock size={14} />
                    <span>{t('common.edit', 'Редактировать')}</span>
                </button>
            </div>
        </div>
    );
}

export default function TimePeriodsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const orgUnitId  = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    // Speciality selector
    const [selectedSpecialityId, setSelectedSpecialityId] = useState(null);

    // Pre-defense periods state (Stage 7)
    const [localPreDefensePeriods, setLocalPreDefensePeriods] = useState([]);
    const [hasUnsavedPDChanges, setHasUnsavedPDChanges]       = useState(false);
    const [isPDDialogOpen, setIsPDDialogOpen]                 = useState(false);
    const [isPDConfirmOpen, setIsPDConfirmOpen]               = useState(false);

    // Final defense & Checks periods state (Stage 9)
    const [localFinalDefensePeriods, setLocalFinalDefensePeriods]     = useState([]);
    const [hasUnsavedFDChanges, setHasUnsavedFDChanges]               = useState(false);
    const [isFDDialogOpen, setIsFDDialogOpen]                         = useState(false);
    const [isFDConfirmOpen, setIsFDConfirmOpen]                       = useState(false);

    // Edit dialog states
    const [editingPDPeriod, setEditingPDPeriod] = useState(null);
    const [editingFDPeriod, setEditingFDPeriod] = useState(null);

    // Queries
    const { data: specialities = [] }           = useOrgUnitSpecialities(orgUnitId);
    const { data: periodsData = [], isLoading } = usePeriods(orgUnitId, semesterId, selectedSpecialityId);

    // Mutations
    const approvePDMutation = useApproveDefensePeriods(orgUnitId, semesterId, selectedSpecialityId);
    const approveFDMutation = useApproveChecksPeriods(orgUnitId, semesterId, selectedSpecialityId);
    const resetMutation     = useResetStagesOverride(orgUnitId, semesterId);

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
        commissions: p.commissionsCount || 0,
        students:    p.studentsCount || 0,
        dates:       p.datesCount || 0,
        progress:    p.progress || 0,
        status:      "upcoming",
    });

    useEffect(() => {
        if (periodsData && periodsData.length > 0) {
            setLocalPreDefensePeriods(
                periodsData.filter(p => PRE_DEFENSE_STAGES.includes(p.workflowStage)).map(mapPeriod)
            );
            setLocalFinalDefensePeriods(
                periodsData.filter(p => FINAL_DEFENSE_STAGES.includes(p.workflowStage)).map(mapPeriod)
            );
            setHasUnsavedPDChanges(false);
            setHasUnsavedFDChanges(false);
        } else {
            setLocalPreDefensePeriods([]);
            setLocalFinalDefensePeriods([]);
            setHasUnsavedPDChanges(false);
            setHasUnsavedFDChanges(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [periodsData]);

    // ── Stage 7 handlers ──────────────────────────────────────────────────
    const openPDEdit = (period) => {
        setEditingPDPeriod(period);
        setIsPDDialogOpen(true);
    };

    const handleAddPDPeriod = (formData) => {
        if (editingPDPeriod) {
            setLocalPreDefensePeriods(prev => prev.map(p => 
                p.id === editingPDPeriod.id ? { ...p, startDate: formData.startDate, endDate: formData.endDate, stageKey: formData.name, name: stageLabel(formData.name) } : p
            ));
        } else {
            setLocalPreDefensePeriods(prev => [...prev, {
                id:        `new-pd-${Date.now()}`,
                name:      stageLabel(formData.name),
                stageKey:  formData.name,
                startDate: formData.startDate,
                endDate:   formData.endDate,
                commissions: 0, students: 0, dates: 0, progress: 0, status: "upcoming",
            }]);
        }
        setEditingPDPeriod(null);
        setHasUnsavedPDChanges(true);
        setIsPDDialogOpen(false);
    };

    const deletePDPeriod = (id) => {
        setLocalPreDefensePeriods(prev => prev.filter(p => p.id !== id));
        setHasUnsavedPDChanges(true);
    };

    const handleSaveAndApprovePD = async () => {
        const payload = localPreDefensePeriods.map(p => ({
            workflowStage: p.stageKey,
            startDate:     new Date(p.startDate).toISOString(),
            endDate:       new Date(p.endDate).toISOString(),
        }));
        try {
            await approvePDMutation.mutateAsync(payload);
            setHasUnsavedPDChanges(false);
            setIsPDConfirmOpen(false);
        } catch (err) {
            console.error("Failed to approve Stage 7 periods", err);
        }
    };

    // ── Stage 9 handlers ──────────────────────────────────────────────────
    const openFDEdit = (period) => {
        setEditingFDPeriod(period);
        setIsFDDialogOpen(true);
    };

    const handleAddFDPeriod = (formData) => {
        if (editingFDPeriod) {
            setLocalFinalDefensePeriods(prev => prev.map(p => 
                p.id === editingFDPeriod.id ? { ...p, startDate: formData.startDate, endDate: formData.endDate, stageKey: formData.name, name: stageLabel(formData.name) } : p
            ));
        } else {
            setLocalFinalDefensePeriods(prev => [...prev, {
                id:        `new-fd-${Date.now()}`,
                name:      stageLabel(formData.name),
                stageKey:  formData.name,
                startDate: formData.startDate,
                endDate:   formData.endDate,
                commissions: 0, students: 0, dates: 0, progress: 0, status: "upcoming",
            }]);
        }
        setEditingFDPeriod(null);
        setHasUnsavedFDChanges(true);
        setIsFDDialogOpen(false);
    };

    const deleteFDPeriod = (id) => {
        setLocalFinalDefensePeriods(prev => prev.filter(p => p.id !== id));
        setHasUnsavedFDChanges(true);
    };

    const handleSaveAndApproveFD = async () => {
        const payload = localFinalDefensePeriods.map(p => ({
            workflowStage: p.stageKey,
            startDate:     new Date(p.startDate).toISOString(),
            endDate:       new Date(p.endDate).toISOString(),
        }));
        try {
            await approveFDMutation.mutateAsync(payload);
            setHasUnsavedFDChanges(false);
            setIsFDConfirmOpen(false);
        } catch (err) {
            console.error("Failed to approve Stage 9 periods", err);
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
        return <div className="time-periods-page"><div className="loader-pulse">{t('common.loading', 'Загрузка...')}</div></div>;
    }

    if (!orgUnitId || !semesterId) {
        return <div className="time-periods-page"><p>{t('department.noDepartmentSelected', 'Кафедра или учебный год не выбраны.')}</p></div>;
    }

    const hasPDOverride = selectedSpecialityId && periodsData.some(p => PRE_DEFENSE_STAGES.includes(p.workflowStage));
    const hasFDOverride = selectedSpecialityId && periodsData.some(p => FINAL_DEFENSE_STAGES.includes(p.workflowStage));

    return (
        <div className="time-periods-page">
            {/* ── Speciality selector ─────────────────────────────────────── */}
            <div className="speciality-selector-wrapper">
                <span className="selector-label">
                    {t("student.specialty")}:
                </span>
                <select
                    className="speciality-select"
                    value={selectedSpecialityId || ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectedSpecialityId(val ? Number(val) : null);
                        setLocalPreDefensePeriods([]);
                        setLocalFinalDefensePeriods([]);
                        setHasUnsavedPDChanges(false);
                        setHasUnsavedFDChanges(false);
                    }}
                >
                    <option value="">{t("department.allSpecialities", "Общее для кафедры (По умолчанию)")}</option>
                    {specialities.map(s => (
                        <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                    ))}
                </select>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 1 — Stage 7: Pre-defense periods
            ════════════════════════════════════════════════════════════════ */}
            <div className="dashboard-section">
                <div className="section-header">
                    <div className="section-title-wrapper">
                        <h2 className="section-title">
                            {t('department.stage7Title', 'Этап 7: Предзащиты')}
                        </h2>
                        <p className="section-subtitle">
                            {t('department.stage7Subtitle', 'Утверждение периодов предзащит и комиссий')}
                        </p>
                    </div>
                    <div className="section-actions">
                        {hasPDOverride && !hasUnsavedPDChanges && (
                            <button
                                className="button reset-button"
                                onClick={handleResetOverride}
                            >
                                <RefreshCw size={14} style={{ marginRight: '6px' }} />
                                {t('department.resetToDefaults', 'Сбросить к общим срокам')}
                            </button>
                        )}
                        {hasUnsavedPDChanges && (
                            <button
                                className="button save-btn ripple-effect"
                                onClick={() => setIsPDConfirmOpen(true)}
                                disabled={approvePDMutation.isPending}
                            >
                                {t('common.save', 'Сохранить')}
                            </button>
                        )}
                        <button
                            className="button primary-button ripple-effect"
                            onClick={() => setIsPDDialogOpen(true)}
                        >
                            <Plus size={16} style={{ marginRight: '6px' }} />
                            {t('department.addPeriod')}
                        </button>
                    </div>
                </div>

                {selectedSpecialityId && !hasPDOverride && !hasUnsavedPDChanges && (
                    <div className="inherited-dates-warning">
                        <AlertCircle size={18} />
                        <span>{t("department.usingInheritedDates", "Внимание: для данной специальности используются общие сроки кафедры.")}</span>
                    </div>
                )}

                <div className="stage-cards-grid">
                    {localPreDefensePeriods.map((period) => (
                        <StageCard
                            key={period.id}
                            period={period}
                            onDelete={() => deletePDPeriod(period.id)}
                            onSetup={() => navigate(`/defenses?tab=distribution&stageId=${period.id}`)}
                            onEdit={() => openPDEdit(period)}
                        />
                    ))}
                    {localPreDefensePeriods.length === 0 && (
                        <div className="empty-state">
                            <p>{t('department.periodsNotFound', 'Периоды не добавлены.')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 2 — Stage 9: Experts and Final Defense
            ════════════════════════════════════════════════════════════════ */}
            <div className="dashboard-section stage-9-section">
                <div className="section-header">
                    <div className="section-title-wrapper">
                        <h2 className="section-title">
                            {t('department.stage9Title', 'Этап 9: Эксперты и защиты')}
                        </h2>
                        <p className="section-subtitle">
                            {t('department.stage9Subtitle', 'Настройка сроков проверок, рецензирования и финальной защиты')}
                        </p>
                    </div>
                    <div className="section-actions">
                        {hasUnsavedFDChanges && (
                            <button
                                className="button save-btn ripple-effect"
                                onClick={() => setIsFDConfirmOpen(true)}
                                disabled={approveFDMutation.isPending}
                            >
                                {t('common.save', 'Сохранить')}
                            </button>
                        )}
                        {!hasUnsavedFDChanges && localFinalDefensePeriods.length > 0 && (
                            <button
                                className="button approve-all-btn ripple-effect"
                                onClick={() => setIsFDConfirmOpen(true)}
                                disabled={approveFDMutation.isPending}
                            >
                                {t('department.approveFinalStages', 'Утвердить экспертов и периоды')}
                            </button>
                        )}
                        <button
                            className="button secondary-button ripple-effect"
                            onClick={() => setIsFDDialogOpen(true)}
                        >
                            <Plus size={16} style={{ marginRight: '6px' }} />
                            {t('department.addPeriod')}
                        </button>
                    </div>
                </div>

                {hasFDOverride && !hasUnsavedFDChanges && (
                    <div className="inherited-dates-warning">
                        <AlertCircle size={18} />
                        <span>{t("department.usingInheritedDates", "Внимание: для данной специальности используются общие сроки кафедры.")}</span>
                    </div>
                )}

                <div className="stage-cards-grid">
                    {localFinalDefensePeriods.map((period) => (
                        <StageCard
                            key={period.id}
                            period={period}
                            onDelete={() => deleteFDPeriod(period.id)}
                            onSetup={() => navigate(`/defenses?tab=distribution&stageId=${period.id}`)}
                            onEdit={() => openFDEdit(period)}
                        />
                    ))}
                    {localFinalDefensePeriods.length === 0 && (
                        <div className="empty-state">
                            <p>{t('department.periodsNotFound', 'Периоды не заданы.')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Dialogs ──────────────────────────────────────────────────── */}
            <TimePeriodFormDialog
                isOpen={isPDDialogOpen}
                onClose={() => { setIsPDDialogOpen(false); setEditingPDPeriod(null); }}
                onSubmit={handleAddPDPeriod}
                allowedStages={PRE_DEFENSE_STAGES}
                editingPeriod={editingPDPeriod}
            />

            <TimePeriodFormDialog
                isOpen={isFDDialogOpen}
                onClose={() => { setIsFDDialogOpen(false); setEditingFDPeriod(null); }}
                onSubmit={handleAddFDPeriod}
                allowedStages={FINAL_DEFENSE_STAGES}
                editingPeriod={editingFDPeriod}
            />

            <ConfirmModal
                isOpen={isPDConfirmOpen}
                title={t("department.approvePDTitle", "Утвердить периоды предзащит")}
                message={t("department.periodsApproved", "Вы уверены, что хотите утвердить эти периоды?")}
                onConfirm={handleSaveAndApprovePD}
                onCancel={() => setIsPDConfirmOpen(false)}
            />

            <ConfirmModal
                isOpen={isFDConfirmOpen}
                title={t("department.approveFDTitle", "Утвердить экспертов и периоды защиты")}
                message={t("department.checksPeriodsApproveConfirm", "Утвердить период проверок? Это зафиксирует сроки нормоконтроля, антиплагиата и рецензирования.")}
                onConfirm={handleSaveAndApproveFD}
                onCancel={() => setIsFDConfirmOpen(false)}
            />
        </div>
    );
}
