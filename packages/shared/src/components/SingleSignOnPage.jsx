import React, { useEffect, useState } from 'react';
import { getRefreshToken, getToken } from '../api';
import { useAuth } from '../context/AuthContext';
import { getPostLoginRedirectUrl, getLoginUrl } from '../auth/authRouting';
import { useTranslation } from 'react-i18next';
import { changeLanguage, supportedLanguages, normalizeLanguage } from '../i18n';
import eyeIcon from '../assets/icons/eye-icon.svg';
import eyeOffIcon from '../assets/icons/eye-off-icon.svg';
import './SingleSignOnPage.css';

export function SingleSignOnPage() {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  
  const { user, isLoading, isAuthenticated, login } = useAuth();
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const redirectUrl = getPostLoginRedirectUrl(user, {
        token: getToken(),
        refreshToken: getRefreshToken(),
      });
      
      if (redirectUrl && redirectUrl !== getLoginUrl()) {
        window.location.replace(redirectUrl);
      } else if (!redirectUrl) {
        setError(t('auth.noRoleError'));
      }
    }
  }, [isAuthenticated, isLoading, user, t]);

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

      if (redirectUrl && redirectUrl !== getLoginUrl()) {
        window.location.assign(redirectUrl);
      } else if (!redirectUrl) {
        setError(t('auth.noRoleError'));
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err?.message || 'Не удалось выполнить вход. Проверьте логин и пароль.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="sso-page">
      <section className="sso-panel" aria-labelledby="sso-title">
        <div className="sso-tabs">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              className={`sso-tab ${currentLang === lang.code ? 'sso-tab--active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
              type="button"
            >
              {lang.code === 'kk' ? 'Қаз' : lang.code === 'ru' ? 'Рус' : 'Eng'}
            </button>
          ))}
        </div>

        <div className="sso-content">
          <h1 id="sso-title" className="sso-title">
            {t('auth.learningSystem')}
          </h1>

          <form className="sso-form" onSubmit={handleSubmit}>
            <div className="sso-field">
              <input
                autoComplete="username"
                autoFocus
                name="login"
                onChange={handleChange}
                placeholder={t('auth.usernamePlaceholder')}
                required
                type="text"
                value={credentials.login}
              />
            </div>

            <div className="sso-field sso-field--password">
              <input
                autoComplete="current-password"
                name="password"
                onChange={handleChange}
                placeholder={t('auth.passwordPlaceholder')}
                required
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
              />
              <button
                className="sso-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                type="button"
              >
                <img
                  src={showPassword ? eyeOffIcon : eyeIcon}
                  className="sso-eye-icon"
                  alt={showPassword ? "Hide password" : "Show password"}
                />
              </button>
            </div>

            {error && <div className="sso-error" role="alert">{error}</div>}

            <button className="sso-submit" disabled={isSubmitting || isLoading} type="submit">
              {isSubmitting || isLoading ? t('auth.loading') : t('auth.signIn').toUpperCase()}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
