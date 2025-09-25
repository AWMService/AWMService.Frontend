import React from "react";
import "./UnsavedChangesBar.css";

export function UnsavedChangesBar({
  unapprovedCount,
  isSubmitting,
  onSave,
  onCancel,
}) {
  return (
    <div className="unsaved-changes-bar">
      <div className="bar-content">
        <div className="message-group">
          {/* Replaced Lucide AlertCircle icon with inline SVG */}
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
            className="alert-icon"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <h3 className="message-title">Неутвержденные назначения</h3>
            <p className="message-text">
              У вас есть {unapprovedCount} неутвержденных назначений
            </p>
          </div>
        </div>
        <div className="action-buttons">
          <button
            className="button outline-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отменить изменения
          </button>
          <button
            className="button primary-button"
            onClick={onSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Утверждение...
              </>
            ) : (
              <>
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
                  className="button-icon"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Утвердить назначения
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
