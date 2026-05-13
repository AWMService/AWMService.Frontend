"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@awm/shared";
import "./DefenseReadinessPage.css";
import documentCheckIcon from "../../assets/icons/document-check-icon.svg";

const CHECK_STATUS = { PASSED: "passed", FAILED: "failed", PENDING: "pending" };

const CHECK_ICONS = {
    [CHECK_STATUS.PASSED]: "✅",
    [CHECK_STATUS.FAILED]: "❌",
    [CHECK_STATUS.PENDING]: "⏳",
};

const INITIAL_STUDENTS = [
    { id: 1, name: "Иванов Алексей Петрович", topic: "Разработка веб-приложения для управления проектами", normocontrol: CHECK_STATUS.PASSED, antiplagiarism: CHECK_STATUS.PASSED, review: CHECK_STATUS.PASSED, supervisorReview: CHECK_STATUS.PASSED, admitted: true },
    { id: 2, name: "Петрова Мария Сергеевна", topic: "Анализ данных с использованием машинного обучения", normocontrol: CHECK_STATUS.PASSED, antiplagiarism: CHECK_STATUS.PASSED, review: CHECK_STATUS.PENDING, supervisorReview: CHECK_STATUS.PASSED, admitted: false },
    { id: 3, name: "Сидоров Дмитрий Николаевич", topic: "Мобильное приложение для мониторинга здоровья", normocontrol: CHECK_STATUS.FAILED, antiplagiarism: CHECK_STATUS.PASSED, review: CHECK_STATUS.PASSED, supervisorReview: CHECK_STATUS.FAILED, admitted: false },
    { id: 4, name: "Козлова Анна Владимировна", topic: "Система автоматического тестирования ПО", normocontrol: CHECK_STATUS.PASSED, antiplagiarism: CHECK_STATUS.PASSED, review: CHECK_STATUS.PASSED, supervisorReview: CHECK_STATUS.PASSED, admitted: true },
    { id: 5, name: "Морозов Артём Игоревич", topic: "Нейросетевой подход к распознаванию образов", normocontrol: CHECK_STATUS.PASSED, antiplagiarism: CHECK_STATUS.PENDING, review: CHECK_STATUS.PENDING, supervisorReview: CHECK_STATUS.PASSED, admitted: false },
    { id: 6, name: "Волкова Елена Дмитриевна", topic: "Блокчейн-платформа для верификации документов", normocontrol: CHECK_STATUS.PASSED, antiplagiarism: CHECK_STATUS.PASSED, review: CHECK_STATUS.PASSED, supervisorReview: CHECK_STATUS.PASSED, admitted: true },
    { id: 7, name: "Новиков Кирилл Андреевич", topic: "Оптимизация баз данных для высоконагруженных систем", normocontrol: CHECK_STATUS.PENDING, antiplagiarism: CHECK_STATUS.PASSED, review: CHECK_STATUS.FAILED, supervisorReview: CHECK_STATUS.PENDING, admitted: false },
    { id: 8, name: "Фёдорова Ольга Михайловна", topic: "IoT-система умного дома на базе Raspberry Pi", normocontrol: CHECK_STATUS.PASSED, antiplagiarism: CHECK_STATUS.FAILED, review: CHECK_STATUS.PASSED, supervisorReview: CHECK_STATUS.PASSED, admitted: false },
    { id: 9, name: "Егоров Максим Юрьевич", topic: "Платформа электронного обучения с геймификацией", normocontrol: CHECK_STATUS.PASSED, antiplagiarism: CHECK_STATUS.PASSED, review: CHECK_STATUS.PASSED, supervisorReview: CHECK_STATUS.PASSED, admitted: true },
    { id: 10, name: "Соколова Виктория Александровна", topic: "Разработка CRM-системы для малого бизнеса", normocontrol: CHECK_STATUS.PASSED, antiplagiarism: CHECK_STATUS.PASSED, review: CHECK_STATUS.PASSED, supervisorReview: CHECK_STATUS.PASSED, admitted: true },
    { id: 11, name: "Лебедев Павел Романович", topic: "Система распознавания речи на основе трансформеров", normocontrol: CHECK_STATUS.FAILED, antiplagiarism: CHECK_STATUS.FAILED, review: CHECK_STATUS.FAILED, supervisorReview: CHECK_STATUS.FAILED, admitted: false },
    { id: 12, name: "Кузнецова Дарья Олеговна", topic: "Автоматизация CI/CD пайплайнов для микросервисов", normocontrol: CHECK_STATUS.PASSED, antiplagiarism: CHECK_STATUS.PENDING, review: CHECK_STATUS.PASSED, supervisorReview: CHECK_STATUS.PENDING, admitted: false },
];

function allChecksPassed(student) {
    return (
        student.normocontrol === CHECK_STATUS.PASSED &&
        student.antiplagiarism === CHECK_STATUS.PASSED &&
        student.review === CHECK_STATUS.PASSED &&
        student.supervisorReview === CHECK_STATUS.PASSED
    );
}

function getAdmissionStatus(student) {
    if (student.admitted) return "admitted";
    const checks = [student.normocontrol, student.antiplagiarism, student.review, student.supervisorReview];
    if (checks.some((c) => c === CHECK_STATUS.FAILED)) return "not-admitted";
    return "in-progress";
}

export default function DefenseReadinessPage() {
    const { t } = useTranslation();
    const [students, setStudents] = useState(INITIAL_STUDENTS);
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
            setSelectedIds(students.map((s) => s.id));
        }
    };

    const handleAdmit = (studentId) => {
        setConfirmModal({ isOpen: true, isBulk: false, studentId });
    };

    const handleBulkAdmit = () => {
        setConfirmModal({ isOpen: true, isBulk: true, studentId: null });
    };

    const confirmAdmit = () => {
        if (confirmModal.isBulk) {
            setStudents((prev) =>
                prev.map((s) =>
                    selectedIds.includes(s.id) && allChecksPassed(s)
                        ? { ...s, admitted: true }
                        : s
                )
            );
            setSelectedIds([]);
        } else if (confirmModal.studentId) {
            setStudents((prev) =>
                prev.map((s) =>
                    s.id === confirmModal.studentId ? { ...s, admitted: true } : s
                )
            );
        }
        setConfirmModal({ isOpen: false, isBulk: false, studentId: null });
    };

    const eligibleSelectedCount = useMemo(() => {
        return students.filter((s) => selectedIds.includes(s.id) && allChecksPassed(s) && !s.admitted).length;
    }, [students, selectedIds]);

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
                                <tr key={student.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="dr-checkbox"
                                            checked={selectedIds.includes(student.id)}
                                            onChange={() => toggleSelect(student.id)}
                                        />
                                    </td>
                                    <td>{idx + 1}</td>
                                    <td className="dr-student-name">{student.name}</td>
                                    <td className="dr-topic" title={student.topic}>{student.topic}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.normocontrol]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.antiplagiarism]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.review]}</td>
                                    <td className="dr-check-icon">{CHECK_ICONS[student.supervisorReview]}</td>
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
                                            onClick={() => handleAdmit(student.id)}
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
