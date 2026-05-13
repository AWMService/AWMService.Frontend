import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './MonitoringPage.css';

const mockActivity = [
  { id: 1, actor: 'admin@awm.local', action: 'Изменил роли пользователя', target: 'petrov@example.com', severity: 'info', timestamp: '2025-05-20 10:15' },
  { id: 2, actor: 'system', action: 'Автоматическая блокировка', target: 'kozlov@example.com', severity: 'warning', timestamp: '2025-05-20 09:42' },
  { id: 3, actor: 'admin@awm.local', action: 'Создал кафедру', target: 'Кафедра кибербезопасности', severity: 'info', timestamp: '2025-05-19 17:20' },
  { id: 4, actor: 'gateway', action: 'Ошибка авторизации', target: '10.12.0.45', severity: 'error', timestamp: '2025-05-19 15:07' },
  { id: 5, actor: 'system', action: 'Резервная копия завершена', target: 'db-prod-1', severity: 'success', timestamp: '2025-05-19 02:00' },
];

const kpi = [
  { key: 'activeUsers', labelKey: 'admin.activeUsers', value: 246 },
  { key: 'errorRate', labelKey: 'admin.errorsPerDay', value: 12 },
  { key: 'newUsers', labelKey: 'admin.newUsers', value: 17 },
  { key: 'incidents', labelKey: 'admin.incidents', value: 2 },
];

function MonitoringPage() {
  const { t } = useTranslation();
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = useMemo(() => {
    if (severityFilter === 'all') return mockActivity;
    return mockActivity.filter((item) => item.severity === severityFilter);
  }, [severityFilter]);

  return (
    <div className="monitoring-page">
      <div className="page-header">
        <div>
          <h1>{t('admin.monitoring')}</h1>
          <p className="page-subtitle">{t('admin.activityLog')} / {t('admin.errorLog')}</p>
        </div>
      </div>

      <div className="kpi-grid">
        {kpi.map((item) => (
          <div className="kpi-card" key={item.key}>
            <div className="kpi-label">{t(item.labelKey)}</div>
            <div className="kpi-value">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="activity-card">
        <div className="activity-card-header">
          <h2>{t('admin.activityLog')}</h2>
          <select
            className="severity-filter"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="activity-list">
          {filtered.map((item) => (
            <div className="activity-item" key={item.id}>
              <span className={`severity severity-${item.severity}`}>{item.severity}</span>
              <div className="activity-main">
                <div className="activity-title">{item.action}</div>
                <div className="activity-meta">
                  <span>{item.actor}</span>
                  <span>{item.target}</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && <div className="empty-state">{t('common.noData')}</div>}
        </div>
      </div>
    </div>
  );
}

export default MonitoringPage;
