import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRole, ROLE_META } from '../context/RoleContext';
import './RoleSelector.css';
export function RoleSelector({ variant = 'dropdown' }) {
  const { t } = useTranslation();
  const { currentRole, availableRoles, switchRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentMeta = ROLE_META[currentRole];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleRoleChange = (role) => {
    switchRole(role);
    setIsOpen(false);
  };
  if (availableRoles.length <= 1) {
    return null; 
  }
  if (variant === 'tabs') {
    return (
      <div className="role-selector role-selector--tabs">
        {availableRoles.map((role) => {
          const meta = ROLE_META[role];
          return (
            <button
              key={role}
              className={`role-tab ${currentRole === role ? 'role-tab--active' : ''}`}
              onClick={() => handleRoleChange(role)}
              style={{
                '--role-color': meta?.color || '#6366f1',
              }}
            >
              {t(meta?.labelKey || role)}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className="role-selector" ref={dropdownRef}>
      <button
        className="role-selector__trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ '--role-color': currentMeta?.color || '#6366f1' }}
      >
        <span
          className="role-selector__indicator"
          style={{ background: currentMeta?.color }}
        />
        <span className="role-selector__current">
          {t(currentMeta?.labelKey || currentRole)}
        </span>
        <svg
          className={`role-selector__arrow ${isOpen ? 'role-selector__arrow--open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      {isOpen && (
        <div className="role-selector__dropdown">
          {availableRoles.map((role) => {
            const meta = ROLE_META[role];
            return (
              <button
                key={role}
                className={`role-selector__option ${currentRole === role ? 'role-selector__option--active' : ''}`}
                onClick={() => handleRoleChange(role)}
              >
                <span
                  className="role-selector__option-indicator"
                  style={{ background: meta?.color }}
                />
                <span className="role-selector__option-label">
                  {t(meta?.labelKey || role)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default RoleSelector;
