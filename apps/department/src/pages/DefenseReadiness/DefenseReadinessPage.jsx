"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal, useAuth, useDefenseReadiness, useAdmitToDefense } from "@awm/shared";
import "./DefenseReadinessPage.css";
import documentCheckIcon from "../../assets/icons/document-check-icon.svg";

const CHECK_ICONS = {
    true: "✅",
    false: "⏳"
};

function allChecksPassed(student) {
    return (
        student.normocontrolPassed &&
        student.antiplagiarismPassed &&
        student.reviewPassed &&
        student.supervisorReviewPassed
    );
}

function getAdmissionStatus(student) {
    if (student.admitted) return "admitted";
    if (allChecksPassed(student)) return "in-progress";
    return "not-admitted";
}

export default function DefenseReadinessPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: students = [], isLoading } = useDefenseReadiness({ orgUnitId, semesterId });
    const admitMutation = useAdmitToDefense();

    const [selectedIds, setSelectedIds] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, isBulk: false, studentId: null });

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
                    if (s && allChecksPassed(s) && !s.admitted) {
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
        return students.filter((s) => selectedIds.includes(s.workId) && allChecksPassed(s) && !s.admitted).length;
    }, [students, selectedIds]);

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
                            <th>{t("department.normocontrol")}</th>
                            <th>{t("department.antiplagiarism")}</th>
                            <th>{t("department.reviewCheck")}</th>
                            <th>{t("department.supervisorReview")}</th>
                            <th>{t("department.admissionStatus")}</th>
                            <th>{t("department.actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, idx) => {
                            const status = getAdmissionStatus(student);
                            const canAdmit = allChecksPassed(student) && !student.admitted;

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
                                    <td className="dr-check-icon">{CHECK_ICONS[student.normocontrolPassed]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.antiplagiarismPassed]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.reviewPassed]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.supervisorReviewPassed]}</td>
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
