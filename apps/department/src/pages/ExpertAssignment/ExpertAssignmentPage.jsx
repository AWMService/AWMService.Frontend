"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./ExpertAssignmentPage.css";
import shieldCheckIcon from "../../assets/icons/shield-check-icon.svg";

const NORMOCONTROLLERS = ["Козлова Е.В.", "Морозова Е.А."];
const REVIEWERS = ["Волков Д.С.", "Лебедева Н.Н.", "Иванова А.П."];
const PLAGIARISM_EXPERTS = ["Сидорова М.И.", "Козлов В.П."];

const EXPERT_COLUMNS = [
    { key: "normocontroller", label: "department.normocontroller", staff: NORMOCONTROLLERS },
    { key: "reviewer", label: "department.reviewer", staff: REVIEWERS },
    { key: "plagiarismExpert", label: "department.plagiarismExpert", staff: PLAGIARISM_EXPERTS },
];

const INITIAL_STUDENTS = [
    { id: 1, name: "Иванов Алексей Петрович", topic: "Разработка веб-приложения для управления проектами", normocontroller: "Козлова Е.В.", reviewer: "Волков Д.С.", plagiarismExpert: null },
    { id: 2, name: "Петрова Мария Сергеевна", topic: "Анализ данных с использованием машинного обучения", normocontroller: null, reviewer: "Лебедева Н.Н.", plagiarismExpert: "Сидорова М.И." },
    { id: 3, name: "Сидоров Дмитрий Николаевич", topic: "Мобильное приложение для мониторинга здоровья", normocontroller: "Морозова Е.А.", reviewer: null, plagiarismExpert: null },
    { id: 4, name: "Козлова Анна Владимировна", topic: "Система автоматического тестирования ПО", normocontroller: null, reviewer: null, plagiarismExpert: null },
    { id: 5, name: "Морозов Артём Игоревич", topic: "Нейросетевой подход к распознаванию образов", normocontroller: "Козлова Е.В.", reviewer: "Иванова А.П.", plagiarismExpert: "Козлов В.П." },
    { id: 6, name: "Волкова Елена Дмитриевна", topic: "Блокчейн-платформа для верификации документов", normocontroller: null, reviewer: "Волков Д.С.", plagiarismExpert: null },
    { id: 7, name: "Новиков Кирилл Андреевич", topic: "Оптимизация баз данных для высоконагруженных систем", normocontroller: "Морозова Е.А.", reviewer: null, plagiarismExpert: "Сидорова М.И." },
    { id: 8, name: "Фёдорова Ольга Михайловна", topic: "IoT-система умного дома на базе Raspberry Pi", normocontroller: null, reviewer: null, plagiarismExpert: null },
    { id: 9, name: "Егоров Максим Юрьевич", topic: "Платформа электронного обучения с геймификацией", normocontroller: "Козлова Е.В.", reviewer: "Лебедева Н.Н.", plagiarismExpert: null },
    { id: 10, name: "Соколова Виктория Александровна", topic: "Разработка CRM-системы для малого бизнеса", normocontroller: null, reviewer: null, plagiarismExpert: "Козлов В.П." },
];

export default function ExpertAssignmentPage() {
    const { t } = useTranslation();
    const [students, setStudents] = useState(INITIAL_STUDENTS);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkModal, setBulkModal] = useState(null); // { columnKey, staff }
    const [bulkValue, setBulkValue] = useState("");

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

    const handleExpertChange = (studentId, columnKey, value) => {
        setStudents((prev) =>
            prev.map((s) =>
                s.id === studentId ? { ...s, [columnKey]: value || null } : s
            )
        );
    };

    const openBulkModal = (col) => {
        setBulkModal({ columnKey: col.key, staff: col.staff, label: col.label });
        setBulkValue("");
    };

    const handleBulkAssign = () => {
        if (!bulkValue || !bulkModal) return;
        setStudents((prev) =>
            prev.map((s) =>
                selectedIds.includes(s.id) ? { ...s, [bulkModal.columnKey]: bulkValue } : s
            )
        );
        setBulkModal(null);
        setBulkValue("");
    };

    return (
        <div className="expert-assignment-page">
            <div className="page-header">
                <div className="page-header-info">
                    <div className="page-header-icon-bg">
                        <img src={shieldCheckIcon} alt="" className="page-header-icon" />
                    </div>
                    <div>
                        <h1 className="page-title">{t("department.expertAssignmentTitle")}</h1>
                        <p className="page-subtitle">{t("department.expertAssignmentSubtitle")}</p>
                    </div>
                </div>
            </div>

            {/* Bulk assignment bar */}
            <div className="ea-bulk-bar">
                <span className="ea-selected-count">
                    {t("department.selectedCount", { count: selectedIds.length })}
                </span>
                {EXPERT_COLUMNS.map((col) => (
                    <button
                        key={col.key}
                        className="ea-bulk-btn"
                        disabled={selectedIds.length === 0}
                        onClick={() => openBulkModal(col)}
                    >
                        {t("department.assignToSelected")}: {t(col.label)}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="ea-table-wrapper">
                <table className="ea-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    className="ea-checkbox"
                                    checked={selectedIds.length === students.length && students.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>№</th>
                            <th>{t("department.student")}</th>
                            <th>{t("department.topicWork")}</th>
                            {EXPERT_COLUMNS.map((col) => (
                                <th key={col.key}>{t(col.label)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, idx) => (
                            <tr key={student.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="ea-checkbox"
                                        checked={selectedIds.includes(student.id)}
                                        onChange={() => toggleSelect(student.id)}
                                    />
                                </td>
                                <td>{idx + 1}</td>
                                <td className="ea-student-name">{student.name}</td>
                                <td className="ea-topic" title={student.topic}>{student.topic}</td>
                                {EXPERT_COLUMNS.map((col) => (
                                    <td key={col.key}>
                                        <select
                                            className="ea-expert-select"
                                            value={student[col.key] || ""}
                                            onChange={(e) => handleExpertChange(student.id, col.key, e.target.value)}
                                        >
                                            <option value="">{t("department.notAssigned")}</option>
                                            {col.staff.map((name) => (
                                                <option key={name} value={name}>{name}</option>
                                            ))}
                                        </select>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bulk assignment modal */}
            {bulkModal && (
                <div className="ea-modal-overlay" onClick={() => setBulkModal(null)}>
                    <div className="ea-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="ea-modal-title">
                            {t("department.assignToSelected")}: {t(bulkModal.label)}
                        </h3>
                        <div className="ea-modal-field">
                            <label className="ea-modal-label">{t(bulkModal.label)}</label>
                            <select
                                className="ea-modal-select"
                                value={bulkValue}
                                onChange={(e) => setBulkValue(e.target.value)}
                            >
                                <option value="">{t("department.selectExpert")}</option>
                                {bulkModal.staff.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ea-modal-actions">
                            <button className="ea-modal-cancel" onClick={() => setBulkModal(null)}>
                                {t("department.cancel")}
                            </button>
                            <button
                                className="ea-modal-confirm"
                                disabled={!bulkValue}
                                onClick={handleBulkAssign}
                            >
                                {t("department.assign")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
