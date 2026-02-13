import React from 'react';
import { Link } from 'react-router-dom';
import './ProgressStepper.css';
import doneIcon from '../../assets/icons/done-icon.svg';

const steps = [
  { id: 1, name: 'Выбор темы', path: '/student/choose-theme' },
  { id: 2, name: 'Предзащита 1', path: '/student/pre-defense-1' },
  { id: 3, name: 'Предзащита 2', path: '/student/pre-defense-2' },
  { id: 4, name: 'Нормоконтроль', path: '/student/normocontrol' },
  { id: 5, name: 'Проверка ПО', path: '/student/software-check' },
  { id: 6, name: 'Антиплагиат', path: '/student/antiplagiarism' },
  { id: 7, name: 'Рецензия', path: '/student/critique' },
  { id: 8, name: 'Защита', path: '/student/defense' },
];

export function ProgressStepper({ currentStep = 1, highestCompletedStep = 1 }) {
  return (
      <div className="stepper-container">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isAvailable = step.id <= highestCompletedStep;

          // Линия закрашивается, если мы прошли этот шаг
          const isConnectorFilled = step.id < currentStep;

          const StepCircle = () => (
              <div className={`step-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                {isCompleted ? (
                    <img src={doneIcon} alt="✓" className="icon-svg" />
                ) : (
                    <span>{step.id}</span>
                )}
              </div>
          );

          return (
              <React.Fragment key={step.id}>
                {/* Блок шага */}
                <div className={`step-wrapper ${!isAvailable ? 'disabled' : ''}`}>
                  {isAvailable ? (
                      <Link to={step.path} className="step-link">
                        <StepCircle />
                        <span className={`step-label ${isActive ? 'active' : ''}`}>
                            {step.name}
                        </span>
                      </Link>
                  ) : (
                      <div className="step-link">
                        <StepCircle />
                        <span className="step-label">{step.name}</span>
                      </div>
                  )}
                </div>

                {/* Соединительная линия */}
                {index < steps.length - 1 && (
                    <div className={`connector-line ${isConnectorFilled ? 'filled' : ''}`} />
                )}
              </React.Fragment>
          );
        })}
      </div>
  );
}