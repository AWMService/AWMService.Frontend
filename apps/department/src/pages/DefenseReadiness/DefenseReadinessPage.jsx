"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConfirmModal, useAuth, useDefenseReadiness, useAdmitToDefense, useActiveCheckConfigurations } from "@awm/shared";
import "./DefenseReadinessPage.css";
import documentCheckIcon from "../../assets/icons/document-check-icon.svg";

const CHECK_ICONS = {
    true: "✅",
    false: "⏳"
};

function allChecksPassed(student, requiresSW = false) {
    return (
        student.preDefensePassed &&
        student.normocontrolPassed &&
        student.antiplagiarismPassed &&
        student.reviewPassed &&
        student.supervisorReviewPassed &&
        (!requiresSW || student.softwareCheckPassed)
    );
}

function getAdmissionStatus(student) {
    if (student.admitted) return "admitted";
    if (allChecksPassed(student)) return "in-progress";
    return "not-admitted";
}

export default function DefenseReadinessPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: students = [], isLoading } = useDefenseReadiness({ orgUnitId, semesterId });
    const admitMutation = useAdmitToDefense();
    const { data: activeConfigs } = useActiveCheckConfigurations(orgUnitId);
    const requiresSoftwareCheck = activeConfigs?.some(c => c.checkTypeCode === 'SOFTWARECHECK') ?? false;

    const [selectedIds, setSelectedIds] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, isBulk: false, studentId: null });
    const [filter, setFilter] = useState('all'); // 'all' | 'ready' | 'admitted'

    const kpiCounts = useMemo(() => {
        let admitted = 0, notAdmitted = 0, inProgress = 0;
        students.forEach((s) => {
            const status = getAdmissionStatus(s);
            if (status === "admitted") admitted++;
            else if (status === "not-admitted") notAdmitted++;
            else inProgress++;
        });
        return { admitted, notAdmitted, inProgress };
    }, [students]);

    const filteredStudents = useMemo(() => {
        if (filter === 'ready')    return students.filter(s => allChecksPassed(s, requiresSoftwareCheck) && !s.admitted);
        if (filter === 'admitted') return students.filter(s => s.admitted);
        return students;
    }, [students, filter, requiresSoftwareCheck]);

    const readyCount = useMemo(
        () => students.filter(s => allChecksPassed(s, requiresSoftwareCheck) && !s.admitted).length,
        [students, requiresSoftwareCheck]
    );

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === students.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(students.map((s) => s.workId));
        }
    };

    const handleAdmit = (studentId) => {
        setConfirmModal({ isOpen: true, isBulk: false, studentId });
    };

    const handleBulkAdmit = () => {
        setConfirmModal({ isOpen: true, isBulk: true, studentId: null });
    };

    const confirmAdmit = async () => {
        try {
            if (confirmModal.isBulk) {
                for (const id of selectedIds) {
                    const s = students.find((x) => x.workId === id);
                    if (s && allChecksPassed(s, requiresSoftwareCheck) && !s.admitted) {
                        await admitMutation.mutateAsync(id);
                    }
                }
                setSelectedIds([]);
            } else if (confirmModal.studentId) {
                await admitMutation.mutateAsync(confirmModal.studentId);
            }
        } catch (error) {
            console.error("Failed to admit student(s) to defense", error);
        }
        setConfirmModal({ isOpen: false, isBulk: false, studentId: null });
    };

    const eligibleSelectedCount = useMemo(() => {
        return students.filter((s) => selectedIds.includes(s.workId) && allChecksPassed(s, requiresSoftwareCheck) && !s.admitted).length;
    }, [students, selectedIds, requiresSoftwareCheck]);

    if (isLoading) {
        return (
            <div className="defense-readiness-page">
                <p>{t("common.loading")}</p>
            </div>
        );
    }

    return (
        <div className="defense-readiness-page">
            <div className="page-header">
                <div className="page-header-info">
                    <div className="page-header-icon-bg">
                        <img src={documentCheckIcon} alt="" className="page-header-icon" />
                    </div>
                    <div>
                        <h1 className="page-title">{t("department.defenseReadinessTitle")}</h1>
                        <p className="page-subtitle">{t("department.defenseReadinessSubtitle")}</p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="dr-kpi-cards">
                <div className="dr-kpi-card dr-kpi-card--green">
                    <span className="dr-kpi-label">{t("department.admittedToDefense")}</span>
                    <span className="dr-kpi-value dr-kpi-value--green">{kpiCounts.admitted}</span>
                </div>
                <div className="dr-kpi-card dr-kpi-card--red">
                    <span className="dr-kpi-label">{t("department.notAdmitted")}</span>
                    <span className="dr-kpi-value dr-kpi-value--red">{kpiCounts.notAdmitted}</span>
                </div>
                <div className="dr-kpi-card dr-kpi-card--yellow">
                    <span className="dr-kpi-label">{t("department.inProgress")}</span>
                    <span className="dr-kpi-value dr-kpi-value--yellow">{kpiCounts.inProgress}</span>
                </div>
            </div>

            {/* Bulk bar */}
            <div className="dr-bulk-bar">
                <span className="dr-selected-count">
                    {t("department.selectedCount", { count: selectedIds.length })}
                </span>
                <button
                    className="dr-admit-selected-btn"
                    disabled={eligibleSelectedCount === 0}
                    onClick={handleBulkAdmit}
                >
                    {t("department.admitSelected")} ({eligibleSelectedCount})
                </button>
            </div>

            {/* Next-step navigation */}
            <div className="dr-next-steps">
                <button className="dr-next-step-btn" onClick={() => navigate('/commissions?type=gak')}>
                    {t("department.createGakCommission")}
                </button>
                <button className="dr-next-step-btn" onClick={() => navigate('/student-distribution')}>
                    {t("department.setupDefenseSchedule")}
                </button>
            </div>

            {/* Filter tabs */}
            <div className="dr-filter-tabs">
                <button
                    className={`dr-filter-tab${filter === 'all' ? ' active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    {t('department.filterAll')} ({students.length})
                </button>
                <button
                    className={`dr-filter-tab${filter === 'ready' ? ' active' : ''}`}
                    onClick={() => setFilter('ready')}
                >
                    {t('department.filterReady')} ({readyCount})
                </button>
                <button
                    className={`dr-filter-tab${filter === 'admitted' ? ' active' : ''}`}
                    onClick={() => setFilter('admitted')}
                >
                    {t('department.filterAdmitted')} ({kpiCounts.admitted})
                </button>
            </div>

            {/* Table */}
            <div className="dr-table-wrapper">
                <table className="dr-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    className="dr-checkbox"
                                    checked={selectedIds.length === students.length && students.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>№</th>
                            <th>{t("department.student")}</th>
                            <th>{t("department.topic")}</th>
                            <th>{t("department.preDefense")}</th>
                            <th>{t("department.normocontrol")}</th>
                            <th>{t("department.antiplagiarism")}</th>
                            <th>{t("department.reviewCheck")}</th>
                            <th>{t("department.supervisorReview")}</th>
                            {requiresSoftwareCheck && <th>{t("department.softwareCheckColumn")}</th>}
                            <th>{t("department.admissionStatus")}</th>
                            <th>{t("department.actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student, idx) => {
                            const status = getAdmissionStatus(student);
                            const canAdmit = allChecksPassed(student, requiresSoftwareCheck) && !student.admitted;

                            return (
                                <tr key={student.workId}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="dr-checkbox"
                                            checked={selectedIds.includes(student.workId)}
                                            onChange={() => toggleSelect(student.workId)}
                                        />
                                    </td>
                                    <td>{idx + 1}</td>
                                    <td className="dr-student-name">{student.studentName}</td>
                                    <td className="dr-topic" title={student.topicTitle}>{student.topicTitle}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.preDefensePassed]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.normocontrolPassed]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.antiplagiarismPassed]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.reviewPassed]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.supervisorReviewPassed]}</td>
                                    {requiresSoftwareCheck && (
                                        <td className="dr-check-icon">{CHECK_ICONS[student.softwareCheckPassed]}</td>
                                    )}
                                    <td>
                                        {status === "admitted" && (
                                            <span className="dr-status-badge dr-status-badge--admitted">
                                                {t("department.admitted")}
                                            </span>
                                        )}
                                        {status === "not-admitted" && (
                                            <span className="dr-status-badge dr-status-badge--not-admitted">
                                                {t("department.notAdmittedStatus")}
                                            </span>
                                        )}
                                        {status === "in-progress" && (
                                            <span className="dr-status-badge dr-status-badge--in-progress">
                                                {t("department.inProgressStatus")}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="dr-admit-btn"
                                            disabled={!canAdmit}
                                            onClick={() => handleAdmit(student.workId)}
                                        >
                                            {t("department.admitToDefense")}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={t("department.confirmAdmission")}
                message={
                    confirmModal.isBulk
                        ? t("department.confirmBulkAdmission", { count: eligibleSelectedCount })
                        : t("department.confirmSingleAdmission")
                }
                onConfirm={confirmAdmit}
                onCancel={() => setConfirmModal({ isOpen: false, isBulk: false, studentId: null })}
                confirmText={t("department.admitToDefense")}
                cancelText={t("department.cancel")}
            />
        </div>
    );
}
