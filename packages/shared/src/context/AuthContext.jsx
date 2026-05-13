import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, getToken, setToken, removeToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();
    const token = getToken();

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['currentUser'],
        queryFn: authService.getCurrentUser,
        enabled: !!token,
        retry: false,
    });

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        if (response?.token) {
            setToken(response.token);
            await queryClient.invalidateQueries(['currentUser']);
        }
        return response;
    };

    const logout = () => {
        removeToken();
        queryClient.setQueryData(['currentUser'], null);
        window.location.href = '/login'; 
    };

    const value = {
        user,
        isLoading: isLoading && !!token,
        error,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
