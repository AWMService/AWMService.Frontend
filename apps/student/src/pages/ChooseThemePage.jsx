import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StudentThemeCard } from '../components/StudentThemeCard/StudentThemeCard';
import './StudentPage.css';

const initialThemes = [
    {
        id: 1,
        title: "Разработка сайта, продукта, базы данных",
        description: "Разработка сайта включает в себя проектирование, реализацию и тестирование веб-ресурса...",
        supervisor: "Иванов И.И",
        availableSlots: 2,
        direction: "Машинное обучение",
        workType: "Дипломная работа",
        status: 'default',
    },
    {
        id: 2,
        title: "Анализ больших данных для предсказания оттока клиентов",
        description: "Исследование и применение моделей машинного обучения для анализа данных и выявления факторов, влияющих на отток клиентов.",
        supervisor: "Петров А.В.",
        availableSlots: 1,
        direction: "Анализ данных",
        workType: "Магистерская диссертация",
        status: 'applied',
    },
    {
        id: 3,
        title: "Разработка мобильного приложения для фитнес-трекинга",
        description: "Создание кросс-платформенного мобильного приложения для отслеживания физической активности и питания.",
        supervisor: "Сидорова М.А.",
        availableSlots: 0,
        direction: "Мобильные технологии",
        workType: "Дипломная работа",
        status: 'rejected',
        rejectionReason: "Выбранная тема уже занята другим студентом."
    }
];

export default function ChooseThemePage() {
  const { t } = useTranslation();
  const [themes, setThemes] = useState(initialThemes);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSupervisor, setFilterSupervisor] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterWorkType, setFilterWorkType] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');

  const [applyingThemeId, setApplyingThemeId] = useState(null);
  const [motivationLetter, setMotivationLetter] = useState('');

  const supervisors = useMemo(() => [...new Set(themes.map(t => t.supervisor))], [themes]);
  const directions = useMemo(() => [...new Set(themes.map(t => t.direction))], [themes]);
  const workTypes = useMemo(() => [...new Set(themes.map(t => t.workType))], [themes]);

  const hasActiveFilters = searchTerm || filterSupervisor !== 'all' || filterDirection !== 'all'
      || filterWorkType !== 'all' || filterAvailability !== 'all';

  const filteredThemes = useMemo(() => {
    return themes.filter(theme => {
      if (searchTerm && !theme.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterSupervisor !== 'all' && theme.supervisor !== filterSupervisor) return false;
      if (filterDirection !== 'all' && theme.direction !== filterDirection) return false;
      if (filterWorkType !== 'all' && theme.workType !== filterWorkType) return false;
      if (filterAvailability === 'available' && theme.availableSlots === 0) return false;
      if (filterAvailability === 'occupied' && theme.availableSlots > 0) return false;
      return true;
    });
  }, [themes, searchTerm, filterSupervisor, filterDirection, filterWorkType, filterAvailability]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterSupervisor('all');
    setFilterDirection('all');
    setFilterWorkType('all');
    setFilterAvailability('all');
  };

  const handleApplyClick = (themeId) => {
    setApplyingThemeId(themeId);
    setMotivationLetter('');
  };

  const handleConfirmApply = () => {
    if (applyingThemeId == null) return;
    setThemes(prev => prev.map(th =>
        th.id === applyingThemeId ? { ...th, status: 'applied' } : th
    ));
    setApplyingThemeId(null);
    setMotivationLetter('');
  };

  const handleCancelApply = () => {
    setApplyingThemeId(null);
    setMotivationLetter('');
  };

  const handleCancel = (themeId) => {
    setThemes(prev => prev.map(th => th.id === themeId ? { ...th, status: 'default' } : th));
  };

  const handleReapply = (themeId) => {
    setThemes(prev => prev.map(th =>
        th.id === themeId ? { ...th, status: 'applied', rejectionReason: undefined } : th
    ));
  };

  return (
    <div className="student-content-container">
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
        {filteredThemes.length > 0 ? (
          filteredThemes.map(theme => (
            <StudentThemeCard
              key={theme.id}
              theme={theme}
              onApply={handleApplyClick}
              onCancel={handleCancel}
              onReapply={handleReapply}
            />
          ))
        ) : (
          <div className="no-themes-message">{t('student.noThemesFound')}</div>
        )}
      </div>

      {applyingThemeId != null && (
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
              <button className="btn-compact btn-primary" onClick={handleConfirmApply}>
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
