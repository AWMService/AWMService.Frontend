import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./SupervisorSelectionDialog.css";
import { TeacherSelectionItem } from "./TeacherSelectionItem.jsx";

export function SupervisorSelectionDialog({
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
      <div className="supervisor-dialog-overlay">
        <div className="supervisor-dialog">


          <div className="supervisor-dialog-header">
            <div className="supervisor-dialog-header-row">
              <div>
                <h3 className="supervisor-dialog-title">
                  {t('department.selectTeachers')}
                </h3>
                <p className="supervisor-dialog-description">
                  {t('department.supervisorsSubtitle')}
                </p>
              </div>


              <button
                  className="supervisor-dialog-close"
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


          <div className="supervisor-dialog-body">


            <div className="supervisor-search">
              <svg viewBox="0 0 24 24" className="supervisor-search-icon">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                  type="text"
                  placeholder={t('department.searchSupervisors')}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="supervisor-search-input"
              />
            </div>


            {selectedTeacherIds.length > 0 && (
                <div className="supervisor-selection-info">
              <span>
                {t('department.selectedCount', { count: selectedTeacherIds.length })}
              </span>
                  <button
                      onClick={() => setSelectedTeacherIds([])}
                      className="supervisor-clear-button"
                  >
                    {t('common.clear')}
                  </button>
                </div>
            )}


            <div className="supervisor-teachers-scroll">
              <div className="supervisor-teachers-list">
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
                    <div className="supervisor-empty">
                      {availableTeachers.length === 0
                          ? t('department.allTeachersAssigned')
                          : t('department.teachersNotFound')}
                    </div>
                )}
              </div>
            </div>


            <div className="supervisor-dialog-actions">
              <button
                  className="supervisor-button outline"
                  onClick={handleCancel}
              >
                {t('common.cancel')}
              </button>
              <button
                  className="supervisor-button primary"
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
