import React, { useState } from "react";
import "./SupervisorCard.css";

export function SupervisorCard({
  supervisor,
  isSaved,
  onRemove,
  onUpdateWorkload,
}) {
  const [isEditingWorkload, setIsEditingWorkload] = useState(false);
  const [newMaxStudents, setNewMaxStudents] = useState(supervisor.maxStudents);

  const handleSaveWorkload = () => {
    if (onUpdateWorkload && newMaxStudents !== supervisor.maxStudents) {
      onUpdateWorkload(supervisor.id, newMaxStudents);
    }
    setIsEditingWorkload(false);
  };

  const handleCancelEdit = () => {
    setNewMaxStudents(supervisor.maxStudents);
    setIsEditingWorkload(false);
  };

  return (
    <div
      className={`supervisor-card ${
        !supervisor.isApproved ? "unapproved" : ""
      }`}
    >
      <div className="card-header">
        <div className="card-title-group">
          <h3 className="card-title">
            <span>{supervisor.name}</span>
            {!supervisor.isApproved && (
              <span className="badge outline-badge">Не утвержден</span>
            )}
          </h3>
          <p className="card-description">
            {supervisor.position} • {supervisor.degree} •{" "}
            {supervisor.specialization}
          </p>
        </div>
        <div className="card-actions">
          {!supervisor.isApproved && onRemove && (
            <button
              className="icon-button text-red"
              onClick={() => onRemove(supervisor.id)}
            >
              {/* Replaced Lucide Trash2 icon with inline SVG */}
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
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="card-content">
        <div className="grid-section">
          <div className="space-y-2">
            <h4 className="section-title">Контактная информация</h4>
            <div className="contact-info">
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
                <span>{supervisor.email}</span>
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
                <span>{supervisor.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="workload-header">
              <h4 className="section-title flex-center">
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
                  className="icon"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Нагрузка</span>
              </h4>
              {!supervisor.isApproved && onUpdateWorkload && (
                <button
                  className="icon-button text-blue p-1"
                  onClick={() => setIsEditingWorkload(true)}
                >
                  {/* Replaced Lucide Edit icon with inline SVG */}
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
                    className="icon-small"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              )}
            </div>
            <div className="workload-details">
              <p>Текущие студенты: {supervisor.currentStudents}</p>
              {isEditingWorkload ? (
                <div className="edit-workload-input">
                  <label htmlFor="maxStudents" className="text-xs">
                    Максимум:
                  </label>
                  <input
                    id="maxStudents"
                    type="number"
                    min="1"
                    max="20"
                    value={newMaxStudents}
                    onChange={(e) =>
                      setNewMaxStudents(Number.parseInt(e.target.value) || 1)
                    }
                    className="input-field"
                  />
                  <button
                    className="icon-button text-green p-1"
                    onClick={handleSaveWorkload}
                  >
                    {/* Replaced Lucide Save icon with inline SVG */}
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
                      className="icon-small"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                  </button>
                  <button
                    className="icon-button text-gray p-1"
                    onClick={handleCancelEdit}
                  >
                    {/* Replaced Lucide X icon with inline SVG */}
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
                      className="icon-small"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <p>Максимум: {supervisor.maxStudents}</p>
              )}
              <div className="progress-bar-background">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${
                      (supervisor.currentStudents / supervisor.maxStudents) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {supervisor.isApproved && supervisor.assignedDate && (
            <div className="space-y-2">
              <h4 className="section-title">Дата назначения</h4>
              <div className="flex-center text-sm text-gray">
                {/* Replaced Lucide Calendar icon with inline SVG */}
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
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>
                  {new Date(supervisor.assignedDate).toLocaleDateString(
                    "ru-RU"
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
