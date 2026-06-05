import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./EmployeeSelectionDialog.css";
import { TeacherSelectionItem } from "./TeacherSelectionItem.jsx";

export function EmployeeSelectionDialog({
                                            availableTeachers,
                                            isOpen,
                                            onOpenChange,
                                            onConfirm,
                                          }) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);

  const filteredTeachers = availableTeachers.filter(
      (teacher) =>
          teacher.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          teacher.specialization.toLowerCase().includes(searchValue.toLowerCase())
  );

  const toggleTeacher = (teacherId) => {
    setSelectedTeacherIds((prev) =>
        prev.includes(teacherId)
            ? prev.filter((id) => id !== teacherId)
            : [...prev, teacherId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedTeacherIds);
    setSelectedTeacherIds([]);
    setSearchValue("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedTeacherIds([]);
    setSearchValue("");
  };

  if (!isOpen) return null;

  return (
      <div className="employee-dialog-overlay">
        <div className="employee-dialog">


          <div className="employee-dialog-header">
            <div className="employee-dialog-header-row">
              <div>
                <h3 className="employee-dialog-title">
                  {t('department.selectTeachers')}
                </h3>
                <p className="employee-dialog-description">
                  {t('department.employeesSubtitle')}
                </p>
              </div>


              <button
                  className="employee-dialog-close"
                  onClick={handleCancel}
                  aria-label={t('common.close')}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </button>
            </div>
          </div>


          <div className="employee-dialog-body">


            <div className="employee-search">
              <svg viewBox="0 0 24 24" className="employee-search-icon">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                  type="text"
                  placeholder={t('department.searchEmployees')}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="employee-search-input"
              />
            </div>


            {selectedTeacherIds.length > 0 && (
                <div className="employee-selection-info">
              <span>
                {t('department.selectedCount', { count: selectedTeacherIds.length })}
              </span>
                  <button
                      onClick={() => setSelectedTeacherIds([])}
                      className="employee-clear-button"
                  >
                    {t('common.clear')}
                  </button>
                </div>
            )}


            <div className="employee-teachers-scroll">
              <div className="employee-teachers-list">
                {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                        <TeacherSelectionItem
                            key={teacher.id}
                            teacher={teacher}
                            isSelected={selectedTeacherIds.includes(teacher.id)}
                            onToggle={toggleTeacher}
                        />
                    ))
                ) : (
                    <div className="employee-empty">
                      {availableTeachers.length === 0
                          ? t('department.allTeachersAssigned')
                          : t('department.teachersNotFound')}
                    </div>
                )}
              </div>
            </div>


            <div className="employee-dialog-actions">
              <button
                  className="employee-button outline"
                  onClick={handleCancel}
              >
                {t('common.cancel')}
              </button>
              <button
                  className="employee-button primary"
                  onClick={handleConfirm}
                  disabled={selectedTeacherIds.length === 0}
              >
                {t('department.confirmAdd')} ({selectedTeacherIds.length})
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
