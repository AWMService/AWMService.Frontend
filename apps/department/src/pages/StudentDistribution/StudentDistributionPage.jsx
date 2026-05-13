"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale } from "@awm/shared";
import "./StudentDistributionPage.css";
import usersIcon from "../../assets/icons/users-icon.svg";

const COMMISSIONS = [
    { id: "c1", name: "Комиссия №1" },
    { id: "c2", name: "Комиссия №2" },
    { id: "c3", name: "Комиссия №3" },
];

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

const INITIAL_STUDENTS = [
    { id: 1, name: "Иванов Алексей Петрович", topic: "Разработка веб-приложения для управления проектами", commissionId: "c1", assignedSlot: "09:30", assignedDate: "2025-06-15" },
    { id: 2, name: "Петрова Мария Сергеевна", topic: "Анализ данных с использованием машинного обучения", commissionId: "c1", assignedSlot: "10:00", assignedDate: "2025-06-15" },
    { id: 3, name: "Сидоров Дмитрий Николаевич", topic: "Мобильное приложение для мониторинга здоровья", commissionId: "c1", assignedSlot: null, assignedDate: null },
    { id: 4, name: "Козлова Анна Владимировна", topic: "Система автоматического тестирования ПО", commissionId: "c2", assignedSlot: "11:00", assignedDate: "2025-06-16" },
    { id: 5, name: "Морозов Артём Игоревич", topic: "Нейросетевой подход к распознаванию образов", commissionId: "c2", assignedSlot: null, assignedDate: null },
    { id: 6, name: "Волкова Елена Дмитриевна", topic: "Блокчейн-платформа для верификации документов", commissionId: "c2", assignedSlot: "14:00", assignedDate: "2025-06-16" },
    { id: 7, name: "Новиков Кирилл Андреевич", topic: "Оптимизация баз данных для высоконагруженных систем", commissionId: "c3", assignedSlot: null, assignedDate: null },
    { id: 8, name: "Фёдорова Ольга Михайловна", topic: "IoT-система умного дома на базе Raspberry Pi", commissionId: "c3", assignedSlot: "09:00", assignedDate: "2025-06-17" },
    { id: 9, name: "Егоров Максим Юрьевич", topic: "Платформа электронного обучения с элементами геймификации", commissionId: "c3", assignedSlot: "10:30", assignedDate: "2025-06-17" },
    { id: 10, name: "Соколова Виктория Александровна", topic: "Разработка CRM-системы для малого бизнеса", commissionId: "c1", assignedSlot: null, assignedDate: null },
];

export default function StudentDistributionPage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const [students, setStudents] = useState(INITIAL_STUDENTS);
    const [filterCommission, setFilterCommission] = useState("all");
    const [filterDate, setFilterDate] = useState("");

    const filteredStudents = useMemo(() => {
        return students.filter((s) => {
            if (filterCommission !== "all" && s.commissionId !== filterCommission) return false;
            if (filterDate && s.assignedDate !== filterDate) return false;
            return true;
        });
    }, [students, filterCommission, filterDate]);

    const slotCounts = useMemo(() => {
        const counts = {};
        COMMISSIONS.forEach((c) => {
            const commStudents = students.filter((s) => s.commissionId === c.id);
            const assigned = commStudents.filter((s) => s.assignedSlot).length;
            counts[c.id] = { assigned, total: TIME_SLOTS.length };
        });
        return counts;
    }, [students]);

    const handleAssignSlot = (studentId, slot) => {
        setStudents((prev) =>
            prev.map((s) => {
                if (s.id !== studentId) return s;
                const comm = COMMISSIONS.find((c) => c.id === s.commissionId);
                const defaultDate = comm
                    ? s.commissionId === "c1" ? "2025-06-15"
                        : s.commissionId === "c2" ? "2025-06-16"
                            : "2025-06-17"
                    : "2025-06-15";
                return { ...s, assignedSlot: slot, assignedDate: s.assignedDate || defaultDate };
            })
        );
    };

    const handleReassign = (studentId) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === studentId ? { ...s, assignedSlot: null } : s))
        );
    };

    const getCommissionName = (id) => COMMISSIONS.find((c) => c.id === id)?.name || id;

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="student-distribution-page">
            <div className="page-header">
                <div className="page-header-info">
                    <div className="page-header-icon-bg">
                        <img src={usersIcon} alt="" className="page-header-icon" />
                    </div>
                    <div>
                        <h1 className="page-title">{t("department.studentDistributionTitle")}</h1>
                        <p className="page-subtitle">{t("department.studentDistributionSubtitle")}</p>
                    </div>
                </div>
            </div>

            {/* Filter bar */}
            <div className="sd-filter-bar">
                <select
                    className="sd-filter-select"
                    value={filterCommission}
                    onChange={(e) => setFilterCommission(e.target.value)}
                >
                    <option value="all">{t("department.allCommissions")}</option>
                    {COMMISSIONS.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
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
                {COMMISSIONS.map((c) => {
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
                                    {student.assignedSlot ? (
                                        <div className="sd-assigned-slot">
                                            <button
                                                className="sd-reassign-btn"
                                                onClick={() => handleReassign(student.id)}
                                            >
                                                {t("department.reassignSlot")}
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            className="sd-slot-select"
                                            value=""
                                            onChange={(e) => handleAssignSlot(student.id, e.target.value)}
                                        >
                                            <option value="" disabled>
                                                {t("department.assignSlot")}
                                            </option>
                                            {TIME_SLOTS.map((slot) => (
                                                <option key={slot} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
