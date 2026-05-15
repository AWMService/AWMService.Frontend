import React, { createContext, useContext, useState, useEffect } from 'react';

// Все доступные роли в системе
export const ROLES = {
  STUDENT: 'student',
  SUPERVISOR: 'supervisor',
  REVIEWER: 'reviewer',
  NORMOCONTROL: 'normocontrol',
  CHAIRMAN: 'chairman',
  SECRETARY: 'secretary',
  COMMISSION_MEMBER: 'commissionMember',
  DEPARTMENT: 'department',
  ADMIN: 'admin',
};

// Роли для universal app
export const UNIVERSAL_ROLES = [
  ROLES.SUPERVISOR,
  ROLES.REVIEWER,
  ROLES.NORMOCONTROL,
  ROLES.CHAIRMAN,
  ROLES.SECRETARY,
  ROLES.COMMISSION_MEMBER,
];

// Метаданные ролей
export const ROLE_META = {
  [ROLES.STUDENT]: {
    labelKey: 'roles.student',
    color: '#10b981',
    icon: 'GraduationCap',
  },
  [ROLES.SUPERVISOR]: {
    labelKey: 'roles.supervisor',
    color: '#6366f1',
    icon: 'Users',
  },
  [ROLES.REVIEWER]: {
    labelKey: 'roles.reviewer',
    color: '#f59e0b',
    icon: 'FileSearch',
  },
  [ROLES.NORMOCONTROL]: {
    labelKey: 'roles.normocontrol',
    color: '#8b5cf6',
    icon: 'FileCheck',
  },
  [ROLES.CHAIRMAN]: {
    labelKey: 'roles.chairman',
    color: '#ef4444',
    icon: 'Crown',
  },
  [ROLES.SECRETARY]: {
    labelKey: 'roles.secretary',
    color: '#14b8a6',
    icon: 'ClipboardList',
  },
  [ROLES.COMMISSION_MEMBER]: {
    labelKey: 'roles.commissionMember',
    color: '#64748b',
    icon: 'UserCheck',
  },
  [ROLES.DEPARTMENT]: {
    labelKey: 'roles.department',
    color: '#0ea5e9',
    icon: 'Building2',
  },
  [ROLES.ADMIN]: {
    labelKey: 'roles.admin',
    color: '#dc2626',
    icon: 'Shield',
  },
};

import { useAuth } from './AuthContext';

const RoleContext = createContext(null);

const BACKEND_TO_FRONTEND_ROLE_MAP = {
  'Student': ROLES.STUDENT,
  'Supervisor': ROLES.SUPERVISOR,
  'HeadOfDepartment': ROLES.DEPARTMENT,
  'Secretary': ROLES.SECRETARY,
  'Expert': ROLES.NORMOCONTROL,
  'Admin': ROLES.ADMIN,
  'CommissionMember': ROLES.COMMISSION_MEMBER,
  'Reviewer': ROLES.REVIEWER,
  'Chairman': ROLES.CHAIRMAN
};

export function RoleProvider({ children, availableRoles = [], defaultRole = null }) {
  const { user, isLoading } = useAuth();
  
  // Map backend roles to frontend constants, fall back to toLowerCase()
  const activeRoles = user?.roles?.length > 0 
    ? user.roles.map(r => BACKEND_TO_FRONTEND_ROLE_MAP[r] || r.toLowerCase()) 
    : availableRoles;

  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('awm-current-role');
    if (saved && activeRoles.includes(saved)) {
      return saved;
    }
    return defaultRole || activeRoles[0] || null;
  });

  useEffect(() => {
    if (!isLoading && activeRoles.length > 0) {
      if (!currentRole || !activeRoles.includes(currentRole)) {
        setCurrentRole(activeRoles[0]);
      }
    }
  }, [activeRoles, currentRole, isLoading]);

  useEffect(() => {
    if (currentRole) {
      localStorage.setItem('awm-current-role', currentRole);
    }
  }, [currentRole]);

  const switchRole = (role) => {
    if (activeRoles.includes(role)) {
      setCurrentRole(role);
    }
  };

  const hasRole = (role) => activeRoles.includes(role);

  const value = {
    currentRole,
    availableRoles: activeRoles,
    switchRole,
    hasRole,
    roleMeta: ROLE_META[currentRole] || null,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

export default RoleContext;
