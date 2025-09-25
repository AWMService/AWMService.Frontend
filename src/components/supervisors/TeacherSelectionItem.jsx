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
          <p>
            <span className="font-medium">Должность:</span> {teacher.position}
          </p>
          <p>
            <span className="font-medium">Степень:</span> {teacher.degree}
          </p>
          <p>
            <span className="font-medium">Специализация:</span>{" "}
            {teacher.specialization}
          </p>
        </div>
        <div className="teacher-contact-info">
          <div className="contact-item">
            {/* Replaced Lucide Mail icon with inline SVG */}
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
              className="icon"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span>{teacher.email}</span>
          </div>
          <div className="contact-item">
            {/* Replaced Lucide Phone icon with inline SVG */}
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
              className="icon"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>{teacher.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
