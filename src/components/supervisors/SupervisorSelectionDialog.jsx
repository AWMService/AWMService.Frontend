import React, { useState } from "react";
import "./SupervisorSelectionDialog.css";
import { TeacherSelectionItem } from "./TeacherSelectionItem";

export function SupervisorSelectionDialog({
  availableTeachers,
  isOpen,
  onOpenChange,
  onConfirm,
  trigger,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const filteredTeachers = availableTeachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTeacherToggle = (teacherId) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedTeachers);
    setSelectedTeachers([]);
    setSearchTerm("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedTeachers([]);
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h3 className="dialog-title">Выбрать научных руководителей</h3>
          <p className="dialog-description">
            Выберите преподавателей для назначения научными руководителями
            (можно выбрать несколько)
          </p>
        </div>

        <div className="dialog-body">
          {/* Search */}
          <div className="search-input-wrapper">
            {/* Replaced Lucide Search icon with inline SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="search-icon"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Поиск по имени или специализации..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Selection Summary */}
          {selectedTeachers.length > 0 && (
            <div className="selection-summary">
              <span className="selection-text">
                Выбрано: {selectedTeachers.length} преподавателей
              </span>
              <button
                className="clear-selection-button"
                onClick={() => setSelectedTeachers([])}
              >
                Очистить выбор
              </button>
            </div>
          )}

          {/* Teachers List */}
          <div className="teachers-list">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <TeacherSelectionItem
                  key={teacher.id}
                  teacher={teacher}
                  isSelected={selectedTeachers.includes(teacher.id)}
                  onToggle={handleTeacherToggle}
                />
              ))
            ) : (
              <div className="empty-state">
                {/* Replaced Lucide Users icon with inline SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="empty-state-icon"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <p>
                  {availableTeachers.length === 0
                    ? "Все преподаватели уже назначены"
                    : "Преподаватели не найдены"}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="dialog-actions">
            <button className="button outline-button" onClick={handleCancel}>
              Отмена
            </button>
            <button
              className="button primary-button"
              onClick={handleConfirm}
              disabled={selectedTeachers.length === 0}
            >
              Добавить выбранных ({selectedTeachers.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
