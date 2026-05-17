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
  VICE_RECTOR: 'viceRector',
};

export const UNIVERSAL_ROLES = [
  ROLES.SUPERVISOR,
  ROLES.REVIEWER,
  ROLES.NORMOCONTROL,
  ROLES.CHAIRMAN,
  ROLES.SECRETARY,
  ROLES.COMMISSION_MEMBER,
];

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
  [ROLES.VICE_RECTOR]: {
    labelKey: 'roles.viceRector',
    color: '#2563eb',
    icon: 'BarChart3',
  },
};

export const BACKEND_TO_FRONTEND_ROLE_MAP = {
  Student: ROLES.STUDENT,
  Supervisor: ROLES.SUPERVISOR,
  HeadOfDepartment: ROLES.DEPARTMENT,
  Secretary: ROLES.SECRETARY,
  Expert: ROLES.NORMOCONTROL,
  Admin: ROLES.ADMIN,
  CommissionMember: ROLES.COMMISSION_MEMBER,
  Reviewer: ROLES.REVIEWER,
  Chairman: ROLES.CHAIRMAN,
  ViceRector: ROLES.VICE_RECTOR,
};

const FRONTEND_ROLE_KEYS = new Set(Object.values(ROLES));

export const normalizeRole = (role) => {
  if (!role) {
    return null;
  }

  // Map database PK IDs (from DbSeeder insertion order) to frontend roles
  const idMap = {
    1: ROLES.ADMIN,
    2: ROLES.VICE_RECTOR,
    3: ROLES.DEPARTMENT,
    4: ROLES.SUPERVISOR,
    5: ROLES.SECRETARY,
    6: ROLES.NORMOCONTROL,
    7: ROLES.STUDENT,
    8: ROLES.COMMISSION_MEMBER,
  };

  if (idMap[role]) {
    return idMap[role];
  }

  if (FRONTEND_ROLE_KEYS.has(role)) {
    return role;
  }

  return BACKEND_TO_FRONTEND_ROLE_MAP[role] || role.charAt(0).toLowerCase() + role.slice(1);
};

export const normalizeRoles = (roles = []) => (
  roles
    .map(normalizeRole)
    .filter(Boolean)
);
