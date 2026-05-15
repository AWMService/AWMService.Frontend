import { normalizeRole, normalizeRoles, ROLES, UNIVERSAL_ROLES } from './roles';

const DEFAULT_APP_URLS = {
  auth: 'http://localhost:3000',
  student: 'http://localhost:3001',
  universal: 'http://localhost:3002',
  department: 'http://localhost:3003',
  admin: 'http://localhost:3004',
};

const getEnvValue = (key) => {
  try {
    return import.meta.env?.[key];
  } catch {
    return undefined;
  }
};

const getBaseUrl = (envKey, fallbackKey) => {
  const value = getEnvValue(envKey) || DEFAULT_APP_URLS[fallbackKey];
  return value.replace(/\/+$/, '');
};

export const getAuthBaseUrl = () => getBaseUrl('VITE_AUTH_APP_URL', 'auth');

export const getLoginUrl = (returnTo = typeof window !== 'undefined' ? window.location.href : '') => {
  const url = new URL('/login', getAuthBaseUrl());
  if (returnTo) {
    url.searchParams.set('returnTo', returnTo);
  }
  return url.toString();
};

export const getLogoutUrl = () => {
  const url = new URL('/logout', getAuthBaseUrl());
  return url.toString();
};

const ROLE_DESTINATIONS = {
  [ROLES.STUDENT]: {
    app: 'student',
    envKey: 'VITE_STUDENT_APP_URL',
    path: '/choose-theme',
  },
  [ROLES.SUPERVISOR]: {
    app: 'universal',
    envKey: 'VITE_UNIVERSAL_APP_URL',
    path: '/my-topics',
  },
  [ROLES.REVIEWER]: {
    app: 'universal',
    envKey: 'VITE_UNIVERSAL_APP_URL',
    path: '/reviews',
  },
  [ROLES.NORMOCONTROL]: {
    app: 'universal',
    envKey: 'VITE_UNIVERSAL_APP_URL',
    path: '/documents',
  },
  [ROLES.CHAIRMAN]: {
    app: 'universal',
    envKey: 'VITE_UNIVERSAL_APP_URL',
    path: '/schedule',
  },
  [ROLES.SECRETARY]: {
    app: 'universal',
    envKey: 'VITE_UNIVERSAL_APP_URL',
    path: '/schedule',
  },
  [ROLES.COMMISSION_MEMBER]: {
    app: 'universal',
    envKey: 'VITE_UNIVERSAL_APP_URL',
    path: '/schedule',
  },
  [ROLES.DEPARTMENT]: {
    app: 'department',
    envKey: 'VITE_DEPARTMENT_APP_URL',
    path: '/supervisors',
  },
  [ROLES.ADMIN]: {
    app: 'admin',
    envKey: 'VITE_ADMIN_APP_URL',
    path: '/users',
  },
  [ROLES.VICE_RECTOR]: {
    app: 'admin',
    envKey: 'VITE_ADMIN_APP_URL',
    path: '/monitoring',
  },
};

const ROLE_PRIORITY = [
  ROLES.ADMIN,
  ROLES.VICE_RECTOR,
  ROLES.DEPARTMENT,
  ROLES.STUDENT,
  ROLES.SUPERVISOR,
  ROLES.REVIEWER,
  ROLES.NORMOCONTROL,
  ROLES.CHAIRMAN,
  ROLES.SECRETARY,
  ROLES.COMMISSION_MEMBER,
];

const getRolesFromUserOrList = (userOrRoles) => {
  if (Array.isArray(userOrRoles)) {
    return userOrRoles;
  }
  return userOrRoles?.roles || [];
};

export const getPrimaryRole = (userOrRoles, preferredRole) => {
  const savedRole = preferredRole ?? (
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('awm-current-role')
      : null
  );
  const roles = normalizeRoles(getRolesFromUserOrList(userOrRoles));
  const normalizedPreferredRole = normalizeRole(savedRole);

  if (normalizedPreferredRole && roles.includes(normalizedPreferredRole)) {
    return normalizedPreferredRole;
  }

  return ROLE_PRIORITY.find((role) => roles.includes(role)) || roles[0] || null;
};

export const getDefaultRouteForRole = (role) => {
  const normalizedRole = normalizeRole(role);
  return ROLE_DESTINATIONS[normalizedRole]?.path || '/';
};

export const getCabinetTarget = (userOrRoles, preferredRole) => {
  const role = getPrimaryRole(userOrRoles, preferredRole);
  const destination = ROLE_DESTINATIONS[role];

  if (!destination) {
    return null;
  }

  const baseUrl = getBaseUrl(destination.envKey, destination.app);
  const url = new URL(destination.path, baseUrl);

  return {
    role,
    href: url.toString(),
    path: destination.path,
    app: destination.app,
  };
};

export const appendAuthTokensToUrl = (href, { token, refreshToken } = {}) => {
  if (!token && !refreshToken) {
    return href;
  }

  const url = new URL(href, typeof window !== 'undefined' ? window.location.href : undefined);
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));

  if (token) {
    hashParams.set('access_token', token);
  }
  if (refreshToken) {
    hashParams.set('refresh_token', refreshToken);
  }

  url.hash = hashParams.toString();
  return url.toString();
};

export const getCabinetUrl = (userOrRoles, options = {}) => {
  const target = getCabinetTarget(userOrRoles, options.preferredRole);
  if (!target) {
    return getLoginUrl();
  }
  return appendAuthTokensToUrl(target.href, options);
};

export const hasAnyRole = (userRoles = [], allowedRoles = []) => {
  if (!allowedRoles?.length) {
    return true;
  }

  const normalizedUserRoles = normalizeRoles(userRoles);
  const normalizedAllowedRoles = normalizeRoles(allowedRoles);
  return normalizedAllowedRoles.some((role) => normalizedUserRoles.includes(role));
};

const getAllowedReturnOrigins = () => [
  typeof window !== 'undefined' ? window.location.origin : null,
  getAuthBaseUrl(),
  getBaseUrl('VITE_STUDENT_APP_URL', 'student'),
  getBaseUrl('VITE_UNIVERSAL_APP_URL', 'universal'),
  getBaseUrl('VITE_DEPARTMENT_APP_URL', 'department'),
  getBaseUrl('VITE_ADMIN_APP_URL', 'admin'),
].filter(Boolean).map((origin) => new URL(origin).origin);

export const getReturnToUrl = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = new URLSearchParams(window.location.search).get('returnTo');
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value, window.location.origin);
    if (!getAllowedReturnOrigins().includes(url.origin)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
};

export const getPostLoginRedirectUrl = (userOrRoles, tokens = {}) => {
  const returnTo = getReturnToUrl();
  if (returnTo) {
    return appendAuthTokensToUrl(returnTo, tokens);
  }
  return getCabinetUrl(userOrRoles, tokens);
};

export const redirectToLogin = (returnTo) => {
  window.location.assign(getLoginUrl(returnTo));
};

export const redirectToCabinet = (userOrRoles, tokens = {}) => {
  window.location.assign(getCabinetUrl(userOrRoles, tokens));
};

export const isUniversalRole = (role) => UNIVERSAL_ROLES.includes(normalizeRole(role));
