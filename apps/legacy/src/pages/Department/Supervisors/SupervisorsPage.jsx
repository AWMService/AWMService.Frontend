"use client";

import React, { useState, useMemo } from "react";
import "./SupervisorsPage.css";
import { SupervisorCard } from "../../../components/Department/supervisors/SupervisorCard.jsx";
import { SupervisorSelectionDialog } from "../../../components/Department/supervisors/SupervisorSelectionDialog.jsx";
import plusIcon from "../../../assets/icons/plus-icon.svg";
import searchIcon from "../../../assets/icons/search-icon.svg";

const initialSupervisors = [
    {
        id: "1",
        name: "Петров Александр Владимирович",
        position: "Профессор",
        degree: "д.т.н.",
        specialization: "Информационные системы",
        email: "petrov@university.edu",
        phone: "+7 (495) 123-45-67",
        currentStudents: 3,
        maxStudents: 5,
        assignedDate: new Date("2025-09-23"),
        assignedStudents: [],
    },
    {
        id: "2",
        name: "Сидорова Мария Ивановна",
        position: "Доцент",
        degree: "к.т.н.",
        specialization: "Базы данных",
        email: "sidorova@university.edu",
        phone: "+7 (495) 123-45-68",
        currentStudents: 0,
        maxStudents: 4,
        assignedDate: new Date(),
        assignedStudents: [],
    },
];

const allTeachers = [
    {
        id: "3",
        name: "Козлов Владимир Петрович",
        position: "Доцент",
        degree: "к.т.н.",
        specialization: "Веб-разработка",
        email: "kozlov@university.edu",
        phone: "+7 (495) 123-45-69",
        currentStudents: 0,
        maxStudents: 5,
    },
    {
        id: "4",
        name: "Морозова Елена Александровна",
        position: "Старший преподаватель",
        degree: "к.т.н.",
        specialization: "Машинное обучение",
        email: "morozova@university.edu",
        phone: "+7 (495) 123-45-70",
        currentStudents: 0,
        maxStudents: 3,
    },
    {
        id: "5",
        name: "Волков Дмитрий Сергеевич",
        position: "Профессор",
        degree: "д.т.н.",
        specialization: "Кибербезопасность",
        email: "volkov@university.edu",
        phone: "+7 (495) 123-45-71",
        currentStudents: 0,
        maxStudents: 4,
    },
];

function SupervisorsPage() {
    const [supervisors, setSupervisors] = useState(initialSupervisors);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const availableTeachers = useMemo(() => {
        const supervisorIds = new Set(supervisors.map((s) => s.id));
        return allTeachers.filter((t) => !supervisorIds.has(t.id));
    }, [supervisors]);

    const filteredSupervisors = useMemo(
        () =>
            supervisors.filter(
                (s) =>
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.specialization.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [supervisors, searchTerm]
    );

    const handleAddSupervisors = (selectedIds) => {
        const newSupervisors = allTeachers
            .filter((t) => selectedIds.includes(t.id))
            .map((t) => ({
                ...t,
                assignedStudents: [],
                assignedDate: new Date(),
            }));

        setSupervisors((prev) => [...prev, ...newSupervisors]);
        setIsDialogOpen(false);
    };

    const handleRemoveSupervisor = (id) => {
        setSupervisors((prev) => prev.filter((s) => s.id !== id));
    };

    const handleUpdateWorkload = (id, maxStudents) => {
        setSupervisors((prev) =>
            prev.map((s) => (s.id === id ? { ...s, maxStudents } : s))
        );
    };

    return (
        <div className="supervisors-page">
            <div className="page-header">
                <div className="page-header-info">
                    <div>
                        <h1 className="page-title">Научные руководители</h1>
                        <p className="page-subtitle">
                            Управление назначенными научными руководителями кафедры
                        </p>
                    </div>
                </div>

                <button
                    className="button primary-button"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <img src={plusIcon} alt="Add" className="button-icon" />
                    Добавить руководителей
                </button>
            </div>

            <div className="search-bar-container">
                <img src={searchIcon} alt="Search" className="search-bar-icon" />
                <input
                    type="text"
                    placeholder="Поиск по имени, специализации..."
                    className="search-bar-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="supervisors-grid-layout">
                {filteredSupervisors.map((supervisor) => (
                    <SupervisorCard
                        key={supervisor.id}
                        supervisor={supervisor}
                        onRemove={handleRemoveSupervisor}
                        onUpdateWorkload={handleUpdateWorkload}
                    />
                ))}
            </div>

            <SupervisorSelectionDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                availableTeachers={availableTeachers}
                onConfirm={handleAddSupervisors}
            />
        </div>
    );
}

export default SupervisorsPage;
