import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';


export function ProtectedRoute({ allowedRoles, fallback = '/', children }) {
    const { currentRole } = useRole();
    
    if (!allowedRoles.includes(currentRole)) {
        return <Navigate to={fallback} replace />;
    }
    
    return children;
}
