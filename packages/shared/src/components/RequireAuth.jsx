import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getCabinetUrl,
  getLoginUrl,
  hasAnyRole,
  redirectToLogin,
} from '../auth/authRouting';

const DefaultAuthFallback = ({ text = 'Загрузка...' }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}
  >
    {text}
  </div>
);

export function RequireAuth({ allowedRoles = [], children, fallback }) {
  const { user, isLoading, hasToken, isAuthenticated } = useAuth();
  const fallbackContent = fallback || <DefaultAuthFallback />;

  const isAllowed = !allowedRoles.length || hasAnyRole(user?.roles, allowedRoles);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!hasToken || !isAuthenticated) {
      redirectToLogin(window.location.href);
      return;
    }

    if (!isAllowed) {
      window.location.assign(getCabinetUrl(user));
    }
  }, [allowedRoles, hasToken, isAllowed, isAuthenticated, isLoading, user]);

  if (isLoading || !hasToken || !isAuthenticated) {
    return fallbackContent;
  }

  if (!isAllowed) {
    return fallback || <DefaultAuthFallback text="Переходим в ваш кабинет..." />;
  }

  return children;
}

export function LoginRedirect() {
  useEffect(() => {
    window.location.assign(getLoginUrl());
  }, []);

  return <DefaultAuthFallback text="Открываем единый вход..." />;
}
