"use client"

import React, { useState, useMemo } from "react";
import './SupervisorsPage.css';
import { SupervisorCard } from '../../../components/Department/supervisors/SupervisorCard.jsx';
import { SupervisorSelectionDialog } from '../../../components/Department/supervisors/SupervisorSelectionDialog.jsx';
import { UnsavedChangesBar } from '../../../components/Department/supervisors/UnsavedChangesBar.jsx';

import plusIcon from '../../../assets/icons/plus-icon.svg';
import searchIcon from '../../../assets/icons/search-icon.svg';
import supervisorsIcon from '../../../assets/icons/supervisors-icon.svg';

// Mock Data based on Figma
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
    isApproved: true,
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
    isApproved: false,
    assignedStudents: [],
  },
];

const allTeachers = [
  { id: "3", name: "Козлов Владимир Петрович", position: "Доцент", degree: "к.т.н.", specialization: "Веб-разработка", email: "kozlov@university.edu", phone: "+7 (495) 123-45-69", currentStudents: 0, maxStudents: 5 },
  { id: "4", name: "Морозова Елена Александровна", position: "Старший преподаватель", degree: "к.т.н.", specialization: "Машинное обучение", email: "morozova@university.edu", phone: "+7 (495) 123-45-70", currentStudents: 0, maxStudents: 3 },
  { id: "5", name: "Волков Дмитрий Сергеевич", position: "Профессор", degree: "д.т.н.", specialization: "Кибербезопасность", email: "volkov@university.edu", phone: "+7 (495) 123-45-71", currentStudents: 0, maxStudents: 4 },
];

function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState(initialSupervisors);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availableTeachers = useMemo(() => {
    const supervisorIds = new Set(supervisors.map(s => s.id));
    return allTeachers.filter(t => !supervisorIds.has(t.id));
  }, [supervisors]);

  const unapprovedSupervisors = useMemo(() => supervisors.filter(s => !s.isApproved), [supervisors]);

  const filteredSupervisors = useMemo(() => supervisors.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  ), [supervisors, searchTerm]);
  
  const stats = useMemo(() => {
    const approved = supervisors.filter(s => s.isApproved).length;
    const unapproved = unapprovedSupervisors.length;
    const totalStudents = supervisors.reduce((acc, s) => acc + s.currentStudents, 0);
    const totalCapacity = supervisors.reduce((acc, s) => acc + s.maxStudents, 0);
    const availableSlots = totalCapacity - totalStudents;

    return { approved, unapproved, availableSlots, totalStudents };
  }, [supervisors, unapprovedSupervisors.length]);

  const handleAddSupervisors = (selectedIds) => {
    const newSupervisors = allTeachers
      .filter(t => selectedIds.includes(t.id))
      .map(t => ({
        ...t,
        isApproved: false,
        assignedStudents: [],
        assignedDate: new Date(),
      }));
    setSupervisors(prev => [...prev, ...newSupervisors]);
    setIsDialogOpen(false);
  };

  const handleRemoveSupervisor = (id) => {
    setSupervisors(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateWorkload = (id, maxStudents) => {
    setSupervisors(prev =>
      prev.map(s => (s.id === id ? { ...s, maxStudents } : s))
    );
  };

  const handleApproveChanges = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setSupervisors(prev =>
        prev.map(s => ({ ...s, isApproved: true }))
      );
      setIsSubmitting(false);
    }, 1500);
  };

  const handleCancelChanges = () => {
    setSupervisors(prev => prev.filter(s => s.isApproved));
  };

  return (
    <div className="supervisors-page">
      <div className="page-header">
        <div className="page-header-info">
            <div className="page-header-icon-bg">
                <img src={supervisorsIcon} alt="Supervisors Icon" className="page-header-icon" />
            </div>
            <div>
                <h1 className="page-title">Научные руководители</h1>
                <p className="page-subtitle">
                    Управление назначенными научными руководителями кафедры
                </p>
            </div>
        </div>
        <button className="button primary-button" onClick={() => setIsDialogOpen(true)}>
          <img src={plusIcon} alt="Add" className="button-icon" />
          Добавить руководителей
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
            <p className="stat-card-value stat-value-approved">{stats.approved}</p>
            <p className="stat-card-title">Утверждено</p>
        </div>
        <div className="stat-card">
            <p className="stat-card-value stat-value-unapproved">{stats.unapproved}</p>
            <p className="stat-card-title">Не утверждено</p>
        </div>
        <div className="stat-card">
            <p className="stat-card-value stat-value-available">{stats.availableSlots}</p>
            <p className="stat-card-title">Свободно мест</p>
        </div>
        <div className="stat-card">
            <p className="stat-card-value stat-value-total">{stats.totalStudents}</p>
            <p className="stat-card-title">Всего студентов</p>
        </div>
      </div>

      {unapprovedSupervisors.length > 0 && (
        <UnsavedChangesBar
          unapprovedCount={unapprovedSupervisors.length}
          isSubmitting={isSubmitting}
          onSave={handleApproveChanges}
          onCancel={handleCancelChanges}
        />
      )}

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
        {filteredSupervisors.map(supervisor => (
          <SupervisorCard
            key={supervisor.id}
            supervisor={supervisor}
            isSaved={supervisor.isApproved}
            onRemove={!supervisor.isApproved ? handleRemoveSupervisor : undefined}
            onUpdateWorkload={!supervisor.isApproved ? handleUpdateWorkload : undefined}
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