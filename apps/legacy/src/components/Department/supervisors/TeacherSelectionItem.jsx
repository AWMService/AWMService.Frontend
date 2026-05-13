import React from "react";
import "./TeacherSelectionItem.css";

export function TeacherSelectionItem({ teacher, isSelected, onToggle }) {
  return (
      <div
          className={`teacher-selection-item ${isSelected ? "selected" : ""}`}
          onClick={() => onToggle(teacher.id)}
      >
        <div className="checkbox-wrapper">
          <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(teacher.id)}
              className="checkbox-input"
          />
        </div>

        <div className="teacher-details">
          <div className="teacher-header">
            <h4 className="teacher-name">{teacher.name}</h4>
          </div>

          <div className="teacher-info-grid">
            <p><span className="font-medium">Должность:</span> {teacher.position}</p>
            <p><span className="font-medium">Степень:</span> {teacher.degree}</p>
            <p><span className="font-medium">Специализация:</span> {teacher.specialization}</p>
          </div>

          <div className="teacher-contact-info">
            <div className="contact-item">
              <svg viewBox="0 0 24 24">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-10 7L2 7" />
              </svg>
              <span>{teacher.email}</span>
            </div>

            <div className="contact-item">
              <svg viewBox="0 0 24 24">
                <path d="M22 16.92V21a2 2 0 0 1-2.18 2
                19.79 19.79 0 0 1-8.63-3.07
                19.5 19.5 0 0 1-6-6
                19.79 19.79 0 0 1-3.07-8.67
                A2 2 0 0 1 4.11 2H7
                a2 2 0 0 1 2 1.72
                12.84 12.84 0 0 0 .7 2.81
                2 2 0 0 1-.45 2.11
                L8.09 9.91a16 16 0 0 0 6 6
                l1.27-1.27a2 2 0 0 1 2.11-.45
                12.84 12.84 0 0 0 2.81.7
                A2 2 0 0 1 22 16.92Z" />
              </svg>
              <span>{teacher.phone}</span>
            </div>
          </div>
        </div>
      </div>
  );
}
