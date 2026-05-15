import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

/**
 * Route guard that checks if the current role is in the allowedRoles list.
 * If not, redirects to the fallback route.
 */
export function ProtectedRoute({ allowedRoles, fallback = '/', children }) {
    const { currentRole } = useRole();
    
    if (!allowedRoles.includes(currentRole)) {
        return <Navigate to={fallback} replace />;
    }
    
    return children;
}
