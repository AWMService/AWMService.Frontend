import React, { useState } from "react";
import "./SupervisorCard.css";

export function SupervisorCard({ supervisor, onRemove, onUpdateWorkload }) {
  const loadPercent = Math.min(
      Math.round((supervisor.currentStudents / supervisor.maxStudents) * 100),
      100
  );

  const loadLevel =
      loadPercent < 60 ? "low" : loadPercent < 85 ? "medium" : "high";

  const [isEditingWorkload, setIsEditingWorkload] = useState(false);
  const [newMaxStudents, setNewMaxStudents] = useState(
      supervisor.maxStudents
  );

  const handleSaveWorkload = () => {
    onUpdateWorkload(supervisor.id, newMaxStudents);
    setIsEditingWorkload(false);
  };

  const handleCancelEdit = () => {
    setNewMaxStudents(supervisor.maxStudents);
    setIsEditingWorkload(false);
  };

  return (
      <div className="supervisor-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">{supervisor.name}</h3>
            <p className="card-description">
              {supervisor.position} • {supervisor.degree} •{" "}
              {supervisor.specialization}
            </p>
          </div>

          <div className="card-actions">
            {onUpdateWorkload && (
                <button
                    className="icon-button"
                    title="Редактировать"
                    onClick={() => setIsEditingWorkload(true)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
            )}

            {onRemove && (
                <button
                    className="icon-button danger"
                    title="Удалить"
                    onClick={() => onRemove(supervisor.id)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </button>
            )}
          </div>
        </div>

        <div className="card-content">
          <div className="grid-section">
            <div>
              <h4 className="section-title">Контактная информация</h4>

              <div className="contact-item">
                <svg viewBox="0 0 24 24">
                  <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                <span>{supervisor.email}</span>
              </div>

              <div className="contact-item">
                <svg viewBox="0 0 24 24">
                  <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2H7a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                <span>{supervisor.phone}</span>
              </div>
            </div>

            <div>
              <h4 className="section-title">Нагрузка</h4>
              <p>Текущие студенты: {supervisor.currentStudents}</p>

              {isEditingWorkload ? (
                  <div className="edit-workload-input">
                    <input
                        type="number"
                        className="input-field"
                        value={newMaxStudents}
                        onChange={(e) =>
                            setNewMaxStudents(Number(e.target.value) || 1)
                        }
                    />

                    <button
                        className="icon-button success"
                        title="Сохранить"
                        onClick={handleSaveWorkload}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </button>

                    <button
                        className="icon-button"
                        title="Отмена"
                        onClick={handleCancelEdit}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M6 6l12 12" />
                        <path d="M18 6l-12 12" />
                      </svg>
                    </button>
                  </div>
              ) : (
                  <div>
                    <p>Максимум: {supervisor.maxStudents}</p>

                    <div className="progress-wrapper">
                      <div className="progress-bar">
                        <div
                            className={`progress-fill ${loadLevel}`}
                            style={{ width: `${loadPercent}%` }}
                        />
                      </div>
                      <span className="progress-text">{loadPercent}%</span>
                    </div>
                  </div>
              )}
            </div>

            {supervisor.assignedDate && (
                <div>
                  <h4 className="section-title">Дата назначения</h4>
                  <span>
                {new Date(supervisor.assignedDate).toLocaleDateString("ru-RU")}
              </span>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
