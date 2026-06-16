import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StudentThemeCard } from '../components/StudentThemeCard/StudentThemeCard';
import MyApplicationsPage from './MyApplicationsPage.jsx';
import {
  getLocalizedValue,
  normalizeLanguage,
  useAuth,
  useAvailableTopics,
  useCreateApplication,
  useMyApplications,
  useWithdrawApplication,
} from '@awm/shared';
import './StudentPage.css';

export default function ChooseThemePage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const currentLanguage = normalizeLanguage(i18n.language);
  const { data: availableTopics = [], isLoading, error } = useAvailableTopics(user?.orgUnitId, user?.currentSemesterId);
  const { data: myApplications = [] } = useMyApplications(user?.currentSemesterId);
  const createApplication = useCreateApplication();
  const withdrawApplication = useWithdrawApplication();

  const [activeTab, setActiveTab] = useState('themes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSupervisor, setFilterSupervisor] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterWorkType, setFilterWorkType] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');

  const [applyingThemeId, setApplyingThemeId] = useState(null);
  const [motivationLetter, setMotivationLetter] = useState('');

  const applicationByTopicId = useMemo(() => {
    const map = new Map();
    myApplications.forEach((application) => {
      if (!map.has(application.topicId) || application.status === 'pending') {
        map.set(application.topicId, application);
      }
    });
    return map;
  }, [myApplications]);

  
  const assignedApplication = useMemo(() =>
    myApplications.find(a => a.status === 'approved'),
  [myApplications]);

  const isAlreadyAssigned = !!assignedApplication;

  const themes = useMemo(() => availableTopics.map((topic) => {
    const application = applicationByTopicId.get(topic.id);
    const status = application?.status === 'approved'
      ? 'approved'
      : application?.status === 'rejected'
        ? 'rejected'
        : application?.status === 'pending'
          ? 'applied'
          : 'default';

    return {
      id: topic.id,
      applicationId: application?.id,
      title: getLocalizedValue(topic.title, currentLanguage),
      description: getLocalizedValue(topic.description, currentLanguage),
      supervisor: topic.supervisorName || `#${topic.supervisorId}`,
      availableSlots: topic.availableSpots,
      direction: getLocalizedValue(topic.directionTitle, currentLanguage) || t('common.noData'),
      workType: topic.workTypeName || topic.workTypeId,
      status,
      isAssigned: status === 'approved',
      rejectionReason: application?.reviewComment,
    };
  }), [availableTopics, applicationByTopicId, currentLanguage, t]);

  const supervisors = useMemo(() => [...new Set(themes.map(t => t.supervisor))], [themes]);
  const directions = useMemo(() => [...new Set(themes.map(t => t.direction))], [themes]);
  const workTypes = useMemo(() => [...new Set(themes.map(t => t.workType))], [themes]);

  const hasActiveFilters = searchTerm || filterSupervisor !== 'all' || filterDirection !== 'all'
      || filterWorkType !== 'all' || filterAvailability !== 'all';

  const filteredThemes = useMemo(() => {
    let result = themes.filter(theme => {
      if (searchTerm && !theme.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterSupervisor !== 'all' && theme.supervisor !== filterSupervisor) return false;
      if (filterDirection !== 'all' && theme.direction !== filterDirection) return false;
      if (filterWorkType !== 'all' && theme.workType !== filterWorkType) return false;
      if (filterAvailability === 'available' && theme.availableSlots === 0) return false;
      if (filterAvailability === 'occupied' && theme.availableSlots > 0) return false;
      return true;
    });

    
    result.sort((a, b) => {
      if (a.isAssigned && !b.isAssigned) return -1;
      if (!a.isAssigned && b.isAssigned) return 1;
      return 0;
    });

    return result;
  }, [themes, searchTerm, filterSupervisor, filterDirection, filterWorkType, filterAvailability]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterSupervisor('all');
    setFilterDirection('all');
    setFilterWorkType('all');
    setFilterAvailability('all');
  };

  const handleApplyClick = (themeId) => {
    if (isAlreadyAssigned) return;
    setApplyingThemeId(themeId);
    setMotivationLetter('');
  };

  const handleConfirmApply = async () => {
    if (applyingThemeId == null) return;
    await createApplication.mutateAsync({
      topicId: applyingThemeId,
      motivationLetter,
    });
    setApplyingThemeId(null);
    setMotivationLetter('');
  };

  const handleCancelApply = () => {
    setApplyingThemeId(null);
    setMotivationLetter('');
  };

  const handleCancel = async (themeId) => {
    const application = applicationByTopicId.get(themeId);
    if (!application?.id) return;
    await withdrawApplication.mutateAsync(application.id);
  };

  const handleReapply = (themeId) => {
    handleApplyClick(themeId);
  };

  return (
    <div className="student-content-container">
      {}
      <div className="student-tabs">
        <button
          className={`student-tab ${activeTab === 'themes' ? 'active' : ''}`}
          onClick={() => setActiveTab('themes')}
        >
          {t('student.availableThemes')}
        </button>
        <button
          className={`student-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          {t('student.myApplicationsTitle')}
        </button>
      </div>

      {activeTab === 'themes' && (
        <>
          <div className="filters-container">
            <input
              type="text"
              placeholder={t('student.searchByTitle')}
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={filterSupervisor}
              onChange={(e) => setFilterSupervisor(e.target.value)}
            >
              <option value="all">{t('student.allTeachers')}</option>
              {supervisors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="filter-select"
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
            >
              <option value="all">{t('student.allDirections')}</option>
              {directions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              className="filter-select"
              value={filterWorkType}
              onChange={(e) => setFilterWorkType(e.target.value)}
            >
              <option value="all">{t('student.allWorkTypes')}</option>
              {workTypes.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <select
              className="filter-select"
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
            >
              <option value="all">{t('student.allAvailable')}</option>
              <option value="available">{t('student.placesAvailable', { count: '' }).trim()}</option>
              <option value="occupied">{t('student.occupied')}</option>
            </select>
            {hasActiveFilters && (
              <button className="btn-compact btn-reset-filters" onClick={resetFilters}>
                {t('student.resetFilters')}
              </button>
            )}
          </div>

          <div className="themes-list-container">
            {isLoading ? (
              <div className="no-themes-message">{t('common.loading')}...</div>
            ) : error ? (
              <div className="no-themes-message">{error.message}</div>
            ) : filteredThemes.length > 0 ? (
              filteredThemes.map(theme => (
                <StudentThemeCard
                  key={theme.id}
                  theme={theme}
                  isAlreadyAssigned={isAlreadyAssigned}
                  onApply={handleApplyClick}
                  onCancel={handleCancel}
                  onReapply={handleReapply}
                />
              ))
            ) : (
              <div className="no-themes-message">{t('student.noThemesFound')}</div>
            )}
          </div>
        </>
      )}

      {activeTab === 'history' && <MyApplicationsPage />}

      {applyingThemeId != null && !isAlreadyAssigned && (
        <div className="modal-overlay" onClick={handleCancelApply}>
          <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('student.applyForTheme')}</h3>
            <textarea
              className="motivation-textarea"
              placeholder={t('student.motivationPlaceholder')}
              value={motivationLetter}
              onChange={(e) => setMotivationLetter(e.target.value)}
              rows={5}
            />
            <p className="motivation-hint">{t('student.motivationLetter')}</p>
            <div className="apply-modal-actions">
              <button className="btn-compact btn-outline-primary" onClick={handleCancelApply}>
                {t('common.cancel')}
              </button>
              <button
                className="btn-compact btn-primary"
                onClick={handleConfirmApply}
                disabled={createApplication.isPending}
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

