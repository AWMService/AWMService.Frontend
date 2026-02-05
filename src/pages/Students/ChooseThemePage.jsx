import React, { useState } from 'react';
import { StudentThemeCard } from '../../components/Students/StudentThemeCard/StudentThemeCard';
import './StudentPage.css';

const initialThemes = [
    {
        id: 1,
        title: "Разработка сайта, продукта, базы данных",
        description: "Разработка сайта включает в себя проектирование, реализацию и тестирование веб-ресурса...",
        supervisor: "Иванов И.И",
        availableSlots: 2,
        direction: "Машинное обучение",
        status: 'default',
    },
    {
        id: 2,
        title: "Анализ больших данных для предсказания оттока клиентов",
        description: "Исследование и применение моделей машинного обучения для анализа данных и выявления факторов, влияющих на отток клиентов.",
        supervisor: "Петров А.В.",
        availableSlots: 1,
        direction: "Анализ данных",
        status: 'applied',
    },
    {
        id: 3,
        title: "Разработка мобильного приложения для фитнес-трекинга",
        description: "Создание кросс-платформенного мобильного приложения для отслеживания физической активности и питания.",
        supervisor: "Сидорова М.А.",
        availableSlots: 0,
        direction: "Мобильные технологии",
        status: 'rejected',
        rejectionReason: "Выбранная тема уже занята другим студентом."
    }
];

export default function ChooseThemePage() {
  const [themes, setThemes] = useState(initialThemes);

  const handleApply = (themeId) => {
    setThemes(themes.map(t => t.id === themeId ? { ...t, status: 'applied' } : t));
  };

  const handleCancel = (themeId) => {
    setThemes(themes.map(t => t.id === themeId ? { ...t, status: 'default' } : t));
  };

  const handleReapply = (themeId) => {
    // In a real app, this might open a new application form or just reset the status
    setThemes(themes.map(t => t.id === themeId ? { ...t, status: 'applied', rejectionReason: undefined } : t));
  };


  return (
    <div className="student-content-container">
      <div className="filters-container">
        <input type="text" placeholder="Поиск по названию..." className="search-input" />
        <select className="filter-select">
          <option>Все преподаватели</option>
        </select>
        <select className="filter-select">
          <option>Все направления</option>
        </select>
        <select className="filter-select">
          <option>Все доступные</option>
        </select>
      </div>

      <div className="themes-list-container">
        {themes.map(theme => (
          <StudentThemeCard 
            key={theme.id} 
            theme={theme} 
            onApply={handleApply}
            onCancel={handleCancel}
            onReapply={handleReapply}
          />
        ))}
      </div>
    </div>
  );
}
