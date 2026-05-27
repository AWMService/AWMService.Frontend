import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProgressStepper.css';
import doneIcon from '../assets/icons/done-icon.svg';

export function ProgressStepper({ currentStep = 1, highestCompletedStep = 1, activeCheckTypeCodes = null }) {
  const { t } = useTranslation();

  const allSteps = [
    { id: 1, nameKey: 'student.chooseTheme',    path: '/choose-theme' },
    { id: 2, nameKey: 'student.preDefense1',    path: '/pre-defense-1' },
    { id: 3, nameKey: 'student.preDefense2',    path: '/pre-defense-2' },
    { id: 4, nameKey: 'student.normocontrol',   path: '/normocontrol',   checkTypeCode: 'NORMCONTROL' },
    { id: 5, nameKey: 'student.softwareCheck',  path: '/software-check', checkTypeCode: 'SOFTWARECHECK' },
    { id: 6, nameKey: 'student.antiplagiarism', path: '/antiplagiarism', checkTypeCode: 'ANTIPLAGIARISM' },
    { id: 7, nameKey: 'student.critique',       path: '/critique' },
    { id: 8, nameKey: 'student.defense',        path: '/defense' },
  ];

  // null = no filter (show all); array = show only steps without checkTypeCode OR whose code is in the list
  const steps = activeCheckTypeCodes === null
    ? allSteps
    : allSteps.filter(s => !s.checkTypeCode || activeCheckTypeCodes.includes(s.checkTypeCode));

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
                            {t(step.nameKey)}
                        </span>
                      </Link>
                  ) : (
                      <div className="step-link">
                        <StepCircle />
                        <span className="step-label">{t(step.nameKey)}</span>
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
