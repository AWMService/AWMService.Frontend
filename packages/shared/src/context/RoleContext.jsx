import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { normalizeRoles, ROLE_META, ROLES, UNIVERSAL_ROLES } from '../auth/roles';
export { ROLE_META, ROLES, UNIVERSAL_ROLES };
const RoleContext = createContext(null);
export function RoleProvider({ children, availableRoles = [], defaultRole = null }) {
  const { user, isLoading } = useAuth();
  const activeRoles = user?.roles?.length > 0
    ? normalizeRoles(user.roles)
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
