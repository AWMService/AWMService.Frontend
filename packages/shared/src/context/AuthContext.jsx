import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, consumeAuthTokensFromUrl, getToken, storeAuthTokens } from '../api';
import { getLoginUrl, getLogoutUrl } from '../auth/authRouting';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();
    const [token, setAccessToken] = useState(() => {
        const consumed = consumeAuthTokensFromUrl();
        return consumed.token || getToken();
    });

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['currentUser'],
        queryFn: authService.getCurrentUser,
        enabled: !!token,
        retry: false,
    });

    useEffect(() => {
        const handleUnauthorized = () => {
            setAccessToken(null);
            queryClient.setQueryData(['currentUser'], null);
        };

        window.addEventListener('awm:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('awm:unauthorized', handleUnauthorized);
    }, [queryClient]);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        if (response?.token) {
            storeAuthTokens(response);
            setAccessToken(response.token);
            const currentUser = await queryClient.fetchQuery({
                queryKey: ['currentUser'],
                queryFn: authService.getCurrentUser,
            });
            return { ...response, user: currentUser };
        }
        return response;
    };

    const logout = ({ redirect = true } = {}) => {
        authService.logout();
        setAccessToken(null);
        queryClient.setQueryData(['currentUser'], null);
        if (redirect) {
            window.location.assign(getLogoutUrl());
        }
    };

    const value = {
        user,
        isLoading: isLoading && !!token,
        error,
        login,
        logout,
        hasToken: !!token,
        isAuthenticated: !!token && !!user,
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
