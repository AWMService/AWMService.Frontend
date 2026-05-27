"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale, useAuth, useCommissions, useDefenseSchedule, useAutoDistributeStudents } from "@awm/shared";
import "./StudentDistributionPage.css";
import usersIcon from "../../assets/icons/users-icon.svg";

function generateTimeSlots() {
    const slots = [];
    for (let h = 9; h < 17; h++) {
        for (let m = 0; m < 60; m += 30) {
            const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            slots.push(time);
        }
    }
    return slots;
}

const TIME_SLOTS = generateTimeSlots();

export default function StudentDistributionPage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const { user } = useAuth();

    const [commissionMode, setCommissionMode] = useState('predefense'); // 'predefense' | 'gak'
    const [filterCommission, setFilterCommission] = useState("all");
    const [filterDate, setFilterDate] = useState("");
    const [distributePdNumber, setDistributePdNumber] = useState(1);

    const departmentId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: commissions = [], isLoading: isCommissionsLoading } = useCommissions(departmentId, semesterId);
    const autoDistributeMutation = useAutoDistributeStudents();

    // Filter commissions by current mode (commissionTypeId: 1=PreDefense, 2=GAK)
    const commissionsForMode = useMemo(
        () => commissions.filter(c => commissionMode === 'gak' ? c.commissionTypeId === 2 : c.commissionTypeId === 1),
        [commissions, commissionMode]
    );

    const handleAutoDistribute = async () => {
        try {
            await autoDistributeMutation.mutateAsync({
                orgUnitId: departmentId,
                semesterId: semesterId,
                commissionTypeId: commissionMode === 'gak' ? 2 : 1,
                preDefenseNumber: commissionMode === 'predefense' ? distributePdNumber : undefined
            });
            alert(t('department.distributionSuccess', 'Студенты успешно распределены!'));
        } catch (error) {
            console.error('Failed to distribute students', error);
            alert(error?.message || t('department.distributionFailed', 'Ошибка при распределении'));
        }
    };

    // Reset commission filter when mode changes
    const handleModeChange = (mode) => {
        setCommissionMode(mode);
        setFilterCommission("all");
    };

    // Get selected commission ID
    const selectedCommissionId = filterCommission !== "all"
        ? Number(filterCommission)
        : commissionsForMode[0]?.id;

    const { data: schedule = [], isLoading: isScheduleLoading } = useDefenseSchedule(selectedCommissionId);

    // Build students from schedule data (assigned works)
    const students = useMemo(() => {
        if (!schedule) return [];
        return schedule
            .filter(slot => slot.studentWorkId)
            .map((slot, idx) => ({
                id: slot.studentWorkId || idx,
                name: slot.studentName || t('department.student'),
                topic: slot.topicTitle || t('department.topic'),
                commissionId: String(selectedCommissionId),
                assignedSlot: slot.startTime,
                assignedDate: slot.date || slot.defenseDate,
            }));
    }, [schedule, selectedCommissionId, t]);

    const filteredStudents = useMemo(() => {
        return students.filter((s) => {
            if (filterCommission !== "all" && String(s.commissionId) !== filterCommission) return false;
            if (filterDate && s.assignedDate !== filterDate) return false;
            return true;
        });
    }, [students, filterCommission, filterDate]);

    const slotCounts = useMemo(() => {
        const counts = {};
        commissionsForMode.forEach((c) => {
            const commStudents = students.filter((s) => String(s.commissionId) === String(c.id));
            const assigned = commStudents.filter((s) => s.assignedSlot).length;
            counts[c.id] = { assigned, total: TIME_SLOTS.length };
        });
        return counts;
    }, [commissionsForMode, students]);

    const getCommissionName = (id) => commissions.find((c) => String(c.id) === String(id))?.name || id;

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    if (isCommissionsLoading || isScheduleLoading) {
        return (
            <div className="student-distribution-page">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className="student-distribution-page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="page-header-info">
                    <div className="page-header-icon-bg">
                        <img src={usersIcon} alt="" className="page-header-icon" />
                    </div>
                    <div>
                        <h1 className="page-title">{t("department.studentDistributionTitle")}</h1>
                        <p className="page-subtitle">{t("department.studentDistributionSubtitle")}</p>
                    </div>
                </div>

                {/* Auto-distribute controls */}
                <div className="sd-auto-distribute-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {commissionMode === 'predefense' && (
                        <select
                            value={distributePdNumber}
                            onChange={(e) => setDistributePdNumber(Number(e.target.value))}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                backgroundColor: '#fff',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        >
                            <option value={1}>{t('department.preDefense1', 'Предзащита 1')}</option>
                            <option value={2}>{t('department.preDefense2', 'Предзащита 2')}</option>
                            <option value={3}>{t('department.preDefense3', 'Предзащита 3')}</option>
                        </select>
                    )}
                    <button
                        onClick={handleAutoDistribute}
                        disabled={autoDistributeMutation.isPending}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#4f46e5',
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                    >
                        {autoDistributeMutation.isPending
                            ? t('common.loading', 'Загрузка...')
                            : t('department.autoDistribute', 'Автораспределение')}
                    </button>
                </div>
            </div>

            {/* Mode toggle tabs */}
            <div className="sd-mode-tabs">
                <button
                    className={`sd-mode-tab${commissionMode === 'predefense' ? ' active' : ''}`}
                    onClick={() => handleModeChange('predefense')}
                >
                    {t('department.modePreDefense', 'Предзащиты')}
                </button>
                <button
                    className={`sd-mode-tab${commissionMode === 'gak' ? ' active' : ''}`}
                    onClick={() => handleModeChange('gak')}
                >
                    {t('department.modeGak', 'ГАК (Финальная защита)')}
                </button>
            </div>

            {/* Filter bar */}
            <div className="sd-filter-bar">
                <select
                    className="sd-filter-select"
                    value={filterCommission}
                    onChange={(e) => setFilterCommission(e.target.value)}
                >
                    <option value="all">{t("department.allCommissions")}</option>
                    {commissionsForMode.map((c) => (
                        <option key={c.id} value={String(c.id)}>{c.name}</option>
                    ))}
                </select>
                <input
                    type="date"
                    className="sd-filter-date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            {/* Slot fill indicators */}
            <div className="sd-slot-indicators">
                {commissionsForMode.map((c) => {
                    const { assigned, total } = slotCounts[c.id] || { assigned: 0, total: 0 };
                    const pct = total > 0 ? (assigned / total) * 100 : 0;
                    return (
                        <div key={c.id} className="sd-slot-indicator">
                            <span>{c.name}:</span>
                            <span>{t("department.slotsFilledCount", { filled: assigned, total })}</span>
                            <div className="sd-slot-indicator-bar">
                                <div className="sd-slot-indicator-fill" style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                    );
                })}
                {commissionsForMode.length === 0 && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {commissionMode === 'gak'
                            ? t('department.noGakCommissions', 'Комиссии ГАК не созданы. Создайте их на странице «Комиссии».')
                            : t('department.noPreDefenseCommissions', 'Комиссии предзащит не созданы.')}
                    </p>
                )}
            </div>

            {/* Table */}
            <div className="sd-table-wrapper">
                <table className="sd-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>{t("department.student")}</th>
                            <th>{t("department.topic")}</th>
                            <th>{t("department.commission")}</th>
                            <th>{t("department.dateTimeSlot")}</th>
                            <th>{t("department.actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student, idx) => (
                            <tr key={student.id}>
                                <td>{idx + 1}</td>
                                <td className="sd-student-name">{student.name}</td>
                                <td className="sd-topic" title={student.topic}>{student.topic}</td>
                                <td>
                                    <span className="sd-commission-badge">
                                        {getCommissionName(student.commissionId)}
                                    </span>
                                </td>
                                <td>
                                    {student.assignedSlot ? (
                                        <span className="sd-assigned-time">
                                            {formatDate(student.assignedDate)} {student.assignedSlot}
                                        </span>
                                    ) : (
                                        "—"
                                    )}
                                </td>
                                <td>
                                    <span className="sd-assigned-slot">
                                        {t("department.assigned")}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>{t('common.noData')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
