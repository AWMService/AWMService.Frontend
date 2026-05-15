import React, { useEffect, useState } from 'react';
import { getRefreshToken, getToken } from '../api';
import { useAuth } from '../context/AuthContext';
import { getPostLoginRedirectUrl } from '../auth/authRouting';
import './SingleSignOnPage.css';

export function SingleSignOnPage() {
  const { user, isLoading, isAuthenticated, login } = useAuth();
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      window.location.replace(getPostLoginRedirectUrl(user, {
        token: getToken(),
        refreshToken: getRefreshToken(),
      }));
    }
  }, [isAuthenticated, isLoading, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await login({
        login: credentials.login.trim(),
        password: credentials.password,
      });

      const redirectUrl = getPostLoginRedirectUrl(response.user || response, {
        token: response.token,
        refreshToken: response.refreshToken,
      });
      window.location.assign(redirectUrl);
    } catch (err) {
      setError(err?.message || 'Не удалось выполнить вход. Проверьте логин и пароль.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="sso-page">
      <section className="sso-panel" aria-labelledby="sso-title">
        <div className="sso-brand">
          <div className="sso-brand__mark">AWM</div>
          <div>
            <p className="sso-brand__caption">Academic Workflow Management</p>
            <h1 id="sso-title">Единый вход</h1>
          </div>
        </div>

        <form className="sso-form" onSubmit={handleSubmit}>
          <label className="sso-field">
            <span>Логин</span>
            <input
              autoComplete="username"
              autoFocus
              name="login"
              onChange={handleChange}
              placeholder="student1"
              required
              type="text"
              value={credentials.login}
            />
          </label>

          <label className="sso-field">
            <span>Пароль</span>
            <input
              autoComplete="current-password"
              name="password"
              onChange={handleChange}
              placeholder="••••••••"
              required
              type="password"
              value={credentials.password}
            />
          </label>

          {error && <div className="sso-error" role="alert">{error}</div>}

          <button className="sso-submit" disabled={isSubmitting || isLoading} type="submit">
            {isSubmitting || isLoading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </section>
    </main>
  );
}
